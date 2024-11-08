// SIDEBAR TOGGLE

let sidebarOpen = false; /* khởi tạo biến báo trạng thái mở/đóng sidebar */

let sidebar = document.getElementById("sidebar");

function openSidebar() {
    if (!sidebarOpen) {
        sidebar.classList.add("sidebar-responsive");
        sidebarOpen = true;
    }
}

function closeSidebar() {
    if (sidebarOpen) {
        sidebar.classList.remove("sidebar-responsive");
        sidebarOpen = false;
    }
}

// Display Device Status
let islocked = false;

// Display devices
function displayDevice() {
    // Get container of devices-card
    const deviceContainer = document.querySelector('.devices-container');

    // Make sure that the container is display or hidden
    const displayStyle = window.getComputedStyle(deviceContainer).display;

    if (displayStyle === "none") {
        deviceContainer.style.display = "grid"; // Display container
    } else {
        deviceContainer.style.display = "none"; // Hidden container
    }
}

// Display sensors
function displaySensors() {
    // Get container of devices-card
    const sensorContainer = document.querySelector('.sensors-container');

    // Make sure that the container is display or hidden
    const displayStyle = window.getComputedStyle(sensorContainer).display;

    if (displayStyle === "none") {
        sensorContainer.style.display = "grid"; // Display container
    } else {
        sensorContainer.style.display = "none"; // Hidden container
    }
}


// Display Members
function displayMembers() {
    const memberContainer = document.querySelector('.members-container');

    const displayStyle = window.getComputedStyle(memberContainer).display;

    if (displayStyle == "none") {
        memberContainer.style.display = "grid";
    } else {
        memberContainer.style.display = "none";
    }
}


/* ------------------- CHART ------------------- */

// Khởi tạo trạng thái và dữ liệu cho khóa
let lockStatus = 0; // 0: Unlocked, 1: Locked
let lockDataArray = JSON.parse(localStorage.getItem('lockData')) || []; // Lấy dữ liệu từ localStorage hoặc khởi tạo mảng rỗng
let timeLabels = JSON.parse(localStorage.getItem('timeLabels')) || []; // Lấy nhãn thời gian từ localStorage

