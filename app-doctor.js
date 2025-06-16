// 🔧 Replace this with YOUR OWN Firebase config from the console
const firebaseConfig = {
  apiKey:"AIzaSyCcYe9IBKnJKF20lQakTze9Q6F5NRTAu2A",
  authDomain:"health-care-portal-1cfce.firebaseapp.com",
  databaseURL:"https://health-care-portal-1cfce-default-rtdb.firebaseio.com",
  projectId:"health-care-portal-1cfce",
  storageBucket:"health-care-portal-1cfce.firebasestorage.app",
  messagingSenderId:"290636784551",
  appId:"1:290636784551:web:0fcbb92922b36ae5d2cc82"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const patientListDiv = document.getElementById("patient-list");

db.ref("patients").once("value")
  .then(snapshot => {
    const patients = snapshot.val();

    if (!patients) {
      patientListDiv.innerHTML = "<p>No patients found.</p>";
      return;
    }

    patientListDiv.innerHTML = "";

    Object.entries(patients).forEach(([id, data]) => {
      const card = document.createElement("div");
      card.innerHTML = `
        <h3>${data.name}</h3>
        <p><strong>Age:</strong> ${data.age}</p>
        <p><strong>Diagnosis:</strong> ${data.diagnosis}</p>
        <p><strong>History:</strong> ${data.history}</p>
        <input type="text" id="symptoms-${id}" placeholder="Enter symptoms..." />
        <button onclick="generatePrescription('${id}')">Generate & Save Prescription</button>
        <p id="prescription-${id}"></p>
        <hr/>
      `;
      patientListDiv.appendChild(card);
    });
  })
  .catch(error => {
    console.error("Error loading patients:", error);
    patientListDiv.innerHTML = "<p>Error loading patient data.</p>";
  });

function generatePrescription(patientId) {
  const symptoms = document.getElementById(`symptoms-${patientId}`).value;
  const prescription = `AI Suggestion: Prescribe 500mg paracetamol for symptoms "${symptoms}"`;

  document.getElementById(`prescription-${patientId}`).innerText = prescription;

  db.ref(`patients/${patientId}/prescription`).set(prescription);
}