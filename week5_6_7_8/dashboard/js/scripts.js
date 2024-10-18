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

function status(card) {
    const statusElement = card.querySelector(".status"); // Lấy thẻ h1 bên trong thẻ div.device-card

    // Chuyển đổi trạng thái
    if (!islocked) {
        statusElement.textContent = "ON";
        islocked = true;
    } else {
        statusElement.textContent = "OFF";
        islocked = false;
    }
}

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

var options = {
    // Dữ liệu cho biểu đồ (series chứa các tập dữ liệu)
    series: [
    {
      name: "High - 2013", // Lượng điện năng cao trong năm 2013
      data: [28, 29, 33, 36, 32, 32, 33] // Giá trị nhiệt độ cao theo từng tháng
    },
    {
      name: "Low - 2013", // Nhiệt độ thấp trong năm 2013
      data: [12, 11, 14, 18, 17, 13, 13] // Giá trị nhiệt độ thấp theo từng tháng
    }
  ],
  
  // Cấu hình chung cho biểu đồ
  chart: {
    height: 350, // Chiều cao biểu đồ là 350px
    type: 'line', // Loại biểu đồ là đường (line chart)

    // Hiệu ứng bóng đổ cho các đường biểu đồ
    dropShadow: {
      enabled: true, // Kích hoạt bóng đổ
      color: '#000', // Màu bóng là đen
      top: 18, // Vị trí từ trên xuống (18px)
      left: 7, // Vị trí từ trái sang (7px)
      blur: 10, // Độ mờ của bóng
      opacity: 0.2 // Độ trong suốt của bóng (20%)
    },
    zoom: {
      enabled: false // Tắt chức năng zoom của biểu đồ
    },
    toolbar: {
      show: false // Ẩn toolbar của biểu đồ
    }
  },

  // Màu cho các đường dữ liệu
  colors: ['#77B6EA', '#545454'], // Màu xanh nhạt cho nhiệt độ cao và màu xám cho nhiệt độ thấp

  // Hiển thị nhãn giá trị trên các điểm dữ liệu
  dataLabels: {
    enabled: true, // Kích hoạt nhãn dữ liệu
  },

  // Kiểu đường biểu đồ là cong mềm
  stroke: {
    curve: 'smooth' // Đường cong mượt
  },

  // Tiêu đề của biểu đồ
  title: {
    text: 'Average high and low power consumption', // Tiêu đề biểu đồ
    align: 'left' // Căn lề trái cho tiêu đề
  },

  // Cấu hình lưới của biểu đồ
  grid: {
    borderColor: '#e7e7e7', // Màu đường biên của lưới
    row: {
      colors: ['#f3f3f3', 'transparent'], // Màu xen kẽ cho các hàng trong lưới
      opacity: 0.5 // Độ trong suốt của lưới
    },
  },

  // Kích thước các điểm trên biểu đồ
  markers: {
    size: 1 // Kích thước điểm đánh dấu là 1px
  },

  // Cấu hình trục X
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], // Các tháng trên trục X
    title: {
      text: 'Month' // Tiêu đề của trục X là "Month"
    }
  },

  // Cấu hình trục Y
  yaxis: {
    title: {
      text: 'Power Consumption' // Tiêu đề của trục Y là "power consumption"
    },
    min: 5, // Giá trị nhỏ nhất trên trục Y là 5
    max: 40 // Giá trị lớn nhất trên trục Y là 40
  },

  // Cấu hình chú giải (legend)
  legend: {
    position: 'top', // Vị trí của chú giải ở trên cùng
    horizontalAlign: 'right', // Căn phải chú giải
    floating: true, // Chú giải có thể trôi nổi
    offsetY: -25, // Điều chỉnh khoảng cách chú giải so với trục Y (-25px)
    offsetX: -5 // Điều chỉnh khoảng cách chú giải so với trục X (-5px)
  }
};

// Khởi tạo biểu đồ với các tùy chọn đã định nghĩa
var chart = new ApexCharts(document.querySelector("#chart1"), options);

// Render (vẽ) biểu đồ lên phần tử HTML có id là "chart"
chart.render();


  var options2 = {
    series: [
    {
      name: "High - 2013",
      data: [28, 29, 33, 36, 32, 32, 33]
    },
    {
      name: "Low - 2013",
      data: [12, 11, 14, 18, 17, 13, 13]
    }
  ],
    chart: {
    height: 350,
    type: 'line',
    dropShadow: {
      enabled: true,
      color: '#000',
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.2
    },
    zoom: {
      enabled: false
    },
    toolbar: {
      show: false
    }
  },
  colors: ['#77B6EA', '#545454'],
  dataLabels: {
    enabled: true,
  },
  stroke: {
    curve: 'smooth'
  },
  title: {
    text: 'Average High & Low power consumption',
    align: 'left'
  },
  grid: {
    borderColor: '#e7e7e7',
    row: {
      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.5
    },
  },
  markers: {
    size: 1
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    title: {
      text: 'Month'
    }
  },
  yaxis: {
    title: {
      text: 'Power Consumption'
    },
    min: 5,
    max: 40
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    floating: true,
    offsetY: -25,
    offsetX: -5
  }
  };

  var chart2 = new ApexCharts(document.querySelector("#chart2"), options2);
  chart2.render();