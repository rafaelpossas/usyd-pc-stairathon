#include <SPI.h>
#include <Ethernet.h>
#include <MFRC522.h>

/* Ahmad: "Because both RFID and Ethernet shield are using SPI protocol and need to be controlled for not transeiving overlapped data and
since SS pin (Shield select pin) of Ethernet is pin number 10 and we are not able to change its hardware, therefore we assign pin number 8 to SS pin of RFID." */
#define SS_PIN_RFID    2    // Changed from 10 to 8 to work with Ethernet shield
#define RST_PIN_RFID   4 


MFRC522 mfrc522(SS_PIN_RFID, RST_PIN_RFID); // Create MFRC522 instance

int redLed = 3; //for RED LED
int grnLed = 5; //for GREEN LED
int bluLed = 6; //for BLUE LED
int piezo  = 7; //for PIEZO (Sound)

// assign a MAC address for the ethernet controller.
// fill in your address here:
byte mac[] = {
  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED
};
// fill in an available IP address on your network here,
// for manual configuration:
//IPAddress ip(192, 168, 1, 177);

// fill in your Domain Name Server address here:
//IPAddress myDns(1, 1, 1, 1);

// initialize the library instance:
EthernetClient client;

//Modify this to connect to the right server
char server[] = "stairathon.herokuapp.com";
//char server[] = "10.19.216.48";

//UID of the card
String myID = "";

//IPAddress server(xxx,xxx,xxx,xxx);

signed long timeout = 0;             // last time you connected to the server, in milliseconds
//const unsigned long postingInterval = 10L * 1000L; // delay between updates, in milliseconds
// the "L" is needed to use long type numbers

void setup() {
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for Leonardo only
  }

  pinMode(redLed, OUTPUT);
  pinMode(bluLed, OUTPUT);
  pinMode(grnLed, OUTPUT);
  pinMode(piezo, OUTPUT);

RepeatDHCP:
  enableEthernet();

  // give the ethernet module time to boot up:
  delay(1000);
  //Ethernet.begin(mac);
  Serial.println("Trying DHCP");
  if (Ethernet.begin(mac) == 0) {
    Serial.println("Failed to configure Ethernet using DHCP");
    analogWrite(redLed, 255);
    // try to congifure using IP address instead of DHCP:
    //Ethernet.begin(mac, ip);
  }
  // start the Ethernet connection using a fixed IP address and DNS server:
  //Ethernet.begin(mac, ip, myDns);
  // print the Ethernet board/shield's IP address:
  Serial.print("My IP address: ");
  Serial.println(Ethernet.localIP());

// Ahmad: "Successfull Connection's indication."  
  if(Ethernet.localIP() > 0){
    Serial.println("Successful Connection!");
    analogWrite(redLed, 0);
    analogWrite(grnLed, 100);
    analogWrite(bluLed, 0);
  }
  else{
    analogWrite(redLed, 255);
    analogWrite(grnLed, 0);
    analogWrite(bluLed, 0);
  }
  //Fire an http request to the web application
  //httpRequest();

  //RFID
  //SPI.begin();      // Init SPI bus
  if(Ethernet.localIP() > 0){  
    enableRFID();
    delay(2000);
    mfrc522.PCD_Init();   // Init MFRC522
    ShowReaderDetails();  // Show details of PCD - MFRC522 Card Reader details
    Serial.println(F("Scan a Card"));
    //dump_byte_array(key.keyByte, MFRC522::MF_KEY_SIZE);     //Get key byte size
    //timeout = 0;  
    delay(2000);
    Serial.println(F("Scan PICC to see UID, type, and data blocks..."));
    //Initialize onboard LED for feedback
    //pinMode(led, OUTPUT);
  } else goto RepeatDHCP;
}

