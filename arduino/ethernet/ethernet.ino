/*

 This sketch connects to the stairathon web app and makes a request
 using the Ethernet shield.

 This example uses DNS, by assigning the Ethernet client with a MAC address,
 IP address, and DNS address.

 Circuit:
 * Ethernet shield attached to pins 10, 11, 12, 13

 based on examples of the webclient and repeating web client

 Created 16 September 2015
 by Ramkumar Shankar

 */

#include <SPI.h>
#include <Ethernet.h>

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

char server[] = "stairathon.herokuapp.com";
//IPAddress server(xxx,xxx,xxx,xxx);

//Ramkumar - these are not used now
unsigned long lastConnectionTime = 0;             // last time you connected to the server, in milliseconds
const unsigned long postingInterval = 10L * 1000L; // delay between updates, in milliseconds
// the "L" is needed to use long type numbers

void setup() {
  // start serial port:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for Leonardo only
  }

  // give the ethernet module time to boot up:
  delay(1000);
  if (Ethernet.begin(mac) == 0) {
    Serial.println("Failed to configure Ethernet using DHCP");
    // try to congifure using IP address instead of DHCP:
    //Ethernet.begin(mac, ip);
  }
  // start the Ethernet connection using a fixed IP address and DNS server:
  //Ethernet.begin(mac, ip, myDns);
  // print the Ethernet board/shield's IP address:
  Serial.print("My IP address: ");
  Serial.println(Ethernet.localIP());
  //Fire an http request to the web application
  httpRequest();
}

void loop() {
  //Maintain DHCP lease
  Ethernet.maintain();
  
  // if there's incoming data from the net connection.
  // send it out the serial port.  This is for debugging
  // purposes only:
  if (client.available()) {
    char c = client.read();
    Serial.write(c);
  }

  // if the server's disconnected, stop the client:
  if (!client.connected()) {
    Serial.println();
    Serial.println("disconnecting.");
    client.stop();

    // do nothing forevermore:
    while (true);
  }
}

// this method makes a HTTP connection to the server:
void httpRequest() {
  // close any connection before send a new request.
  // This will free the socket on the WiFi shield
  client.stop();

  // if there's a successful connection:
  String postData = "id=1234";
  if (client.connect(server, 80)) {
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
    
    // note the time that the connection was made:
    lastConnectionTime = millis();
  } else {
    // if you couldn't make a connection:
    Serial.println("connection failed");
  }
}
