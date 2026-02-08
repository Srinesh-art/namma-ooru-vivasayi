import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA7cXZr8SS-aqGm1gDPV5LZv31m5i-BqhA",
  authDomain: "nammaooruvivasayi-aa272.firebaseapp.com",
  projectId: "nammaooruvivasayi-aa272",
  storageBucket: "nammaooruvivasayi-aa272.firebasestorage.app",
  messagingSenderId: "942377378089",
  appId: "1:942377378089:web:b35658a45a336a6c5d1738"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM element
const cropList = document.getElementById("crop-list");

if (!cropList) {
  console.error("crop-list element not found");
}

// Load crops
async function loadCrops() {
  cropList.innerHTML = "Loading crops...";

  try {
    const cropsRef = collection(db, "villages", "namma-ooru-demo", "crops");
    const snap = await getDocs(cropsRef);

    console.log("Crop docs:", snap.size);

    if (snap.empty) {
      cropList.innerHTML = "No crops available today";
      return;
    }

    cropList.innerHTML = "";

    snap.forEach(doc => {
      const data = doc.data();

      if (!data.visible) return;

      const div = document.createElement("div");
      div.className = "crop";

      div.innerHTML = `
        <h3>${data.name}</h3>
        <p>Quantity: ${data.quantity}</p>
        <button onclick="window.location.href='tel:${data.farmerPhone}'">📞 Call</button>
        <button onclick="window.location.href='https://wa.me/91${data.farmerPhone}'">💬 WhatsApp</button>
      `;

      cropList.appendChild(div);
    });

  } catch (error) {
    console.error("Firestore error:", error);
    cropList.innerHTML = "Error loading crops";
  }
}

// 🔴 THIS WAS MISSING — NOW THE FUNCTION ACTUALLY RUNS
loadCrops();
