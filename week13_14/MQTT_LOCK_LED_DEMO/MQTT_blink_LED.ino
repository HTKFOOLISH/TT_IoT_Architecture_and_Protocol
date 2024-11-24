#include <AdafruitIO.h> // tiến hành thêm thư viện AdafruitIO.h vào

#define IO_USERNAME  "KhaiFoolish" // Lấy mã Key từ server Adafruit.io
#define IO_KEY       "aio_AvYO87av9qVUkA7h515HOeburxdy"

#define WIFI_SSID "Galaxy_Tab_A_with_S_PenC9E8" // Tên wifi để ESP 32 kết nối vào và truy cập đến server.
#define WIFI_PASS "12345678"  // Pass wifi

#include <AdafruitIO_WiFi.h>  // Khai báo thư viện AdafruitIO_WiFi.h để kết nối đến server.
AdafruitIO_WiFi io(IO_USERNAME, IO_KEY, WIFI_SSID, WIFI_PASS);  // Gọi hàm kết nối đến server.

#define LIGHT 2 // LED on Board là GPIO 2.
#define LOCK 4  // LOCK là GPIO 4.
#define BUZZER 5 // BUZZER là GPIO 5.

// set up the 'digital' feed 
AdafruitIO_Feed *light = io.feed("lightbtn"); // khai báo con trỏ digital để chứ dữ liệu lấy từ feed của server.
AdafruitIO_Feed *lock = io.feed("lockdevice");

bool doorOpen = false; // Trạng thái cửa
unsigned long startTime = 0;
bool waitingForClose = false; // Đợi đóng cửa

void setup() {
 
  // set led pin as a digital output
  pinMode(LIGHT, OUTPUT); // Khai báo output.
  pinMode(LOCK, OUTPUT);
  pinMode(BUZZER, OUTPUT); // Cấu hình buzzer (không bắt buộc, nhưng tốt cho khởi tạo)
  noTone(BUZZER); // Tắt buzzer ban đầu
 
  // start the serial connection
  Serial.begin(115200); 
 
  // wait for serial monitor to open
  while(! Serial);
 
  // connect to io.adafruit.com
  Serial.print("Connecting to Adafruit IO"); // tiến hành kết nối đến server.
  io.connect(); // Gọi hàm kết nối
 
 
  // wait for a connection
  while(io.status() < AIO_CONNECTED) {
    Serial.print("."); // Nếu chưa kết nối được đến server sẽ tiến hành xuất ra màn hình đấu "."
    delay(500);
  }
 
  // we are connected
  Serial.println();
  Serial.println(io.statusText()); // Nếu đã kết nối thành công tiến hành xuất ra màn hình trạng thái.
  // set up a message handler for the 'digital' feed.
  // the handleMessage function (defined below)
  // will be called whenever a message is
  // received from adafruit io.

  light->onMessage(handleMessage); // Gọi hàm đọc dữ liệu và tiến hành điều khiển led và xuất ra trạng thái trên màn hình.
  lock->onMessage(handleMessage);
}

void loop() {
  io.run(); // gọi hàm Run.
  if (waitingForClose && (millis() - startTime > 10000)) {
    if (doorOpen) {
      // Sau 10 giây cửa vẫn mở
      Serial.println("Door still open, sounding alternating tones.");
      while (doorOpen) { // Nếu cửa mở, kêu với tần số 1000Hz và 500Hz cách nhau 500ms
        tone(BUZZER, 1000);
        delay(500);
        tone(BUZZER, 500);
        delay(350);
        io.run(); // Tiếp tục xử lý các feed trong lúc loop
      }
    }
  }
}

// this function is called whenever an 'digital' feed message
// is received from Adafruit IO. it was attached to
// the 'digital' feed in the setup() function above.
void handleMessage(AdafruitIO_Data *data) { // hàm handleMessage để đọc dữ liệu.

  Serial.print("Received <- ");
  Serial.println(data->value()); // In ra giá trị nhận được từ feed

  // Kiểm tra giá trị nhận được từ feed và điều khiển tương ứng
  if (strcmp(data->feedName(), "lightbtn") == 0) { 
    // Điều khiển thiết bị 'lightbtn'
    digitalWrite(LIGHT, data->toPinLevel());
    Serial.print("Light is ");
    Serial.println(data->toPinLevel() == HIGH ? "ON" : "OFF");
  } 
  else if (strcmp(data->feedName(), "lockdevice") == 0) { 
    // Điều khiển khóa
    digitalWrite(LOCK, data->toPinLevel());
    Serial.print("Lock is ");
    Serial.println(data->toPinLevel() == HIGH ? "UNLOCKED" : "LOCKED");

    doorOpen = (data->toPinLevel() == HIGH); // TRUE nếu cửa mở    
    if (doorOpen) { // Cửa mở
      Serial.println("Buzzer ON (HIGH Frequency) - Door is OPEN");

      // Buzzer phát âm tần số cao (1000 Hz)
      for (int i = 0; i < 2; i++){
        tone(BUZZER, 1000);
        delay(50);
        noTone(BUZZER);
        delay(50);
      }
      startTime = millis(); // Bắt đầu đếm 10 giây
      waitingForClose = true;
    } else { // Cửa đóng
      waitingForClose = false;
      Serial.println("Buzzer ON (LOW Frequency) - Door is CLOSED");

      // Buzzer phát âm tần số thấp (750 Hz)
      for (int i = 0; i < 2; i++){
        tone(BUZZER, 750);
        delay(50);
        noTone(BUZZER);
        delay(50);
      }
    }
  } 
  else {
    Serial.println("Unknown device command.");
  }
}