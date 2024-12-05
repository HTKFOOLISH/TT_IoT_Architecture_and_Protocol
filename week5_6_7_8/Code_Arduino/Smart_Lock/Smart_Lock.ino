#include <WiFi.h>
#include <Adafruit_Fingerprint.h>
#include <SPI.h>
#include <MFRC522.h>
#include <FirebaseESP32.h>

// Wi-Fi credentials
const char* ssid = "Be Kind P403";
const char* password = "bekindp4033";

// Firebase configuration
#define FIREBASE_HOST "smartlock-684eb.firebaseio.com"
#define FIREBASE_AUTH "WOfqX0Sbf5BlGa55bEU07ux9SwngtlW8S2ycukay"

FirebaseData firebaseData; // Firebase data object

// Pin definitions
#define RELAY_PIN 4
#define LIGHT_PIN 25
#define BUZZER_PIN 26
#define PIR_PIN 15
#define MOTION_LED_PIN 2

// RFID Pin definitions
#define RST_PIN 22
#define SDA_PIN 21
byte validUID[4] = {0x13, 0xE5, 0x38, 0x2D};

// Fingerprint sensor pins
#define MODEM_RX 16
#define MODEM_TX 17
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&Serial2);

// RFID reader
MFRC522 rfid(SDA_PIN, RST_PIN);

void setup() {
  Serial.begin(9600);
  while (!Serial);

  // Connect to Wi-Fi
  connectWiFi();

  // Firebase initialization
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);

  // Initialize fingerprint sensor
  Serial2.begin(57600, SERIAL_8N1, MODEM_RX, MODEM_TX);
  if (finger.verifyPassword()) {
    Serial.println("Fingerprint sensor ready.");
  } else {
    Serial.println("Fingerprint sensor not found!");
    while (1) { delay(1); }
  }

  // Initialize RFID reader
  SPI.begin();
  rfid.PCD_Init();

  // Configure pins
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(LIGHT_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(PIR_PIN, INPUT);
  pinMode(MOTION_LED_PIN, OUTPUT);

  // Set default pin states
  digitalWrite(RELAY_PIN, LOW);
  digitalWrite(LIGHT_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);

  Serial.println("System initialized.");
}

void loop() {
  // Handle motion detection
  handleMotion();

  // Handle fingerprint authentication
  handleFingerprint();

  // Handle RFID authentication
  handleRFID();

  delay(500);  // Delay for stability
}

void connectWiFi() {
  Serial.print("Connecting to Wi-Fi: ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.print("Connected to Wi-Fi! IP Address: ");
  Serial.println(WiFi.localIP());
}

void handleMotion() {
  int motionState = digitalRead(PIR_PIN);
  if (motionState == HIGH) {
    digitalWrite(MOTION_LED_PIN, HIGH);
    Firebase.setString(firebaseData, "/SystemStatus/Motion", "Detected");
    Firebase.setString(firebaseData, "/SystemStatus/MotionLED", "ON");
    Serial.println("Motion detected.");
  } else {
    digitalWrite(MOTION_LED_PIN, LOW);
    Firebase.setString(firebaseData, "/SystemStatus/Motion", "None");
    Firebase.setString(firebaseData, "/SystemStatus/MotionLED", "OFF");
    Serial.println("No motion.");
  }
}

void handleFingerprint() {
  int id = getFingerprintID();
  if (id != -1) {
    Serial.print("Fingerprint ID verified: ");
    Serial.println(id);

    Firebase.setString(firebaseData, "/SystemStatus/Fingerprint/Status", "Verified");
    Firebase.setInt(firebaseData, "/SystemStatus/Fingerprint/ID", id);

    digitalWrite(RELAY_PIN, HIGH);
    digitalWrite(LIGHT_PIN, HIGH);
    Firebase.setString(firebaseData, "/SystemStatus/Relay", "ON");
    Firebase.setString(firebaseData, "/SystemStatus/Light", "ON");

    delay(5000);

    digitalWrite(RELAY_PIN, LOW);
    digitalWrite(LIGHT_PIN, LOW);
    Firebase.setString(firebaseData, "/SystemStatus/Relay", "OFF");
    Firebase.setString(firebaseData, "/SystemStatus/Light", "OFF");
  } else {
    Firebase.setString(firebaseData, "/SystemStatus/Fingerprint/Status", "Not Verified");
    Serial.println("Fingerprint not recognized.");
  }
}

void handleRFID() {
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    Serial.println("RFID card detected.");

    String uid = "";
    for (byte i = 0; i < 4; i++) {
      uid += String(rfid.uid.uidByte[i], HEX);
      if (i < 3) uid += " ";
    }
    Firebase.setString(firebaseData, "/SystemStatus/RFID/UID", uid);

    if (isValidCard()) {
      Serial.println("RFID access granted.");
      Firebase.setString(firebaseData, "/SystemStatus/RFID/CardStatus", "Granted");

      digitalWrite(LIGHT_PIN, HIGH);
      digitalWrite(RELAY_PIN, HIGH);
      Firebase.setString(firebaseData, "/SystemStatus/Light", "ON");
      Firebase.setString(firebaseData, "/SystemStatus/Relay", "ON");

      delay(5000);

      digitalWrite(LIGHT_PIN, LOW);
      digitalWrite(RELAY_PIN, LOW);
      Firebase.setString(firebaseData, "/SystemStatus/Light", "OFF");
      Firebase.setString(firebaseData, "/SystemStatus/Relay", "OFF");
    } else {
      Serial.println("RFID access denied.");
      Firebase.setString(firebaseData, "/SystemStatus/RFID/CardStatus", "Denied");

      digitalWrite(BUZZER_PIN, HIGH);
      Firebase.setString(firebaseData, "/SystemStatus/Buzzer", "ON");

      delay(1000);

      digitalWrite(BUZZER_PIN, LOW);
      Firebase.setString(firebaseData, "/SystemStatus/Buzzer", "OFF");
    }

    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
  }
}

int getFingerprintID() {
  int p = finger.getImage();
  if (p != FINGERPRINT_OK) return -1;

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK) return -1;

  p = finger.fingerFastSearch();
  if (p != FINGERPRINT_OK) return -1;

  return finger.fingerID;
}

bool isValidCard() {
  for (byte i = 0; i < 4; i++) {
    if (rfid.uid.uidByte[i] != validUID[i]) {
      return false;
    }
  }
  return true;
}
