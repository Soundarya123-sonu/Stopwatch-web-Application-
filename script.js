let startTime;
let elapsedTime = 0;
let timerInterval;
let running = false;
let laps = [];

const timeDisplay = document.getElementById("time");
const lapsList = document.getElementById("laps");
const lapChartCanvas = document.getElementById("lapChart");
let lapChart;

function timeToString(time) {
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);

    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);

    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);

    let diffInMs = (diffInSec - ss) * 1000;
    let ms = Math.floor(diffInMs);

    let formattedHH = hh.toString().padStart(2, "0");
    let formattedMM = mm.toString().padStart(2, "0");
    let formattedSS = ss.toString().padStart(2, "0");
    let formattedMS = ms.toString().padStart(3, "0");

    return `${formattedHH}:${formattedMM}:${formattedSS}:${formattedMS}`;
}

function start() {
    if (!running) {
        document.body.classList.add("running");
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            timeDisplay.textContent = timeToString(elapsedTime);
        }, 10);
        running = true;
    }
}

function pause() {
    if (running) {
        clearInterval(timerInterval);
        running = false;
        document.body.classList.remove("running");
    }
}

function reset() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    running = false;
    laps = [];
    timeDisplay.textContent = "00:00:00:000";
    updateLapDisplay();
    updateChart();
    document.body.classList.remove("running");
}

function lap() {
    if (running) {
        laps.push(elapsedTime);
        updateLapDisplay();
        updateChart();
    }
}

function updateLapDisplay() {
    lapsList.innerHTML = "";
    if (laps.length === 0) {
        const noLapMsg = document.createElement("li");
        noLapMsg.textContent = "No laps recorded yet.";
        noLapMsg.style.fontStyle = "italic";
        lapsList.appendChild(noLapMsg);
    } else {
        laps.forEach((lapTime, index) => {
            const li = document.createElement("li");
            li.textContent = `Lap ${index + 1}: ${timeToString(lapTime)}`;
            lapsList.appendChild(li);
        });
    }
}

function updateChart() {
    if (lapChart) lapChart.destroy();

    if (laps.length === 0) {
        // Hide the canvas if no laps
        lapChartCanvas.style.display = "none";
        return;
    } else {
        lapChartCanvas.style.display = "block";
    }

    const labels = laps.map((_, i) => `Lap ${i + 1}`);
    const data = laps.map(t => t / 1000);

    lapChart = new Chart(lapChartCanvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Lap Time (s)',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function downloadCSV() {
    if (laps.length === 0) return alert("No laps to download!");

    let csv = "Lap,Time\n";
    laps.forEach((t, i) => {
        csv += `${i + 1},${timeToString(t)}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "laps.csv";
    a.click();
    URL.revokeObjectURL(url);
}

const toggleThemeBtn = document.getElementById("toggleTheme");
toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    toggleThemeBtn.textContent = document.body.classList.contains("dark") ? "Light Mode" : "Dark Mode";
});

// Event listeners
document.getElementById("start").addEventListener("click", start);
document.getElementById("pause").addEventListener("click", pause);
document.getElementById("reset").addEventListener("click", reset);
document.getElementById("lap").addEventListener("click", lap);
document.getElementById("download").addEventListener("click", downloadCSV);

// Initialize display on page load
updateLapDisplay();
updateChart();
