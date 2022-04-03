
#include <WiFi.h>
#include <FirebaseESP32.h>

//Defining our firebase host
#define FIREBASE_HOST "https://phoenix-ec8d2-default-rtdb.europe-west1.firebasedatabase.app/"
//the authentication key
#define FIREBASE_AUTH "EaWyuTfY9QQz7BXGqEMQmfJEQN4ovL20BTZFs4lm"

//Put THE SSID and PASSWORD HERE
#define WIFI_SSID ""
#define WIFI_PASSWORD ""

//Push button GPIO
const int PushButton = 15;

//Define FirebaseESP32 data object
FirebaseData firebaseData;
FirebaseJson json;

//State buffers
int state = 0;
int prev_state = 0;

void setup()
{
  /*This setup method is executed everytime when you restart the device.
    It should connect to the internet and to the firebase realtime
    database. Before initializing the internet and firebase connection
    the function is setting the pin mode for the push button.*/

  Serial.begin(115200);
  pinMode(PushButton, INPUT);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);

  Firebase.setReadTimeout(firebaseData, 1000 * 60);

  Firebase.setwriteSizeLimit(firebaseData, "tiny");

  Serial.println("------------------------------------");
  Serial.println("Connected...");

}

void loop()
{
  //Reading the current state from the button
  int Push_button_state = digitalRead(PushButton);

  //If the button is not pressed the program is sending 
  if ( Push_button_state == LOW)
  {
    state = 0;
    if (prev_state == state) {
      return;
    }
    Serial.println(Push_button_state);
    json.set("/value", 0);
    Firebase.updateNode(firebaseData,"/",json);
    delay(1000);
    prev_state = state;
  }
  else
  {
    state = 1;
    if (prev_state == state) {
      return;
    }
    Serial.println(Push_button_state);

    json.set("/value", 1);
    Firebase.updateNode(firebaseData,"/",json);
    delay(1000);
    prev_state = state;
  }
}
