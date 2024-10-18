// Khởi tạo các phần tử
let btn1 = document.querySelector("#btn1"); // Nút On
let btn2 = document.querySelector("#btn2"); // Nút Off
let img = document.querySelector("img"); // Ảnh hiển thị
let nhietDo = document.getElementById("nhietdo"); // Phần tử nhiệt độ
let doAm = document.getElementById("doam"); // Phần tử độ ẩm

// Ẩn thông tin khi trang tải
nhietDo.style.display = "none"; // Ẩn nhiệt độ
doAm.style.display = "none"; // Ẩn nhiệt độ

// Chức năng của nút On
btn1.addEventListener("click", () => {
    img.src = "img/fan_running.png";
    nhietDo.style.display = "block"; // Hiển thị nhiệt độ
    doAm.style.display = "block"; // Hiển thị độ ẩm
});

// Chức năng của nút Off
btn2.addEventListener("click", () => {
    img.src = "img/fan_off.png";
    nhietDo.style.display = "none"; // Ẩn nhiệt độ
    doAm.style.display = "none"; // Ẩn độ ẩm
});
