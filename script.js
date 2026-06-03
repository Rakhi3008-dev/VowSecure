
async function searchLabs() {

  const city =
  document.getElementById(
    "city"
  ).value;



  if (city === "") {

    alert(
      "Enter city name"
    );

    return;
  }



  const result =
  document.getElementById(
    "result"
  );



  result.innerHTML =
  `<p>Searching labs...</p>`;



  try {

    // FETCH LABS FROM BACKEND

    const response = await fetch(
      `https://vowsecure.onrender.com/search-healthcare/${city}`
    );
    
    const data = await response.json();
    
    console.log(data);
    
    if (!Array.isArray(data)) {
      result.innerHTML = `
        <p>Backend Error</p>
        <pre>${JSON.stringify(data)}</pre>
      `;
      return;
    }
    // REMOVE OLD MAP

    if (window.currentMap) { window.currentMap.off(); window.currentMap.remove(); document.getElementById( "map" ).innerHTML = ""; }

    // CREATE MAP
    document.getElementById( "map" ).innerHTML = "";
    const map =
    L.map("map").setView(

      [data[0]?.lat || 20.5937,
 data[0]?.lon || 78.9629],

12
    );



    window.currentMap =
    map;



    // TILE LAYER

    L.tileLayer(

      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

      {

        attribution:
        "&copy; OpenStreetMap contributors",
      }

    ).addTo(map);



    let output = "";

    data.forEach((place) => {

      output += `

      <div class="health-card">

        <div class="health-icon">

          <i class="fa-solid fa-flask"></i>

        </div>

        <h2>

          ${place.name}

        </h2>

        <p class="speciality">

          Diagnostic Laboratory

        </p>

        <div class="health-info">

          <p>

            <i class="fa-solid fa-location-dot"></i>

            ${place.address}

          </p>

        </div>

        <div class="lab-actions">

          <a

            class="test-btn"

            target="_blank"

            href="https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}">

            <i class="fa-solid fa-location-arrow"></i>

            Get Directions

          </a>

        </div>

      </div>

      `;



      // MAP MARKER

      L.marker([

        place.lat,
        place.lon

      ])

      .addTo(map)

      .bindPopup(place.name);

    });



    if (output === "") {

      output =
      `<p>No labs found</p>`;
    }



    result.innerHTML =
    output;

  }

  catch (error) {
    console.error("LAB ERROR:", error);
  
    result.innerHTML = `
      <p>Failed to load labs</p>
      <p>${error.message}</p>
    `;
  }
}
// FIND NEARBY LABS

async function findNearbyLabs() {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const userLat = position.coords.latitude;

      const userLon = position.coords.longitude;

      const response = await fetch(
        `https://vowsecure.onrender.com/nearby-labs?lat=${userLat}&lon=${userLon}`
      );

      const data = await response.json();

      // REMOVE OLD MAP

      if (window.currentMap) {
        window.currentMap.remove();
      }

      // MAP

      const map = L.map("map").setView([userLat, userLon], 13);

      window.currentMap = map;

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {
          attribution: "&copy; OpenStreetMap contributors",
        }
      ).addTo(map);

      // USER LOCATION

      L.marker([userLat, userLon])

        .addTo(map)

        .bindPopup("You are here");

      let output = "";

      data.forEach((lab) => {
        output += `

<div class="health-card">

    <div class="health-icon">

        <i class="fa-solid fa-flask"></i>

    </div>

    <h2>${lab.name}</h2>

    <p class="speciality">

        Diagnostic Laboratory

    </p>

    <div class="health-info">

        <p>

            <i class="fa-solid fa-location-dot"></i>

            ${lab.address}

        </p>

    </div>

    <div class="lab-actions">

        <a
        class="test-btn"

        target="_blank"

        href="https://www.google.com/maps/dir/?api=1&destination=${lab.lat},${lab.lon}">

            <i class="fa-solid fa-location-arrow"></i>

            Get Directions

        </a>

    </div>

</div>

`;

        // LAB MARKER

        L.marker([lab.lat, lab.lon])

          .addTo(map)

          .bindPopup(lab.name);
      });

      document.getElementById("result").innerHTML = output;
    },

    (error) => {
      alert("Location permission denied");
    }
  );
}
   
// FIND NEARBY LABS

