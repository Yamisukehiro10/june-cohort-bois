// 1. Initialize Firebase (same config as doctor)
// Replace this with your real Firebase config

const firebaseConfig = {
  apiKey:"AIzaSyCcYe9IBKnJKF20lQakTze9Q6F5NRTAu2A",
  authDomain:"health-care-portal-1cfce.firebaseapp.com",
  databaseURL:"https://health-care-portal-1cfce-default-rtdb.firebaseio.com",
  projectId:"health-care-portal-1cfce",
  storageBucket:"health-care-portal-1cfce.firebasestorage.app",
  messagingSenderId:"290636784551",
  appId:"1:290636784551:web:0fcbb92922b36ae5d2cc82"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Handle Patient Form Submission
document.getElementById("patient-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value.trim();
  const diagnosis = document.getElementById("diagnosis").value.trim();
  const history = document.getElementById("history").value.trim();

  if (!name || !age || !diagnosis) {
    alert("Please fill all required fields.");
    return;
  }

  const newPatientRef = db.ref("patients").push();
  const patientId = newPatientRef.key;

  newPatientRef.set({
    name,
    age,
    diagnosis,
    history,
    prescription: ""
  });

  document.getElementById("submit-message").innerHTML =
    `<p style="color: green;">Data submitted successfully! Your patient ID is: ${patientId}</p>`;
  document.getElementById("patient-form").reset();
});

// Handle Check Prescription Form
document.getElementById("check-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("check-name").value.trim();
  const age = document.getElementById("check-age").value.trim();

  if (!name || !age) {
    alert("Please enter name and age.");
    return;
  }

  db.ref("patients").once("value", function (snapshot) {
    let found = false;

    snapshot.forEach((child) => {
      const data = child.val();

      if (data.name === name && String(data.age) === String(age)) {
        found = true;
        document.getElementById("check-result").innerHTML = `
          <h3>Prescription for ${data.name}</h3>
          <pre>${data.prescription ? data.prescription : "Doctor has not uploaded a prescription yet."}</pre>
        `;
      }
    });

    if (!found) {
      document.getElementById("check-result").innerHTML = `<p style="color:red;">No matching patient found.</p>`;
    }
  });
});
