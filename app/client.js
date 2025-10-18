//Handle Logout Button Start
const role = sessionStorage.getItem("userRole");
const path = window.location.pathname;

// Protect index.html for admin only
if (path.endsWith("/app/index.html") && role !== "admin") {
  window.location.href = "../registration.html";
}

// Protect client.html for rakesh only
if (path.endsWith("/app/client.html") && role !== "rakesh") {
  window.location.href = "../registration.html";
}


const logoutBtn = document.getElementById("log-out");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    sessionStorage.removeItem("userRole");
    window.location.href = "../registration.html";
  });
}

//Handle Logout Button End

//Declare psu array and variable
let ipdu1_arr = [0, 0, 0, 0, 0, 0, 0, 0];
let ipdu2_arr = [0, 0, 0, 0, 0, 0, 0, 0];
let ipdu3_arr = [0, 0, 0, 0, 0, 0, 0, 0];
let ipduSum_arr = [0, 0, 0];
let alarm_arr = [0, 0, 0, 0, 0];

// Chart array and variable Declare
let temp = [0, 0, 0, 0, 0, 0, 0, 0];
let hum = [0, 0, 0, 0, 0, 0, 0, 0];
const tim = [
  "11:00",
  "11:05",
  "11:10",
  "11:15",
  "11:20",
  "11:25",
  "11:30",
  "11:35",
];
let barChart;
let lineChart;

// Default Data Show Start
updateAllData(0, 0, 0, 0, 0, 0);
updateLineChart(0, 0);
updateBarChart();
psuDataShow();
alarmData(alarm_arr, 0);
// Default Data Show end

//.........websocket_client code Start..............
var socket = new WebSocket("ws://27.147.170.162:81");
socket.onmessage = function (event) {
  const data = event.data.split(":");
  const data_catagory = data[0] || "";
  const msg = data[1] || "";

  // checking data is coming or not start
  if (data_catagory == "Hams_HO") {
    // dataReceived = true;
    // clearTimeout(timeout);
  } else {
    return;
  }
  // checking data is coming or not end

  // if (data_catagory !== "Hams_HO") {
  //   return;
  // }

  // Clear all data function
  clearAllData();

  console.log(data[1]);
  console.log(data[2]);
  console.log(data[3]);
  console.log(data[4]);

  var splited_data = data[4].split(",");

  // Main Gauge
  updateAllData(
    splited_data[1],
    splited_data[2],
    splited_data[3],
    splited_data[4],
    splited_data[5],
    splited_data[6]
  );

  // Line chart Data
  updateLineChart(splited_data[5], splited_data[6]);

  // Device Inforfation
  //   deviceInformation(
  //     splited_data[12],
  //     splited_data[13],
  //     splited_data[14],
  //     splited_data[15],
  //     splited_data[16],
  //     splited_data[17],
  //     splited_data[18]
  //   );

  // power supply unit
  psuDataInsert(data[1], data[2], data[3]);

  // Others Alarm Unit
  for (i = 7, j = 0; i <= 11; i++, j++) {
    alarm_arr[j] = parseInt(splited_data[i]);
  }
  alarmData(alarm_arr, splited_data[1]);
};
//.........websocket_client code end..............