async function findNearbyLabs() {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const userLat = position.coords.latitude;

      const userLon = position.coords.longitude;

      const response = await fetch(
        `https://vowsecure.onrender.com/nearby-labs?lat=${userLat}&lon=${userLon}`
      );

      const data = await response.json();

      // REMOVE OLD MAP

      if (window.currentMap) {
        window.currentMap.remove();
      }

      // MAP

      const map = L.map("map").setView([userLat, userLon], 13);

      window.currentMap = map;

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {
          attribution: "&copy; OpenStreetMap contributors",
        }
      ).addTo(map);

      // USER LOCATION

      L.marker([userLat, userLon])

        .addTo(map)

        .bindPopup("You are here");

      let output = "";

      data.forEach((lab) => {
        output += `

<div class="health-card">

    <div class="health-icon">

        <i class="fa-solid fa-flask"></i>

    </div>

    <h2>${lab.name}</h2>

    <p class="speciality">

        Diagnostic Laboratory

    </p>

    <div class="health-info">

        <p>

            <i class="fa-solid fa-location-dot"></i>

            ${lab.address}

        </p>

    </div>

    <div class="lab-actions">

        <a
        class="test-btn"

        target="_blank"

        href="https://www.google.com/maps/dir/?api=1&destination=${lab.lat},${lab.lon}">

            <i class="fa-solid fa-location-arrow"></i>

            Get Directions

        </a>

    </div>

</div>

`;

        // LAB MARKER

        L.marker([lab.lat, lab.lon])

          .addTo(map)

          .bindPopup(lab.name);
      });

      document.getElementById("result").innerHTML = output;
    },

    (error) => {
      alert("Location permission denied");
    }
  );
}

// RECOMMENDATIONS

