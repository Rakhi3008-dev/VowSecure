async function searchLabs() {

    const city = document.getElementById("city").value;

    const response = await fetch(
        `http://localhost:8000/labs/${city}`
    );

    const data = await response.json();

    let output = "";

    data.forEach(lab => {

        output += `
            <div class="card">
                <h3>${lab.lab_name}</h3>

                <p>
                    <b>City:</b> ${lab.city}
                </p>

                <p>
                    <b>Tests:</b> ${lab.tests_available}
                </p>

                <p>
                    <b>Contact:</b> ${lab.contact}
                </p>
            </div>
        `;

    });

    document.getElementById("result").innerHTML = output;

}



// RECOMMENDATION FUNCTION

async function getRecommendations() {

    const family_history =
        document.getElementById("family_history").value;

    const cousin_marriage =
        document.getElementById("cousin_marriage").value;

    const sexually_active =
        document.getElementById("sexually_active").value;

    const response = await fetch(

        `http://localhost:8000/recommend?family_history=${family_history}&cousin_marriage=${cousin_marriage}&sexually_active=${sexually_active}`

    );

    const data = await response.json();

    let output = "";

    data.forEach(test => {

        output += `
            <div class="card">
                <h3>${test}</h3>
            </div>
        `;

    });

    document.getElementById("result").innerHTML = output;

}



// SIGNUP FUNCTION

async function signup() {

    const name =
        document.getElementById("name").value;

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    const city =
        document.getElementById("city").value;

    const response = await fetch(

        `http://localhost:8000/signup?name=${name}&email=${email}&password=${password}&city=${city}`

    );

    const data = await response.text();

    document.getElementById("message")
        .innerHTML = data;

}



// LOGIN FUNCTION

async function login() {

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    const response = await fetch(

        `http://localhost:8000/login?email=${email}&password=${password}`

    );

    const data = await response.text();

    document.getElementById("message")
        .innerHTML = data;

}