// Psu data start
function psuDataInsert(x, y, z) {
  // ipdu 1 Data Insert
  if (x != "") {
    var ipdu1_data = x.split(",");
    for (i = 2, k = 0; i <= 9; i++, k++) {
      ipdu1_arr[k] = parseInt(ipdu1_data[i]);
    }
  }
  // ipdu 2 Data Insert
  if (y != "") {
    var ipdu2_data = y.split(",");
    for (i = 2, k = 0; i <= 9; i++, k++) {
      ipdu2_arr[k] = parseInt(ipdu2_data[i]);
    }
  }
  // ipdu 3 Data Insert
  if (z != "") {
    var ipdu3_data = z.split(",");
    for (i = 2, k = 0; i <= 9; i++, k++) {
      ipdu3_arr[k] = parseInt(ipdu3_data[i]);
    }
  }

  psuDataShow();

  // Sum of Ipdu
  ipduSum_arr[0] = ipdu1_arr.reduce((x, y) => x + y, 0);
  ipduSum_arr[1] = ipdu2_arr.reduce((x, y) => x + y, 0);
  ipduSum_arr[2] = ipdu3_arr.reduce((x, y) => x + y, 0);
  updateBarChart();
}
function psuDataShow() {
  const psuId = [
    "bgp-psu1",
    "bgp-psu2",
    "fortinet-psu1",
    "fortinet-psu2",
    "check-point-psu1",
    "check-point-psu2",
    "cisco-psu",
    "lan-psu",
    "cisco-distribution-psu",
    "ho-dr-psu1",
    "ho-dr-psu2",
    "ho-service-psu1",
    "ho-service-psu2",
    "nvr-psu",
    "r730-1-psu1",
    "r730-1-psu2",
    "r730-2-psu1",
    "r730-2-psu2",
    "san-sw1-psu1",
    "san-sw1-psu2",
    "san-sw-psu1",
    "san-sw-psu2",
    "san-sorage-psu1",
    "san-sorage-psu2",
  ];

  const psuDisplayId = [
    "bgp-d-psu1",
    "bgp-d-psu2",
    "fortinet-d-psu1",
    "fortinet-d-psu2",
    "check-point-d-psu1",
    "check-point-d-psu2",
    "cisco-d-psu",
    "lan-d-psu",
    "cisco-distribution-d-psu",
    "ho-dr-d-psu1",
    "ho-dr-d-psu2",
    "ho-service-d-psu1",
    "ho-service-d-psu2",
    "nvr-d-psu",
    "r730-1-d-psu1",
    "r730-1-d-psu2",
    "r730-2-d-psu1",
    "r730-2-d-psu2",
    "san-sw1-d-psu1",
    "san-sw1-d-psu2",
    "san-sw-d-psu1",
    "san-sw-d-psu2",
    "san-sorage-d-psu1",
    "san-sorage-d-psu2",
  ];
  const psuCardData = [
    "BGP PSU1",
    "BGP PSU2",
    "Fortinet PSU1",
    "Fortinet PSU2",
    "Check P. PSU1",
    "Check P. PSU2",
    "Core Router PSU",
    "LAN Router",
    "CISCO Dist PSU",
    "HO DR PSU1",
    "HO DR PSU2",
    "HO S PSU1",
    "HO S PSU2",
    "NVR PSU",
    "R 730 1 PSU1",
    "R 730 1 PSU2",
    "R 730 2 PSU1",
    "R 730 2 PSU2",
    "SAN SW 1 PSU1",
    "SAN SW 1 PSU2",
    "SAN SW PSU1",
    "SAN SW PSU2",
    "SAN SORAGE PSU1",
    "SAN SORAGE PSU2",
  ];
  // ipdu 1 Data show
  for (i = 0, j = 0; i <= 7; i++, j++) {
    if (ipdu1_arr[i] >= 1) {
      psuOnShowData(psuId[j], psuDisplayId[j], ipdu1_arr[i]);
    } else {
      psuOffShowData(psuId[j], psuCardData[j]);
    }
  }

  // ipdu 2 Data show
  for (i = 0, j = 8; i <= 7; i++, j++) {
    if (ipdu2_arr[i] >= 1) {
      psuOnShowData(psuId[j], psuDisplayId[j], ipdu2_arr[i]);
    } else {
      psuOffShowData(psuId[j], psuCardData[j]);
    }
  }

  // ipdu 3 Data show
  for (i = 0, j = 16; i <= 7; i++, j++) {
    if (ipdu3_arr[i] >= 1) {
      psuOnShowData(psuId[j], psuDisplayId[j], ipdu3_arr[i]);
    } else {
      psuOffShowData(psuId[j], psuCardData[j]);
    }
  }
}

//Psu On Show Data Funtion
function psuOnShowData(psu_Id, psu_d_id, psu_value) {
  document.getElementById(psu_Id).innerText = "ON";
  document.getElementById(psu_Id).classList.add("on-btn");
  document.getElementById(psu_d_id).innerText = `${psu_value} VA`;
  document.getElementById(psu_d_id).classList.add("show-btn");
}
//Psu Off Show Data Funtion
function psuOffShowData(psu_Id, psuCardData) {
  document.getElementById(psu_Id).innerText = "OFF";
  document.getElementById(psu_Id).classList.add("off-btn");
  let ul = document.getElementById("alert-list");
  let li = document.createElement("li");
  li.classList.add("alert-list-card");
  li.textContent = `${psuCardData} Failed.`;
  ul.appendChild(li);
}
// Psu data end

