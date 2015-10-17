#include <SPI.h>
#include <SoftwareSerial.h> 
#include <SparkFunESP8266WiFi.h>
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

//WiFi Network Definitions
const char mySSID[] = "mySSIDhere";
const char myPSK[] = "myPassphrasehere";

// To use the ESP8266 as a TCP client, use the 
// ESP8266Client class. First, create an object:
//ESP8266Client client;

//Modify this to connect to the right server
char server[] = "stairathon.herokuapp.com";
//char server[] = "172.20.10.14";

//UID of the card
String myID = "";

signed long timeout = 0;             // last time you connected to the server, in milliseconds
//const unsigned long postingInterval = 10L * 1000L; // delay between updates, in milliseconds
// the "L" is needed to use long type numbers

void setup() {
  Serial.begin(9600);
  SPI.begin();

  pinMode(redLed, OUTPUT);
  pinMode(bluLed, OUTPUT);
  pinMode(grnLed, OUTPUT);
  pinMode(piezo, OUTPUT);

  //Set up shield
  initializeESP8266();

  //Connect to defined WiFi network
  connectESP8266();

  //Display connection info
  displayConnectInfo();  

  // give the ethernet module time to boot up:
  // Ahmad: "Successfull Connection's indication."  
  if(esp8266.localIP() > 0){
    Serial.println("Successful Connection!");
    analogWrite(redLed, 0);
    analogWrite(grnLed, 100);
    analogWrite(bluLed, 0);
    Serial.println("Initializing RFID");
    delay(2000);
    mfrc522.PCD_Init();   // Init MFRC522
    ShowReaderDetails();  // Show details of PCD - MFRC522 Card Reader details
    Serial.println(F("Ready - Scan a card"));
  }
  else{
    analogWrite(redLed, 255);
    analogWrite(grnLed, 0);
    analogWrite(bluLed, 0);
  }
}

void loop() {
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

  if (myID.length() > 0) {
    httpRequest();
    myID = "";
  }

  // Ahmad: "To prevent Multiple Card Reading when a card gets held in front of the reader for a while."
  mfrc522.PICC_HaltA();

  // if there's incoming data from the net connection.
  // send it out the serial port.  This is for debugging
  // purposes only:
  /*if (client.available()) {
    char c = client.read();
    Serial.write(c);
  }*/

  delay(1000);
}

void initializeESP8266()
{
  // esp8266.begin() verifies that the ESP8266 is operational
  // and sets it up for the rest of the sketch.
  // It returns either true or false -- indicating whether
  // communication was successul or not.
  // true
  int test = esp8266.begin();
  if (test != true)
  {
    Serial.println(F("Error talking to ESP8266."));
    errorLoop(test);
  }
  Serial.println(F("ESP8266 Shield Present"));
}

void connectESP8266()
{
  // The ESP8266 can be set to one of three modes:
  //  1 - ESP8266_MODE_STA - Station only
  //  2 - ESP8266_MODE_AP - Access point only
  //  3 - ESP8266_MODE_STAAP - Station/AP combo
  // Use esp8266.getMode() to check which mode it's in:
  int retVal = esp8266.getMode();
  if (retVal != ESP8266_MODE_STA)
  { // If it's not in station mode.
    // Use esp8266.setMode([mode]) to set it to a specified
    // mode.
    retVal = esp8266.setMode(ESP8266_MODE_STA);
    if (retVal < 0)
    {
      Serial.println(F("Error setting mode."));
      errorLoop(retVal);
    }
  }
  Serial.println(F("Mode set to station"));

  // esp8266.status() indicates the ESP8266's WiFi connect
  // status.
  // A return value of 1 indicates the device is already
  // connected. 0 indicates disconnected. (Negative values
  // equate to communication errors.)
  
  retVal = esp8266.status();
  if (retVal <= 0)
  {
    Serial.print(F("Connecting to "));
    Serial.println(mySSID);
    // esp8266.connect([ssid], [psk]) connects the ESP8266
    // to a network.
    // On success the connect function returns a value >0
    // On fail, the function will either return:
    //  -1: TIMEOUT - The library has a set 30s timeout
    //  -3: FAIL - Couldn't connect to network.
    retVal = esp8266.connect(mySSID, myPSK);
    if (retVal < 0)
    {
      Serial.println(F("Error connecting"));
      errorLoop(retVal);
    }
  }
}

void displayConnectInfo()
{
  char connectedSSID[24];
  memset(connectedSSID, 0, 24);
  // esp8266.getAP() can be used to check which AP the
  // ESP8266 is connected to. It returns an error code.
  // The connected AP is returned by reference as a parameter.
  int retVal = esp8266.getAP(connectedSSID);
  if (retVal > 0)
  {
    Serial.print(F("Connected to: "));
    Serial.println(connectedSSID);
  }

  // esp8266.localIP returns an IPAddress variable with the
  // ESP8266's current local IP address.
  IPAddress myIP = esp8266.localIP();
  Serial.print(F("My IP: ")); Serial.println(myIP);
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
  ESP8266Client client;

  // if there's a successful connection:
  String postData = "id=" + myID;
  //String postData = myID;
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
    timeout = millis() + 10000; //ten second timeout
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
    /* Serial.println("POST /tap HTTP/1.1");
    Serial.println("Host: stairathon.herokuapp.com");
    Serial.println("User-Agent: Arduino/1.0");
    Serial.println("Connection: close");
    Serial.println("Content-Type: application/x-www-form-urlencoded");
    Serial.print("Content-Length: ");
    Serial.println(postData.length());
    Serial.println();
    Serial.println(postData);*/

    delay(10);
    while (client.available()==0) {
      if (timeout <= millis()) {
        goto timeout;
      }
    }
    /*while (client.available()>0) {
      char c = client.read();
      Serial.write(c);
    }*/
    while (client.available()) {
      //delay(2000);
      //Serial.println("printing response");
      Serial.write(client.read()); // read() gets the FIFO char
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

// errorLoop prints an error code, then loops forever.
void errorLoop(int error)
{
  Serial.print(F("Error: ")); Serial.println(error);
  Serial.println(F("Looping forever."));
  for (;;)
    ;
}
