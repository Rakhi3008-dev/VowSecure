import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyA8u_Hc_uMqTom7IyEzGcQC2kIwoLqRagY",
  authDomain: "vow-ab245.firebaseapp.com",
  projectId: "vow-ab245",
  storageBucket: "vow-ab245.firebasestorage.app",
  messagingSenderId: "778275601766",
  appId: "1:778275601766:web:b127c8efa5b39bb38c5ca7",
  measurementId: "G-NJ48TZR36M",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);

// SIGNUP

window.signup = async function () {
  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);

    alert("Signup Successful");

    window.location.href = "login.html";
  } catch (error) {
    alert(error.message);
  }
};

// LOGIN

window.login = async function () {
  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    localStorage.setItem("email", email);

    alert("Login Successful");

    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
  }
};

// GOOGLE LOGIN

window.googleLogin = async function () {
  try {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);

    localStorage.setItem(
      "email",

      result.user.email
    );

    alert("Google Login Successful");

    window.location.href = "dashboard.html";
  } catch (error) {
    console.log(error);

    alert(error.message);
  }
};

// SAVE REPORT

window.saveReport = async function (recommendations, riskScore) {
  try {
    const email = localStorage.getItem("email");

    await addDoc(
      collection(db, "reports"),

      {
        email,

        recommendations,

        riskScore,

        createdAt: new Date(),
      }
    );

    alert("Report Saved");
  } catch (error) {
    console.log(error);

    reportsContainer.innerHTML = `<p>${error.message}</p>`;
  }
};

// UPLOAD REPORT

window.uploadReport = async function () {
  const fileInput = document.getElementById("reportFile");

  const file = fileInput.files[0];

  if (!file) {
    alert("Select a file");

    return;
  }

  try {
    const email = localStorage.getItem("email");

    // STORAGE PATH

    const storageRef = ref(
      storage,

      `reports/${email}/${file.name}`
    );

    // UPLOAD

    await uploadBytes(
      storageRef,

      file
    );

    // GET URL

    const fileURL = await getDownloadURL(storageRef);

    // SAVE IN FIRESTORE

    await addDoc(
      collection(db, "uploadedReports"),

      {
        email,

        fileName: file.name,

        fileURL,

        createdAt: new Date(),
      }
    );

    alert("Report Uploaded Successfully");
  } catch (error) {
    console.log(error);

    alert("Upload Failed");
  }
};
// LOAD REPORTS

window.loadReports = async function () {
  const email = localStorage.getItem("email");

  const reportsContainer = document.getElementById("reports");

  if (!email) {
    reportsContainer.innerHTML = `<p>Please login first</p>`;

    return;
  }

  try {
    const querySnapshot = await getDocs(collection(db, "reports"));

    let output = "";

    querySnapshot.forEach((doc) => {
      const report = doc.data();

      if (report.email === email) {
        output += `

                <div class="health-card">

                    <h2>

                        Risk Score:
                        ${report.riskScore}

                    </h2>

                    <p>

                        ${report.recommendations}

                    </p>

                </div>

                `;
      }
    });

    if (output === "") {
      output = `<p>No reports found</p>`;
    }

    reportsContainer.innerHTML = output;
  } catch (error) {
    console.log(error);

    reportsContainer.innerHTML = `<p>Failed to load reports</p>`;
  }
};
window.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("reports")) {
      window.loadReports();
  }
});

