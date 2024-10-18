function updateTime() {
    // Declare values
    const clockElement = document.getElementById("real-time");
    const dateElement = document.getElementById("date");
    const now = new Date();

    // Take the present time
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;

    // Take the present date
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const dateString = `${day}/${month}/${year}`;

    // Display time and date
    clockElement.textContent = timeString;
    dateElement.textContent = dateString;
}

// Update date and time per second
setInterval(updateTime, 1000);

// call Function
updateTime();