import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA7cXZr8SS-aqGm1gDPV5LZv31m5i-BqhA",
  authDomain: "nammaooruvivasayi-aa272.firebaseapp.com",
  projectId: "nammaooruvivasayi-aa272",
  appId: "1:942377378089:web:b35658a45a336a6c5d1738"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const cropSelect = document.getElementById("cropSelect");
const priceInput = document.getElementById("price");
const status = document.getElementById("status");
const button = document.getElementById("updateBtn");

// 🔐 Auth guard
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "admin-login.html";
  } else {
    loadCrops();
  }
});

// Load crops into dropdown
async function loadCrops() {
  cropSelect.innerHTML = "<option value=''>Select crop</option>";

  const cropsRef = collection(db, "villages", "namma-ooru-demo", "crops");
  const snap = await getDocs(cropsRef);

  snap.forEach(docSnap => {
    const data = docSnap.data();
    if (!data.visible) return;

    const option = document.createElement("option");
    option.value = data.name.toLowerCase();
    option.textContent = data.name;
    cropSelect.appendChild(option);
  });
}

// ✅ THIS WAS MISSING IN DEBUG VERSION
button.addEventListener("click", async () => {
  const cropId = cropSelect.value;
  const price = Number(priceInput.value);

  if (!cropId || !price) {
    status.innerText = "Select crop and enter price";
    return;
  }

  try {
    await setDoc(
      doc(db, "villages", "namma-ooru-demo", "prices", cropId),
      {
        price,
        unit: "per kg",
        lastUpdated: serverTimestamp()
      }
    );

    status.innerText = "Price updated successfully";
  } catch (err) {
    console.error("Firestore write error:", err);
    status.innerText = err.message;
  }
});
