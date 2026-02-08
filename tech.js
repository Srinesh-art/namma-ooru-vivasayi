/* ===============================
   IMPORTS
================================ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===============================
   INIT
================================ */
const firebaseConfig = {
  apiKey: "AIzaSyA7cXZr8SS-aqGm1gDPV5LZv31m5i-BqhA",
  authDomain: "nammaooruvivasayi-aa272.firebaseapp.com",
  projectId: "nammaooruvivasayi-aa272",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ===============================
   PAGE ELEMENTS
================================ */
const loginBtn = document.getElementById("loginBtn");
const addCropBtn = document.getElementById("addCropBtn");

/* ===============================
   LOGIN PAGE
================================ */
if (loginBtn) {
  loginBtn.onclick = async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const status = document.getElementById("status");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "tech-dashboard.html";
    } catch (e) {
      status.innerText = e.message;
    }
  };
}

/* ===============================
   DASHBOARD AUTH + ROLE CHECK
================================ */
if (addCropBtn) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "tech-login.html";
      return;
    }

    const roleRef = doc(
      db,
      "villages",
      "namma-ooru-demo",
      "techPersons",
      user.uid
    );

    const snap = await getDoc(roleRef);

    if (!snap.exists()) {
      alert("Access denied: Not a tech person");
      await signOut(auth);
      window.location.href = "tech-login.html";
      return;
    }

    document.getElementById("welcome").innerText =
      `Welcome ${snap.data().name || "Tech Person"}`;

    // ✅ ONLY place where crops are loaded
    loadMyCrops();
  });
}

/* ===============================
   ADD VEGETABLE
================================ */
if (addCropBtn) {
  addCropBtn.onclick = async () => {
    const name = document.getElementById("cropName").value.trim();
    const quantity = document.getElementById("quantity").value.trim();
    const quality = document.getElementById("quality").value;
    const farmerPhone = document.getElementById("farmerPhone").value.trim();
    const status = document.getElementById("status");

    if (!name || !quantity || !quality || !farmerPhone) {
      status.innerText = "Please fill all fields";
      return;
    }

    await addDoc(
      collection(db, "villages", "namma-ooru-demo", "crops"),
      {
        name,
        quantity,
        quality,
        farmerPhone,
        uploadedBy: auth.currentUser.uid,
        visible: true,
        createdAt: serverTimestamp()
      }
    );

    status.innerText = "Vegetable added successfully";

    document.getElementById("cropName").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("quality").value = "";
    document.getElementById("farmerPhone").value = "";

    // ✅ refresh list after add
    loadMyCrops();
  };
}

/* ===============================
   LOAD + DELETE MY CROPS
================================ */
async function loadMyCrops() {
  const container = document.getElementById("myCrops");
  container.innerHTML = "Loading...";

  const q = query(
    collection(db, "villages", "namma-ooru-demo", "crops"),
    where("uploadedBy", "==", auth.currentUser.uid)
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    container.innerHTML = "<p>No uploads yet</p>";
    return;
  }

  container.innerHTML = "";

  snap.forEach(docSnap => {
    const crop = docSnap.data();
    const div = document.createElement("div");

    div.innerHTML = `
      <strong>${crop.name}</strong><br>
      Quantity: ${crop.quantity}<br>
      Quality: ${crop.quality}<br>
      <button>Delete</button>
      <hr>
    `;

    div.querySelector("button").onclick = async () => {
      if (!confirm("Delete this crop?")) return;
      await deleteDoc(docSnap.ref);
      loadMyCrops();
    };

    container.appendChild(div);
  });
}

/* ===============================
   LOGOUT
================================ */
window.logout = async () => {
  await signOut(auth);
  window.location.href = "tech-login.html";
};