//Alarm data start
function alarmData(x, input_voltage) {
  const alarmId = [
    "water-leakage",
    "fire-Alarm",
    "generator-status",
    "ups1-cb-status",
    "ups2-cb-status",
  ];
  const alarmCardId = [
    "Water Leakage",
    "Fire-Alarm",
    "Generator Status",
    "Ups1 cb Status",
    "Ups2 cb Status",
  ];
  const alarmData = [
    ["Detected", "No Alarm"],
    ["Detected", "No Alarm"],
    ["Off", "On"],
    ["Tripped", "ok"],
    ["Tripped", "ok"],
  ];

  for (i = 0; i <= 4; i++) {
    //Another check for generator
    if (i == 2 && input_voltage > 50) {
      document.getElementById(alarmId[i]).innerText = "Stand by";
      document.getElementById(alarmId[i]).classList.add("stand-btn");
    } 
    else if(i==2){   // only for generator
      if (x[i] == 0) {
        document.getElementById(alarmId[i]).innerText = alarmData[i][1];
        document.getElementById(alarmId[i]).classList.add("on-btn"); //green
      } else {
        document.getElementById(alarmId[i]).innerText = alarmData[i][0];
        document.getElementById(alarmId[i]).classList.add("off-btn"); //red
        let ul = document.getElementById("alert-list");
        let li = document.createElement("li");
        li.classList.add("alert-list-card");
        li.textContent = `${alarmCardId[i]} is ${alarmData[i][0]}`;
        ul.appendChild(li);
      }
    }
    else {
      if (x[i] == 1) {
        document.getElementById(alarmId[i]).innerText = alarmData[i][1];
        document.getElementById(alarmId[i]).classList.add("on-btn"); //green
      } else {
        document.getElementById(alarmId[i]).innerText = alarmData[i][0];
        document.getElementById(alarmId[i]).classList.add("off-btn"); //red
        let ul = document.getElementById("alert-list");
        let li = document.createElement("li");
        li.classList.add("alert-list-card");
        li.textContent = `${alarmCardId[i]} is ${alarmData[i][0]}`;
        ul.appendChild(li);
      }
    }
  }
}
//Alarm data end

//Gauge alert start
function gaugeAlert(data, status) {
  let ul = document.getElementById("alert-list");
  let li = document.createElement("li");
  li.classList.add("alert-list-card");
  li.textContent = `${data} is ${status}.`;
  ul.appendChild(li);
}
//Gauge alert end

// clear all data function start
function clearAllData() {
  document.getElementById("alert-list").innerHTML = "";

  const psuId = [
    "bgp-psu1",
    "bgp-psu2",
    "fortinet-psu1",
    "fortinet-psu2",
    "check-point-psu1",
    "check-point-psu2",
    "cisco-psu",
    "lan-psu",
    "cisco-distribution-psu",
    "ho-dr-psu1",
    "ho-dr-psu2",
    "ho-service-psu1",
    "ho-service-psu2",
    "nvr-psu",
    "r730-1-psu1",
    "r730-1-psu2",
    "r730-2-psu1",
    "r730-2-psu2",
    "san-sw1-psu1",
    "san-sw1-psu2",
    "san-sw-psu1",
    "san-sw-psu2",
    "san-sorage-psu1",
    "san-sorage-psu2",
  ];

  const psuDisplayId = [
    "bgp-d-psu1",
    "bgp-d-psu2",
    "fortinet-d-psu1",
    "fortinet-d-psu2",
    "check-point-d-psu1",
    "check-point-d-psu2",
    "cisco-d-psu",
    "lan-d-psu",
    "cisco-distribution-d-psu",
    "ho-dr-d-psu1",
    "ho-dr-d-psu2",
    "ho-service-d-psu1",
    "ho-service-d-psu2",
    "nvr-d-psu",
    "r730-1-d-psu1",
    "r730-1-d-psu2",
    "r730-2-d-psu1",
    "r730-2-d-psu2",
    "san-sw1-d-psu1",
    "san-sw1-d-psu2",
    "san-sw-d-psu1",
    "san-sw-d-psu2",
    "san-sorage-d-psu1",
    "san-sorage-d-psu2",
  ];

  for (let j = 0; j < psuId.length; j++) {
    const psuElem = document.getElementById(psuId[j]);
    const psuDisplayElem = document.getElementById(psuDisplayId[j]);

    if (psuElem) {
      psuElem.innerText = "";
      psuElem.className = "";
    }
    if (psuDisplayElem) {
      psuDisplayElem.innerText = "";
      psuDisplayElem.className = "";
    }
  }

  // Clear alarm elements
  const alarmId = [
    "water-leakage",
    "fire-Alarm",
    "generator-status",
    "ups1-cb-status",
    "ups2-cb-status",
  ];
  for (let j = 0; j < alarmId.length; j++) {
    const alarmElem = document.getElementById(alarmId[j]);
    if (alarmElem) {
      alarmElem.innerText = "";
      alarmElem.className = "";
    }
  }
}
// clear all data function end

