#include <Adafruit_Fingerprint.h>
#include <SPI.h>
#include <MFRC522.h>

// Pin definitions for relay, lights, buzzer, and motion sensor
#define RELAY_PIN 4
#define LIGHT_PIN 25
#define BUZZER_PIN 26
#define PIR_PIN 15       // Chân OUT của SR501 (motion sensor)
#define MOTION_LED_PIN 2 // LED bật khi phát hiện chuyển động

// RFID Pin definitions
#define RST_PIN 22
#define SDA_PIN 21

// RFID valid UID
byte validUID[4] = {0x13, 0xE5, 0x38, 0x2D}; // UID hợp lệ

// Setup fingerprint sensor
#define MODEM_RX 16
#define MODEM_TX 17
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&Serial2);

// Setup RFID reader
MFRC522 rfid(SDA_PIN, RST_PIN);

void setup() {
  // Start serial communication
  Serial.begin(9600);
  while (!Serial);  // Ensure serial is ready
  delay(100);
  
  // Initialize fingerprint sensor
  Serial.println("Adafruit Fingerprint sensor enrollment");
  Serial2.begin(57600, SERIAL_8N1, MODEM_RX, MODEM_TX);
  
  if (finger.verifyPassword()) {
    Serial.println("Found fingerprint sensor!");
  } else {
    Serial.println("Did not find fingerprint sensor :(");
    while (1) { delay(1); }
  }

  // Initialize RFID reader
  SPI.begin();
  rfid.PCD_Init();

  // Setup pins
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(LIGHT_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(PIR_PIN, INPUT);
  pinMode(MOTION_LED_PIN, OUTPUT);
  
  digitalWrite(RELAY_PIN, LOW);
  digitalWrite(LIGHT_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);
  
  Serial.println("System Ready");
}

void loop() {
  // Handle motion detection (SR501)
  int motionState = digitalRead(PIR_PIN);
  if (motionState == HIGH) {
    digitalWrite(MOTION_LED_PIN, HIGH); // Turn on LED if motion detected
    Serial.println("Motion Detected!");
  } else {
    digitalWrite(MOTION_LED_PIN, LOW);  // Turn off LED if no motion
    Serial.println("No Motion.");
  }

  // Check fingerprint for authentication
  int id = getFingerprintID();
  if (id != -1) {
    Serial.print("Fingerprint verified with ID: ");
    Serial.println(id);
    
    // Activate relay and light for 5 seconds
    digitalWrite(RELAY_PIN, HIGH);
    digitalWrite(LIGHT_PIN, HIGH);
    delay(5000);
    
    digitalWrite(RELAY_PIN, LOW);
    digitalWrite(LIGHT_PIN, LOW);
    Serial.println("Relay and light deactivated!");
  } else {
    Serial.println("Fingerprint not recognized or error!");
  }

  // Check RFID for access control
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    Serial.println("New card detected.");
    
    // Check if the card is valid
    if (isValidCard()) {
      Serial.println("Access Granted");
      digitalWrite(LIGHT_PIN, HIGH);  // Turn on LED for valid card
      digitalWrite(RELAY_PIN, HIGH);  // Activate relay to unlock

      delay(5000);  // Keep the relay active for 5 seconds
      digitalWrite(LIGHT_PIN, LOW);  // Turn off LED
      digitalWrite(RELAY_PIN, LOW);  // Deactivate relay
    } else {
      Serial.println("Access Denied");
      digitalWrite(BUZZER_PIN, HIGH);  // Turn on buzzer for invalid card
      delay(1000); // Keep buzzer on for 1 second
      digitalWrite(BUZZER_PIN, LOW);   // Turn off buzzer
    }

    // Stop processing card
    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
  }

  delay(500);  // Short delay before the next loop iteration
}

// Fingerprint authentication function
int getFingerprintID() {
  int p = finger.getImage();
  if (p != FINGERPRINT_OK) {
    if (p == FINGERPRINT_NOFINGER) {
      return -1;  // No finger detected
    }
    Serial.print("Error taking image: ");
    Serial.println(p);
    return -1;
  }

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK) {
    Serial.print("Error converting image: ");
    Serial.println(p);
    return -1;
  }

  p = finger.fingerFastSearch();
  if (p != FINGERPRINT_OK) {
    Serial.print("Fingerprint not found: ");
    Serial.println(p);
    return -1;  // Fingerprint not found in the database
  }

  return finger.fingerID;  // Return the ID of the recognized fingerprint
}

// Function to check if the RFID card is valid
bool isValidCard() {
  for (byte i = 0; i < 4; i++) {
    if (rfid.uid.uidByte[i] != validUID[i]) {
      return false;
    }
  }
  return true;
}
