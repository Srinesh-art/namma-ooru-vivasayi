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

  const cropsRef = collection(db, "villages", "namma-ooru-demo", "crops");
  const pricesRef = collection(db, "villages", "namma-ooru-demo", "prices");

  const [cropsSnap, pricesSnap] = await Promise.all([
    getDocs(cropsRef),
    getDocs(pricesRef)
  ]);

  const priceMap = {};
  pricesSnap.forEach(p => {
    priceMap[p.id] = p.data();
  });

  cropList.innerHTML = "";

  cropsSnap.forEach(docSnap => {
    const crop = docSnap.data();
    if (!crop.visible) return;

    const priceDoc = priceMap[crop.name.toLowerCase()];
    const priceText = priceDoc ? `₹${priceDoc.price} / kg` : "Price not set";

    const div = document.createElement("div");
    div.className = "crop";

    div.innerHTML = `
      <h3>${crop.name}</h3>
      <p><strong>${priceText}</strong></p>
      <p>Quantity: ${crop.quantity}</p>
      <button onclick="location.href='tel:${crop.farmerPhone}'">📞 Call</button>
      <button onclick="location.href='https://wa.me/91${crop.farmerPhone}'">💬 WhatsApp</button>
    `;

    cropList.appendChild(div);
  });
}

// 🔴 THIS WAS MISSING — NOW THE FUNCTION ACTUALLY RUNS
loadCrops();