// gauge data start
//getting color
function getColor(value, ranges) {
  if (value >= ranges.green[0] && value <= ranges.green[1]) {
    return "#4ECDC4"; // Green
  } else if (value >= ranges.orange[0] && value <= ranges.orange[1]) {
    return "#FE9B13"; // Orange
  } else {
    return "#FC5C65"; // Red
  }
}

// get status
function getStatus(value, ranges) {
  if (value >= ranges.green[0] && value <= ranges.green[1]) {
    return { text: "Normal", class: "status-normal" };
  } else if (value >= ranges.orange[0] && value <= ranges.orange[1]) {
    return { text: "Warning", class: "status-warning" };
  } else {
    return { text: "Danger", class: "status-danger" };
  }
}

// update circular gauge
function updateGauge(elementId, value, ranges) {
  const fillElement = document.getElementById(`${elementId}-fill`);
  const valueElement = document.getElementById(`${elementId}-value`);
  const statusElement = document.getElementById(`${elementId}-status`);

  // Calculate rotation based on value (0 to 360 degrees for 0 to max value)
  const rotation = (value / ranges.max) * 360;

  // Get color and status
  const color = getColor(value, ranges);
  const status = getStatus(value, ranges);

  // Update gauge fill
  fillElement.style.background = `conic-gradient(${color} 0deg ${rotation}deg, transparent ${rotation}deg 360deg)`;
  fillElement.style.color = color;

  // Update value (keep the unit span)
  const unit = valueElement.querySelector(".gauge-unit")?.textContent || "";
  valueElement.innerHTML = `${value} <span class="gauge-unit">${unit}</span>`;

  // Update status
  statusElement.textContent = status.text;
  statusElement.className = `status ${status.class}`;

  // Add pulse animation for warning and danger statuses
  if (status.class !== "status-normal") {
    statusElement.classList.add("pulse");
  } else {
    statusElement.classList.remove("pulse");
  }
}

//update all gauge data
function updateAllData(a, b, c, d, e, f) {
  // Input Voltage (0-300V)
  const inputVoltage = a;
  updateGauge("input-voltage", inputVoltage, {
    green: [191, 245],
    orange: [0, 190],
    red: [246, 300],
    max: 300,
  });

  // Alert for inputVoltage
  if (inputVoltage >= 0 && inputVoltage <= 190) {
    gaugeAlert("Input Voltage", "low");
  } else if (inputVoltage >= 246 && inputVoltage <= 300) {
    gaugeAlert("Input Voltage", "high");
  }

  // UPS1 Output Voltage (0-300V)
  const ups1Voltage = b;
  updateGauge("ups1-voltage", ups1Voltage, {
    green: [211, 230],
    orange: [0, 210],
    red: [231, 300],
    max: 300,
  });

  // Alert for Ups1
  if (ups1Voltage >= 0 && ups1Voltage <= 210) {
    gaugeAlert("UPS1 Voltage", "low");
  } else if (ups1Voltage >= 231 && ups1Voltage <= 300) {
    gaugeAlert("UPS1 Voltage", "high");
  }

  // UPS2 Output Voltage (0-300V)
  const ups2Voltage = c;
  updateGauge("ups2-voltage", ups2Voltage, {
    green: [211, 230],
    orange: [0, 210],
    red: [231, 300],
    max: 300,
  });

  // Alert for Ups2
  if (ups2Voltage >= 0 && ups2Voltage <= 210) {
    gaugeAlert("UPS2 Voltage", "low");
  } else if (ups2Voltage >= 231 && ups2Voltage <= 300) {
    gaugeAlert("UPS2 Voltage", "high");
  }

  // Battery Voltage (0-60V)
  const batteryVoltage = d;
  updateGauge("battery-voltage", batteryVoltage, {
    green: [241, 280],
    orange: [221, 240],
    red: [0, 220],
    max: 280,
  });

  // Alert for Battery Voltage
  if (batteryVoltage >= 221 && batteryVoltage <= 240) {
    gaugeAlert("Battery Voltage", "low");
  } else if (batteryVoltage >= 0 && batteryVoltage <= 220) {
    gaugeAlert("Battery Voltage", "very Low");
  }

  // Temperature (0-55°C)
  const temperature = e;
  updateGauge("temperature", temperature, {
    green: [0, 25],
    orange: [26, 31],
    red: [32, 55],
    max: 55,
  });

  // Alert for Temperature
  if (temperature >= 26 && temperature <= 31) {
    gaugeAlert("Temperature", "high");
  } else if (temperature >= 32 && temperature <= 55) {
    gaugeAlert("Temperature", "very high");
  }

  // Humidity (0-100%)
  const humidity = f;
  updateGauge("humidity", humidity, {
    green: [41, 80],
    orange: [81, 100],
    red: [0, 40],
    max: 100,
  });

    // Alert for Humidity
  if (humidity >= 0 && humidity <= 40) {
    gaugeAlert("Humidity", "low");
  } else if (humidity >= 81 && humidity <= 100) {
    gaugeAlert("Humidity", "high");
  }
}
// updateAllData();
// gauge data end

