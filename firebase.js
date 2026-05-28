import { initializeApp }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";



import {

    getAuth,

    createUserWithEmailAndPassword,

    signInWithEmailAndPassword,
    signOut,

    GoogleAuthProvider,

    signInWithPopup


}

from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



import {

    getFirestore,

    collection,

    addDoc,

    getDocs,

    getStorage,

    ref,

    uploadBytes,

    getDownloadURL

}

from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const firebaseConfig = {
    apiKey: "AIzaSyA8u_Hc_uMqTom7IyEzGcQC2kIwoLqRagY",
    authDomain: "vow-ab245.firebaseapp.com",
    projectId: "vow-ab245",
    storageBucket: "vow-ab245.firebasestorage.app",
    messagingSenderId: "778275601766",
    appId: "1:778275601766:web:b127c8efa5b39bb38c5ca7",
    measurementId: "G-NJ48TZR36M"
  };
  



const app =
initializeApp(firebaseConfig);



const auth =
getAuth(app);



const db =
getFirestore(app);

const storage =
getStorage(app);

// SIGNUP

window.signup =
async function(){

    const email =
    document.getElementById(
        "email"
    ).value;



    const password =
    document.getElementById(
        "password"
    ).value;



    try{

        await
        createUserWithEmailAndPassword(

            auth,
            email,
            password
        );



        alert(
            "Signup Successful"
        );



        window.location.href =
        "login.html";
    }

    catch(error){

        alert(error.message);
    }
};



// LOGIN

window.login =
async function(){

    const email =
    document.getElementById(
        "email"
    ).value;



    const password =
    document.getElementById(
        "password"
    ).value;



    try{

        await
        signInWithEmailAndPassword(

            auth,
            email,
            password
        );



        localStorage.setItem(
            "email",
            email
        );



        alert(
            "Login Successful"
        );



        window.location.href =
        "dashboard.html";
    }

    catch(error){

        alert(error.message);
    }
};

// GOOGLE LOGIN

window.googleLogin =
async function(){

    try{

        const provider =
        new GoogleAuthProvider();



        const result =
        await signInWithPopup(

            auth,
            provider
        );



        localStorage.setItem(

            "email",

            result.user.email
        );



        alert(
            "Google Login Successful"
        );



        window.location.href =
        "dashboard.html";
    }

    catch(error){

        console.log(error);

        alert(error.message);
    }
};

// SAVE REPORT

window.saveReport =
async function(
    recommendations,
    riskScore
){

    try{

        const email =
        localStorage.getItem(
            "email"
        );



        await addDoc(

            collection(
                db,
                "reports"
            ),

            {

                email,

                recommendations,

                riskScore,

                createdAt:
                new Date()
            }
        );



        alert(
            "Report Saved"
        );
    }

    catch(error){

        console.log(error);
    
        reportsContainer.innerHTML =
    
        `<p>${error.message}</p>`;
    }
};

// UPLOAD REPORT

window.uploadReport =
async function(){

    const fileInput =
    document.getElementById(
        "reportFile"
    );



    const file =
    fileInput.files[0];



    if(!file){

        alert(
            "Select a file"
        );

        return;
    }



    try{

        const email =
        localStorage.getItem(
            "email"
        );



        // STORAGE PATH

        const storageRef =
        ref(

            storage,

            `reports/${email}/${file.name}`
        );



        // UPLOAD

        await uploadBytes(

            storageRef,

            file
        );



        // GET URL

        const fileURL =
        await getDownloadURL(
            storageRef
        );



        // SAVE IN FIRESTORE

        await addDoc(

            collection(
                db,
                "uploadedReports"
            ),

            {

                email,

                fileName:
                file.name,

                fileURL,

                createdAt:
                new Date()
            }
        );



        alert(
            "Report Uploaded Successfully"
        );

    }

    catch(error){

        console.log(error);

        alert(
            "Upload Failed"
        );
    }
};
// LOAD REPORTS

window.loadReports =
async function(){

    const email =
    localStorage.getItem(
        "email"
    );



    const reportsContainer =
    document.getElementById(
        "reports"
    );



    if(!email){

        reportsContainer.innerHTML =

        `<p>Please login first</p>`;

        return;
    }



    try{

        const querySnapshot =
        await getDocs(

            collection(
                db,
                "reports"
            )
        );



        let output = "";



        querySnapshot.forEach((doc)=>{

            const report =
            doc.data();



            if(report.email === email){

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



        if(output === ""){

            output =

            `<p>No reports found</p>`;
        }



        reportsContainer.innerHTML =
        output;
    }

    catch(error){

        console.log(error);

        reportsContainer.innerHTML =

        `<p>Failed to load reports</p>`;
    }
};

// AI REPORT ANALYSIS

window.analyzeReport =
async function(){

    const fileInput =
    document.getElementById(
        "reportFile"
    );



    const file =
    fileInput.files[0];



    if(!file){

        alert(
            "Select report first"
        );

        return;
    }



    const formData =
    new FormData();



    formData.append(
        "file",
        file
    );



    formData.append(
        "apikey",
        "K87817466788957"
    );



    try{

        // OCR API

        const response =
        await fetch(

            "https://api.ocr.space/parse/image",

            {

                method: "POST",

                body: formData
            }
        );



        const result =
        await response.json();



        const extractedText =

        result.ParsedResults[0]
        .ParsedText;



        console.log(
            extractedText
        );



        // GEMINI AI

        const aiResponse =
        await fetch(

        "AQ.Ab8RN6J8JdJbugIEYD_7spw9Q8D82wYnWrMHaigFefHI2rqTcw",

        {

            method: "POST",

            headers: {

                "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

                contents: [

                    {

                        parts: [

                            {

                                text:

`Analyze this medical report and give:

1. Summary
2. Risk level
3. Abnormal values
4. Recommendations

Report:

${extractedText}`

                            }
                        ]
                    }
                ]
            })
        });



        const aiData =
        await aiResponse.json();



        const analysis =

        aiData.candidates[0]
        .content.parts[0].text;



        document.getElementById(
            "analysisResult"
        ).innerHTML =

        analysis;

    }

    catch(error){

        console.log(error);

        alert(
            "Analysis Failed"
        );
    }
};
//dashboard
// LOAD DASHBOARD

window.loadDashboard =
async function(){

    const email =
    localStorage.getItem(
        "email"
    );



    // NOT LOGGED IN

    if(!email){

        window.location.href =
        "login.html";

        return;
    }



    // SHOW USER

    const welcomeUser =
    document.getElementById(
        "welcomeUser"
    );



    if(welcomeUser){

        welcomeUser.innerHTML =

        `Welcome, ${email}`;
    }



    try{

        // GET FIREBASE REPORTS

        const querySnapshot =
        await getDocs(

            collection(
                db,
                "reports"
            )
        );



        let reports = [];



        querySnapshot.forEach((doc)=>{

            const report =
            doc.data();



            if(report.email === email){

                reports.push(report);
            }
        });



        // TOTAL REPORTS

        const totalReports =
        document.getElementById(
            "totalReports"
        );



        if(totalReports){

            totalReports.innerHTML =
            reports.length;
        }



        // LATEST RISK

        const latestRisk =
        document.getElementById(
            "latestRisk"
        );



        if(latestRisk){

            if(reports.length > 0){

                latestRisk.innerHTML =

                reports[
                    reports.length - 1
                ].riskScore;
            }

            else{

                latestRisk.innerHTML =
                "0";
            }
        }

    }

    catch(error){

        console.log(error);
    }
};