async function getRecommendations() {
  const family_history = document.getElementById("family_history").value;

  const cousin_marriage = document.getElementById("cousin_marriage").value;

  const sexually_active = document.getElementById("sexually_active").value;

  const response = await fetch(
    `https://vowsecure.onrender.com/recommend?family_history=${family_history}&cousin_marriage=${cousin_marriage}&sexually_active=${sexually_active}`
  );

  const data = await response.json();

  const recommendations = data.recommendations;

  const riskScore = data.riskScore;

  let output = `

    <div class="card">

        <h2>
            Risk Score: ${riskScore}
        </h2>

    </div>

    <div class="recommend-grid">

    `;

  recommendations.forEach((test) => {
    let info = "";

    // HPLC

    if (test === "HPLC") {
      info = `

            <p>

            <b>Disease:</b>

            Thalassemia

            <br><br>

            <b>Why Dangerous?</b>

            Severe thalassemia can cause
            lifelong anemia and repeated
            blood transfusions.

            <br><br>

            <b>Carrier Meaning:</b>

            If both partners are carriers,
            children may inherit severe
            thalassemia major.

            <br><br>

            <b>Recommended Test:</b>

            HPLC screening before marriage.

            </p>

            `;
    }

    // EXTENDED CARRIER SCREENING
    else if (test === "Extended Carrier Screening") {
      info = `

            <p>

            <b>Disease Risk:</b>

            Carrier screening identifies hidden
            inherited genetic disorders.

            <br><br>

            <b>Why Dangerous?</b>

            Two carriers may unknowingly pass
            severe genetic diseases to children.

            <br><br>

            <b>Carrier Meaning:</b>

            A carrier usually has no symptoms
            but can pass the disorder gene.

            <br><br>

            <b>Recommended Test:</b>

            Extended Carrier Genetic Panel.

            </p>

            `;
    }

    // THALASSEMIA SCREENING
    else if (test === "Thalassemia Screening") {
      info = `

            <p>

            <b>About Disease:</b>

            Thalassemia is an inherited
            blood disorder affecting
            hemoglobin production.

            <br><br>

            <b>Why Dangerous?</b>

            Severe thalassemia may require
            lifelong blood transfusions.

            <br><br>

            <b>Carrier Meaning:</b>

            Carrier parents can pass the
            disorder to children.

            <br><br>

            <b>Recommended Test:</b>

            Thalassemia Screening.

            </p>

            `;
    }

    // HIV TEST
    else if (test === "HIV Test") {
      info = `

            <p>

            <b>About Disease:</b>

            HIV weakens the immune system
            and spreads through blood
            and sexual contact.

            <br><br>

            <b>Why Dangerous?</b>

            Untreated HIV can severely
            damage immunity and increase
            infections.

            <br><br>

            <b>Recommended Test:</b>

            HIV 1 & 2 Screening.

            </p>

            `;
    }

    // HEPATITIS B
    else if (test === "Hepatitis B") {
      info = `

            <p>

            <b>About Disease:</b>

            Hepatitis B affects the liver
            and may become chronic.

            <br><br>

            <b>Why Dangerous?</b>

            Long-term infection may cause
            liver failure or liver cancer.

            <br><br>

            <b>Recommended Test:</b>

            HBsAg Screening Test.

            </p>

            `;
    }

    // VDRL
    else if (test === "VDRL") {
      info = `

            <p>

            <b>Purpose:</b>

            VDRL detects syphilis infection.

            <br><br>

            <b>Why Dangerous?</b>

            Untreated syphilis can affect
            the brain, heart, and pregnancy.

            <br><br>

            <b>Recommended Test:</b>

            VDRL Blood Test.

            </p>

            `;
    }

    // CBC
    else if (test === "CBC") {
      info = `

            <p>

            <b>Purpose:</b>

            Complete Blood Count checks
            overall blood health.

            <br><br>

            <b>Why Dangerous?</b>

            Blood abnormalities may indicate
            anemia, infections, or immunity issues.

            <br><br>

            <b>Recommended Test:</b>

            Complete Blood Count (CBC).

            </p>

            `;
    }

    // BLOOD GROUP
    else if (test === "Blood Group & Rh Typing") {
      info = `

            <p>

            <b>Purpose:</b>

            Determines blood group and Rh factor.

            <br><br>

            <b>Why Dangerous?</b>

            Rh incompatibility may create
            pregnancy complications.

            <br><br>

            <b>Recommended Test:</b>

            Blood Group & Rh Typing.

            </p>

            `;
    }

    // VITAMIN D
    else if (test === "Vitamin D Test") {
      info = `

            <p>

            <b>Purpose:</b>

            Checks Vitamin D levels.

            <br><br>

            <b>Why Dangerous?</b>

            Deficiency may weaken bones,
            immunity, and overall health.

            <br><br>

            <b>Recommended Test:</b>

            Vitamin D Blood Test.

            </p>

            `;
    }

    // BLOOD SUGAR
    else if (test === "Blood Sugar Test") {
      info = `

            <p>

            <b>Purpose:</b>

            Detects diabetes and glucose imbalance.

            <br><br>

            <b>Why Dangerous?</b>

            Diabetes may affect heart,
            kidneys, nerves, and pregnancy.

            <br><br>

            <b>Recommended Test:</b>

            Fasting Blood Sugar / HbA1c.

            </p>

            `;
    }

    // GENETIC COUNSELING
    else if (test === "Genetic Counseling") {
      info = `

            <p>

            <b>Purpose:</b>

            Helps couples understand inherited
            disease risks before marriage.

            <br><br>

            <b>Why Dangerous?</b>

            Genetic disorders may pass to
            future generations unknowingly.

            <br><br>

            <b>Recommended Action:</b>

            Consultation with genetic experts.

            </p>

            `;
    }

    // DEFAULT
    else {
      info = `

            <p>

            Recommended healthcare screening
            for preventive premarital care.

            </p>

            `;
    }

    // FINAL CARD

    output += `

        <div class="health-card">

            <div class="health-icon">

                <i class="fa-solid fa-heart-pulse"></i>

            </div>

            <h2>${test}</h2>

            <p class="speciality">

                Recommended Screening

            </p>

            <div class="health-info">

                ${info}

            </div>

            <button
            class="test-btn"

            onclick="
            window.location.href='labs.html'
            ">

                <i class="fa-solid fa-location-dot"></i>

                Get Tested In Nearby Labs

            </button>

        </div>

        `;
  });

  output += `</div>`;

  output += `

    <div class="save-report-section">
    
        <button
        class="test-btn"
    
        onclick="
        saveReport(
            '${recommendations.join(", ")}',
            '${riskScore}'
        )
        ">
    
            Save Report
    
        </button>
    
    </div>
    
    `;
  document.getElementById("result").innerHTML = output;
}

//nearby