void loop() {
/*
  // Regular Network Connection examination
  if(Ethernet.maintain() % 2 == 1)   software_Reset(); // In case of Network Disconnection
*/  
  //Ethernet
  //Maintain DHCP lease
  Ethernet.maintain();

  //RFID reader
  // Look for new cards
  if ( ! mfrc522.PICC_IsNewCardPresent()) {
    return;
  }

  // Select one of the cards
  if ( ! mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  GetUID();

  //digitalWrite(led, HIGH);
  /*Serial.println();
  delay(2000);
  digitalWrite(led, LOW);*/
  //enableEthernet();
  if (myID.length() > 0) {
    Serial.println("doing the http request");
    httpRequest();
    myID = "";
  }

  // if there's incoming data from the net connection.
  // send it out the serial port.  This is for debugging
  // purposes only:
  if (client.available()) {
    char c = client.read();
    Serial.write(c);
  }

// Ahmad: "To prevent Multiple Card Reading when a card gets held in front of the reader for a while."
  mfrc522.PICC_HaltA();

  delay(1000);

  // if the server's disconnected, stop the client:
  /*if (!client.connected()) {
    Serial.println();
    Serial.println("disconnecting.");
    client.stop();
    // do nothing forevermore:
    while (true);
  }*/
}

void ShowReaderDetails() {
  // Get the MFRC522 software version
  byte v = mfrc522.PCD_ReadRegister(mfrc522.VersionReg);
  Serial.print(F("MFRC522 Software Version: 0x"));
  Serial.print(v, HEX);
  if (v == 0x91)
    Serial.print(F(" = v1.0"));
  else if (v == 0x92)
    Serial.print(F(" = v2.0"));
  else
    Serial.print(F(" (unknown)"));
  Serial.println("");
  // When 0x00 or 0xFF is returned, communication probably failed
  if ((v == 0x00) || (v == 0xFF)) {
    Serial.println(F("WARNING: Communication failure, is the MFRC522 properly connected?"));
  }
}

void GetUID () {
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
    Serial.print(mfrc522.uid.uidByte[i], HEX);
    // Fix for issues with zero
    if (mfrc522.uid.uidByte[i] < 0x10) {
      myID += "0";
    }
    myID += String(mfrc522.uid.uidByte[i], HEX);
  }
  Serial.println();
  Serial.println(myID);
}

// this method makes a HTTP connection to the server:
void httpRequest() {
  // close any connection before send a new request.
  // This will free the socket on the WiFi shield
  client.stop();

  // if there's a successful connection:
  //String postData = "id=" + myID;
  String postData = myID;
  Serial.println("MyID: " + myID);
  Serial.println("Postdata: " + postData);
  
  // Green LED and sound while reading a card successfully
  analogWrite(bluLed, 255);
  analogWrite(redLed, 255);
  tone(piezo,600,100);
  delay(200);
  tone(piezo,600,100);
  
  //Connect to the server
  if (client.connect(server, 80)) {
  //if (client.connect(server, 3000)) {
    timeout = millis() + 5000; //five second timeout
    Serial.println();
    Serial.println("New request");
    client.println("POST /tap HTTP/1.1");
    client.println("Host: stairathon.herokuapp.com");
    client.println("User-Agent: Arduino/1.0");
    client.println("Connection: close");
    client.println("Content-Type: application/x-www-form-urlencoded");
    client.print("Content-Length: ");
    client.println(postData.length());
    client.println();
    client.println(postData);
    
    //Print out request for debugging
    Serial.println("POST /tap HTTP/1.1");
    Serial.println("Host: stairathon.herokuapp.com");
    Serial.println("User-Agent: Arduino/1.0");
    Serial.println("Connection: close");
    Serial.println("Content-Type: application/x-www-form-urlencoded");
    Serial.print("Content-Length: ");
    Serial.println(postData.length());
    Serial.println();
    Serial.println(postData);

    delay(10);
    while (client.available()==0) {
      if (timeout <= millis()) {
        goto timeout;
      }
    }
    while (client.available()>0) {
      //Serial.println("inside available");
      char c = client.read();
      Serial.write(c);
    }
    Serial.println();
    goto noTimeout;
timeout:
    Serial.println("Response timed out!");
    goto endRequest;
noTimeout:
    Serial.println("Response received!");
endRequest:
    client.stop();
    analogWrite(bluLed, 0);
    analogWrite(redLed, 0);
    
    // note the time that the connection was made:
    //lastConnectionTime = millis();
  } else {
    // if you couldn't make a connection:
    Serial.println("connection failed");
  }
}

void enableRFID () {
  //Disables ethernet
  digitalWrite(8, LOW);
  digitalWrite(10, HIGH);
}

void enableEthernet () {
  //Disables RFID
  digitalWrite(8, HIGH);
  digitalWrite(10, LOW);
}
/*
void software_Reset() // Restarts program from beginning but does not reset the peripherals and registers
{
asm volatile ("  jmp 0");  
}*/