// Chart data start
let color = "white";

// Initialize charts on page load
function initializeCharts() {
  // Environment Chart (Line Chart)
  const environmentCtx = document
    .getElementById("environment-chart")
    .getContext("2d");
  lineChart = new Chart(environmentCtx, {
    type: "line",
    data: {
      labels: tim,
      datasets: [
        {
          label: "Temperature (°C)",
          data: temp,
          borderColor: "#ff9f1a",
          backgroundColor: "rgba(255, 159, 26, 0.1)",
          borderWidth: 2,
          tension: 0.3,
          yAxisID: "y",
          fill: true,
        },
        {
          label: "Humidity (%)",
          data: hum,
          borderColor: "#3867d6",
          backgroundColor: "rgba(56, 103, 214, 0.1)",
          borderWidth: 2,
          tension: 0.3,
          yAxisID: "y1",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: `${color}`,
            font: {
              size: 14,
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: "rgba(160, 174, 192, 0.1)",
          },
          ticks: {
            color: `${color}`,
            maxTicksLimit: 5,
            font: {
              size: 12,
            },
          },
        },
        y: {
          type: "linear",
          display: true,
          position: "left",
          min: 0,
          grid: {
            color: "rgba(160, 174, 192, 0.1)",
          },
          ticks: {
            color: `${color}`,
            font: {
              size: 12,
            },
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          min: 0,
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            color: `${color}`,
            font: {
              size: 12,
            },
          },
        },
      },
    },
  });

  // Voltage Chart (Bar Chart)
  const voltageCtx = document.getElementById("voltage-chart").getContext("2d");
  barChart = new Chart(voltageCtx, {
    type: "bar",
    data: {
      labels: ["Ipdu1", "Ipdu2", "Ipdu3"],
      datasets: [
        {
          label: "Load (VA)",
          data: ipduSum_arr,
          backgroundColor: [
            "rgba(78, 205, 196, 0.7)",
            "#fc5c6491",
            "#3a67d1af",
          ],
          borderRadius: 10,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(160, 174, 192, 0.1)",
          },
          ticks: {
            color: `${color}`,
            font: {
              size: 12,
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: `${color}`,
            font: {
              size: 12,
            },
          },
        },
      },
    },
  });
}

// Initialize charts when the page loads
window.addEventListener("load", initializeCharts);

// update Line chart
function updateLineChart(x, y) {
  //getting time
  let z = new Date().toLocaleTimeString();
  let date = new Date().toLocaleDateString();
  
  //last Update/synced 
  document.getElementById("lastUpdateTime").textContent = z;
  document.getElementById("lastUpdateDate").textContent = date;

  // Data shifting
  for (let i = 0; i < 7; i++) {
    temp[i] = temp[i + 1];
    hum[i] = hum[i + 1];
    tim[i] = tim[i + 1];
  }

  temp[7] = x;
  hum[7] = y;
  tim[7] = z;

  // Update Line chart
  if (lineChart) {
    lineChart.data.labels = [...tim];
    lineChart.data.datasets[0].data = [...temp];
    lineChart.data.datasets[1].data = [...hum];
    lineChart.update("none");
  }
}

// update Bar chart
function updateBarChart() {
  // Update chart
  if (barChart) {
    barChart.data.datasets[0].data = ipduSum_arr;
    barChart.update("none");
  }
}
// Chart data end

// Sidebar Dropdown
// const allDropdown = document.querySelectorAll('#sidebar .side-dropdown');
// const sidebar = document.getElementById('sidebar');

// allDropdown.forEach(item => {
// 	const a = item.parentElement.querySelector('a:first-child');
// 	a.addEventListener('click', function (e) {
// 		e.preventDefault();

// 		if (!this.classList.contains('active')) {
// 			allDropdown.forEach(i => {
// 				const aLink = i.parentElement.querySelector('a:first-child');

// 				aLink.classList.remove('active');
// 				i.classList.remove('show');
// 			})
// 		}

// 		this.classList.toggle('active');
// 		item.classList.toggle('show');
// 	})
// })