async function findNearbyDoctors() {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const userLat = position.coords.latitude;

      const userLon = position.coords.longitude;

      console.log(userLat, userLon);

      const response = await fetch(
        `http://localhost:8000/nearby-doctors?lat=${userLat}&lon=${userLon}`
      );

      const data = await response.json();

      console.log(data);

      // REMOVE OLD MAP

      if (window.currentMap) {
        window.currentMap.remove();
      }

      // CREATE NEW MAP

      const map = L.map("map").setView([userLat, userLon], 13);

      window.currentMap = map;

      // MAP TILES

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {
          attribution: "&copy; OpenStreetMap contributors",
        }
      ).addTo(map);

      // USER MARKER

      L.marker([userLat, userLon])

        .addTo(map)

        .bindPopup("You are here");

      let output = "";

      data.forEach((doctor) => {
        output += `

                    <div class="card">

                        <h3>${doctor.name}</h3>

                        <p>${doctor.address}</p>

                    </div>

                `;

        L.marker([doctor.lat, doctor.lon])

          .addTo(map)

          .bindPopup(
            `
                        <b>${doctor.name}</b>
                        <br>
                        ${doctor.address}
                        `
          );
      });
      console.log(output);
      document.getElementById("result").innerHTML = output;

    },

    (error) => {
      console.log(error);

      alert("Location permission denied");
    }
  );
}

// TOGGLE CHATBOT

function toggleChatbot() {
  const chatbot = document.getElementById("chatbotContainer");

  if (chatbot.style.display === "flex") {
    chatbot.style.display = "none";
  } else {
    chatbot.style.display = "flex";
  }
}



// SEND MESSAGE

async function sendMessage() {
  const input = document.getElementById("chatInput");

  const message = input.value.toLowerCase();

  if (message === "") return;

  const chatMessages = document.getElementById("chatMessages");

  // USER MESSAGE

  chatMessages.innerHTML += `

    <div class="user-message">

        ${message}

    </div>

    `;

  // CLEAR INPUT

  input.value = "";

  // TYPING MESSAGE

  chatMessages.innerHTML += `

    <div
    class="bot-message"
    id="typingMessage">

        Typing...

    </div>

    `;

  chatMessages.scrollTop = chatMessages.scrollHeight;

  // SMART HEALTHCARE AI

  let botReply =
    "Please consult a healthcare professional for accurate medical guidance.";

  // THALASSEMIA

  if (message.includes("thalassemia")) {
    botReply = `Thalassemia is a genetic blood disorder affecting hemoglobin production.

If both partners are carriers, children may inherit severe thalassemia major.

Recommended Tests:
• HPLC
• CBC
• Carrier Screening`;
  }

  // HIV
  else if (message.includes("hiv")) {
    botReply = `HIV weakens the immune system and spreads through blood and sexual contact.

Premarital HIV testing helps couples take preventive healthcare decisions early.`;
  }

  // CBC
  else if (message.includes("cbc")) {
    botReply = `CBC (Complete Blood Count) helps detect:

• anemia
• infections
• blood abnormalities
• overall blood health`;
  }

  // CARRIER SCREENING
  else if (message.includes("carrier")) {
    botReply = `Carrier screening identifies inherited genetic disease risks before planning children.

It helps detect:
• thalassemia
• sickle cell disease
• inherited disorders`;
  }

  // PREMARITAL TESTS
  else if (message.includes("premarital")) {
    botReply = `Common premarital tests include:

• HIV
• Hepatitis B
• CBC
• HPLC
• Blood Group & Rh Typing
• VDRL`;
  }

  // LABS
  else if (message.includes("lab")) {
    botReply = `Use the Nearby Labs feature in VowSecure to find diagnostic laboratories near your location.`;
  }

  // DOCTORS
  else if (message.includes("doctor")) {
    botReply = `Use Nearby Doctors in VowSecure to locate healthcare specialists and clinics around you.`;
  }

  // HEPATITIS
  else if (message.includes("hepatitis")) {
    botReply = `Hepatitis B affects the liver and may become chronic.

Premarital screening helps reduce transmission risks and future complications.`;
  }

  // REMOVE TYPING + SHOW REPLY

  setTimeout(() => {
    const typingMessage = document.getElementById("typingMessage");

    if (typingMessage) {
      typingMessage.remove();
    }

    chatMessages.innerHTML += `

        <div class="bot-message">

            ${botReply}

        </div>

        `;

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 800);
}

function toggleMenu() {
  const navLinks = document.getElementById("navLinks");

  navLinks.classList.toggle("active");
}
