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

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

document.getElementById("patient-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value;
  const symptoms = document.getElementById("symptoms").value.trim();
  const history = document.getElementById("history").value.trim();

  if (!name || !age || !symptoms) {
    alert("Please fill in all required fields.");
    return;
  }

  const newPatientRef = db.ref("patients").push();
  newPatientRef.set({
    name,
    age,
    diagnosis: symptoms,
    history,
    prescription: ""
  }, function(error) {
    const status = document.getElementById("status");
    if (error) {
      status.innerText = "❌ Failed to submit. Try again.";
    } else {
      status.innerText = "✅ Submitted successfully!";
      document.getElementById("patient-form").reset();
    }
  });
});
