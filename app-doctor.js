// 🔧 Firebase config (unchanged)
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

// Load patients from Firebase
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

// Hugging Face token (only for testing)
const HF_API_TOKEN = "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";
async function generatePrescription(patientId) {
  const symptoms = document.getElementById(`symptoms-${patientId}`).value;

  if (!symptoms) {
    alert("Please enter symptoms before generating prescription.");
    return;
  }

  document.getElementById(`prescription-${patientId}`).innerText = "⏳ Generating prescription...";

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `A patient reports the following symptoms: ${symptoms}.
Use proper medical terminology and abbreviations. Consider the patient's age, medical history, and any allergies. Provide alternatives or substitutions where appropriate. Use a clear, legible format.
Generate a clear, medically sound prescription using the format below **only**:

1. Medicine Name — Dosage — Frequency — Duration  
   - Purpose:  
   - Instructions:  
   - Side Effects:  
   - Warnings:  

Respond only with the prescription. Avoid filler words, disclaimers, or headings. Make the prescription complete and concise.`,
        parameters: {
          max_new_tokens: 400,
          temperature: 0.5,
          return_full_text: false
        }
      })
    });

    const result = await response.json();

    console.log("HF Response:", result);

    const prescription = result?.[0]?.generated_text?.trim() || "⚠️ No prescription generated.";
    document.getElementById(`prescription-${patientId}`).innerText = prescription;

    db.ref(`patients/${patientId}/prescription`).set(prescription);
  } catch (error) {
    console.error("Error generating prescription:", error);
    document.getElementById(`prescription-${patientId}`).innerText = "❌ Error generating prescription.";
  }
}
