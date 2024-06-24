const base64Credentials = btoa("coalition:skills-test");
const sideContent = document.getElementById("side-content")
const patientContent = document.getElementById("patient-content")
const pasietnProfile = document.getElementById("pasietn-profile")
const labResults = document.getElementById("lab-results")
const ctx = document.getElementById('myChart')
const systolicBox = document.getElementById('systolic-box')
const diastolicBox = document.getElementById('diastolic-box')
const respiratory = document.getElementById('respiratory')
const temperature = document.getElementById('temperature')
const heart = document.getElementById('heart')
const diagList = document.getElementById('diag-list')

let DATA = null
let chart = null;

const sidebar = document.getElementById("sidebar")

function showSide() {
    sidebar.classList.toggle("sidebar-active")
}

function getData() {
    fetch("https://fedskillstest.coalitiontechnologies.workers.dev", {
        method: "GET",
        headers: {
            Authorization: `Basic ${base64Credentials}`,
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error`(HTTP error! status: ${response.status})`;
            }
            return response.json();
        })
        .then((data) => {
            DATA = data
            showSideContent(data)
        })
        .catch((error) => console.error("Error:", error));
}
getData()

function showSideContent(arr) {
    let kod = ""
    arr.map((item, i) => {
        item.id = i + 1
        kod += `<li id="side-link-${item.id}" onclick="showHandlePacient(${item.id}, ${i})" class="side-content-links ${i == 0 ? "active-profile" : ""}">
                    <div>
                        <div class="side-img">
                            <img src="${item.profile_picture}" />
                        </div>
                        <div class="side-text">
                            <p class="body-emphasized-14pt">${item.name}</p>
                            <span class="body-secondary-info-14pt">${item.gender}, ${item.age}</span>
                        </div>
                    </div>
                    <div class="side-more-img">
                        <img src="src/img/more.svg" />
                    </div>
                </li>`
    })
    sideContent.innerHTML = kod
    patientContent.innerHTML = kod
    showPacientProfile(arr[0])
}

function showPacientProfile(obj) {
    pasietnProfile.innerHTML = ""
    labResults.innerHTML = ""
    pasietnProfile.innerHTML = `<div id="pacient-picture">
                                    <img src="${obj.profile_picture}" alt="Pasient Profile Picture" />
                                    <h2 class="card-title-24pt">${obj.name}</h2>
                                </div>
                                <ul>
                                    <li class="profile-list">
                                        <div class="profile-icon">
                                            <img src="src/img/BirthIcon.png" alt="">
                                        </div>
                                        <div class="profile-text">
                                            <p>Date Of Birth</p>
                                            <span>${obj.date_of_birth}</span>
                                        </div>
                                    </li>
                                    <li class="profile-list">
                                        <div class="profile-icon">
                                            <img src="src/img/FemaleIcon.png" alt="">
                                        </div>
                                        <div class="profile-text">
                                            <p>Gender</p>
                                            <span>${obj.gender}</span>
                                        </div>
                                    </li>
                                    <li class="profile-list">
                                        <div class="profile-icon">
                                            <img src="src/img/PhoneIcon.png" alt="">
                                        </div>
                                        <div class="profile-text">
                                            <p>Contact Info.</p>
                                            <span>${obj.phone_number}</span>
                                        </div>
                                    </li>
                                    <li class="profile-list">
                                        <div class="profile-icon">
                                            <img src="src/img/PhoneIcon.png" alt="">
                                        </div>
                                        <div class="profile-text">
                                            <p>Emergency Contacts</p>
                                            <span>${obj.emergency_contact}</span>
                                        </div>
                                    </li>
                                    <li class="profile-list">
                                        <div class="profile-icon">
                                            <img src="src/img/InsuranceIcon.svg" alt="">
                                        </div>
                                        <div class="profile-text">
                                            <p>Insurance Provider</p>
                                            <span>${obj.insurance_type}</span>
                                        </div>
                                    </li>
                                </ul>
                                <div id="show-pacient-information-btn">
                                    <button class="body-emphasized-14pt">Show All Information</button>
                                </div>`
    obj.lab_results.forEach(item => {
        labResults.innerHTML += `<li class="lab-links">
                                <p>${item}</p>
                                <span>
                                    <img src="src/img/download.svg" />
                                </span>
                            </li>`
    })

    if (chart) {
        chart.destroy();
    }
    let diastoliclabels = []
    let systolicLabels = []
    let dateLabels = []

    obj.diagnosis_history.forEach(item => {
        diastoliclabels.push(item.blood_pressure.diastolic.value)
        systolicLabels.push(item.blood_pressure.systolic.value)
        dateLabels.push(item.month + " " + item.year)
    })
    systolicBox.innerHTML = `<p id="sys-text">
                                <span id="sys-span"></span>Systolic
                            </p>
                            <div>${Math.max(...systolicLabels)}</div>
                            `
    diastolicBox.innerHTML = `<p id="dias-text">
                            <span id="dias-span"></span>Diastolic
                        </p>
                        <div>${Math.max(...diastoliclabels)}</div>
                        `
    respiratory.innerHTML = `<div class="temp-img">
                                    <img src="src/img/respiratory rate.svg" alt="respiratory image" />
                                </div>
                                <div class="temp-text">Respiratory Rate</div>
                                <div class="temp-value" id="res-value">${obj.diagnosis_history[0].respiratory_rate.value} bpm</div>
                                <p class="body-regular-14">${obj.diagnosis_history[0].respiratory_rate.levels}</p>`
    
    temperature.innerHTML = `<div class="temp-img">
                                    <img src="src/img/temperature.svg" alt="respiratory image" />
                                </div>
                                <div class="temp-text">Temperature</div>
                                <div class="temp-value" id="res-value">${obj.diagnosis_history[0].temperature.value} °F</div>
                                <p class="body-regular-14">${obj.diagnosis_history[0].temperature.levels}</p>`

    heart.innerHTML = `<div class="temp-img">
                                    <img src="src/img/heart.svg" alt="respiratory image" />
                                </div>
                                <div class="temp-text">Heart Rate</div>
                                <div class="temp-value" id="res-value">${obj.diagnosis_history[0].heart_rate.value} bpm</div>
                                <p class="body-regular-14">${obj.diagnosis_history[0].heart_rate.levels}</p>`

    obj.diagnostic_list.forEach(item => {
        diagList.innerHTML += ` <li>
                                    <p class="body-regular-14">${item.name}</p>
                                    <div class="body-regular-14">${item.description}</div>
                                    <span class="body-regular-14">${item.status}</span>
                                </li>`
    })
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dateLabels.reverse(),
            datasets: [{
                label: '# Systolic',
                data: diastoliclabels.reverse(),
                borderWidth: 3,
                borderColor: "#C26EB4",
                tension: 0.5,
                pointRadius: 3,
                pointBackgroundColor: "#C26EB4"
            },
            {
                label: '# Diastolic',
                data: systolicLabels.reverse(),
                borderWidth: 3,
                borderColor: "#7E6CAB",
                tension: 0.5,
                pointRadius: 3,
                pointBackgroundColor: "#7E6CAB"
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

async function showHandlePacient(id, index) {
    let arr = await DATA.find((item) => id == item.id)
    let activeSideContentLinks = document.querySelectorAll(".side-content-links")
    for (let i = 0; i < activeSideContentLinks.length; i++) {
        activeSideContentLinks[i].classList.remove("active-profile")
    }
    activeSideContentLinks[index].classList.add("active-profile")
    activeSideContentLinks[index + 20].classList.add("active-profile")

    showPacientProfile(arr)
    showSide()
}