var options = {
    series: [{
        name: "lock status",
        data: lockDataArray.map((status, index) => [timeLabels[index], status]) // Sử dụng dữ liệu đã khôi phục
    }],
    chart: {
        height: 350,
        type: 'line',
        zoom: {
            enabled: true, // Kích hoạt tính năng thu phóng
            type: 'x', // Chỉ thu phóng theo trục X (thời gian)
            autoScaleYaxis: true // Tự động điều chỉnh trục Y khi thu phóng
        },
        toolbar: {
            autoSelected: 'zoom', // Tự động chọn công cụ thu phóng
            tools: {
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true, // Cho phép kéo để di chuyển biểu đồ
                reset: true // Thêm nút để đặt lại thu phóng
            }
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'stepline'
    },
    title: {
        text: 'Lock Opening/Closing Time',
        align: 'left'
    },
    grid: {
        row: {
            colors: ['#f3f3f3', 'transparent'], // Takes an array which will be repeated on columns
            opacity: 0.5
        },
    },
    xaxis: {
        type: 'datetime',
        labels: {
            formatter: function(value) {
                return new Date(value).toLocaleString([], { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
            }
        }
    }
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

// Hàm xử lý sự kiện nhấp chuột
function status(element, deviceType) {
    const statusElement = element.querySelector('.status');

    if (deviceType === 'lock') {
        // Đảo ngược trạng thái
        lockStatus = lockStatus === 0 ? 1 : 0;
        statusElement.textContent = lockStatus === 1 ? 'ON' : 'OFF'; // Cập nhật văn bản hiển thị

        // Thêm trạng thái mới vào mảng dữ liệu
        lockDataArray.push(lockStatus);

        // Thêm nhãn thời gian
        const currentTime = new Date();
        timeLabels.push(currentTime.getTime());

        // Cập nhật dữ liệu cho biểu đồ
        chart.updateSeries([{
            name: "lock status",
            data: lockDataArray.map((status, index) => [timeLabels[index], status])
        }]);

        // Lưu trữ dữ liệu vào localStorage
        localStorage.setItem('lockData', JSON.stringify(lockDataArray));
        localStorage.setItem('timeLabels', JSON.stringify(timeLabels));
    }
}

// ------------------- FIREBASE -------------------

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDtbyt7uGp5k-62BKZ_efJ5zhYMoCweZSY",
    authDomain: "smart-lock-project-9b50b.firebaseapp.com",
    databaseURL: "https://smart-lock-project-9b50b-default-rtdb.firebaseio.com",
    projectId: "smart-lock-project-9b50b",
    storageBucket: "smart-lock-project-9b50b.appspot.com",
    messagingSenderId: "830294056108",
    appId: "1:830294056108:web:edf2cb0dd7931488b9d309",
    measurementId: "G-V89KMGWYG5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Write data to Firebase
const lock = document.getElementById('lock');
const light = document.getElementById('light');
const alert = document.getElementById('alert');

let lockVal = lock.innerText;
lock.onclick = function() {
    lockVal = lockVal === 'OFF' ? 'ON' : 'OFF';
    lock.innerHTML = lockVal;

    database.ref("/devices").update({
        "lock" : lockVal === 'OFF' ? 0 : 1
    })
}

let lightVal = light.innerText;
light.onclick = function() {
    lightVal = lightVal === 'OFF' ? 'ON' : 'OFF';
    light.innerHTML = lightVal;

    database.ref("/devices").update({
        "light" : lightVal === 'OFF' ? 0 : 1
    })
}

let alertVal = alert.innerText;
alert.onclick = function() {
    alertVal = alertVal === 'OFF' ? 'ON' : 'OFF';
    alert.innerText = alertVal;

    database.ref("/devices").update({
        "alert" : alertVal === 'OFF' ? 0 : 1
    })
}

const sensor1 = document.getElementById('sensor1');
const sensor2 = document.getElementById('sensor2');
const sensor3 = document.getElementById('sensor3');

let sensor1Val = sensor1.innerText;
sensor1.onclick = function() {
    sensor1Val = sensor1Val === 'OFF' ? 'ON' : 'OFF';
    sensor1.innerText = sensor1Val;

    database.ref("/sensors").update({
        "fingerprint" : sensor1Val === 'OFF' ? 0 : 1
    })
}

let sensor2Val = sensor2.innerText;
sensor2.onclick = function() {
    sensor2Val = sensor2Val === 'OFF' ? 'ON' : 'OFF';
    sensor2.innerText = sensor2Val;

    database.ref("/sensors").update({
        "magnetic card" : sensor2Val === 'OFF' ? 0 : 1
    })
}

let sensor3Val = sensor3.innerText;
sensor3.onclick = function() {
    sensor3Val = sensor3Val === 'OFF' ? 'ON' : 'OFF';
    sensor3.innerText = sensor3Val;

    database.ref("/sensors").update({
        "movement" : sensor3Val === 'OFF' ? 0 : 1
    })
}

// Read data from Firebase
// Đọc dữ liệu từ Firebase Realtime Database cho các thiết bị
database.ref("/devices").on("value", function(snapshot) {
    let devices = snapshot.val(); // Lấy giá trị hiện tại của các thiết bị từ Firebase
    
    // Cập nhật trạng thái của từng thiết bị dựa trên dữ liệu từ Firebase
    devices["lock"] === 1 ? lock.innerText = 'ON' : lock.innerText = 'OFF'; // Kiểm tra và gán trạng thái của khóa
    devices["light"] === 1 ? light.innerText = 'ON' : light.innerText = 'OFF'; // Kiểm tra và gán trạng thái của đèn
    devices["alert"] === 1 ? alert.innerText = 'ON' : alert.innerText = 'OFF'; // Kiểm tra và gán trạng thái của cảnh báo
})

// Đọc dữ liệu từ Firebase Realtime Database cho các sensors
database.ref("/sensors").on("value", function(snapshot) {
    let sensors = snapshot.val(); // Lấy giá trị hiện tại của các sensors từ Firebase

    sensors["fingerprint"] === 1 ? sensor1.innerText = 'ON' : sensor1.innerText = 'OFF';
    sensors["magnetic card"] === 1 ? sensor2.innerText = 'ON' : sensor2.innerText = 'OFF';
    sensors["movement"] === 1 ? sensor3.innerText = 'ON' : sensor3.innerText = 'OFF';
})