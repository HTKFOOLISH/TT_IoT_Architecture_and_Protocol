// SIDEBAR TOGGLE

let sidebarOpen = false; /* Khởi tạo biến báo trạng thái mở/đóng sidebar; mặc định là đóng */

let sidebar = document.getElementById("sidebar"); /* Lấy phần tử sidebar từ DOM bằng ID "sidebar" */

function openSidebar() {
    if (!sidebarOpen) { /* Kiểm tra nếu sidebar hiện đang đóng */
        sidebar.classList.add("sidebar-responsive"); /* Thêm lớp "sidebar-responsive" để mở sidebar */
        sidebarOpen = true; /* Cập nhật trạng thái sidebar là mở */
    }
}

function closeSidebar() {
    if (sidebarOpen) { /* Kiểm tra nếu sidebar hiện đang mở */
        sidebar.classList.remove("sidebar-responsive"); /* Xóa lớp "sidebar-responsive" để đóng sidebar */
        sidebarOpen = false; /* Cập nhật trạng thái sidebar là đóng */
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
    else {
        // Đảo ngược trạng thái
        lockStatus = lockStatus === 0 ? 1 : 0;
        statusElement.textContent = lockStatus === 1 ? 'ON' : 'OFF'; // Cập nhật văn bản hiển thị
    }
}