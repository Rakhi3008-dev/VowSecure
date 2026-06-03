# VowSecure

VowSecure is a web-based healthcare support platform designed to help couples and families explore preventive health screening options before marriage. The platform combines basic risk assessment with healthcare service discovery, making it easier to understand recommended tests and locate nearby diagnostic facilities.

The project was developed as a full-stack web application with a focus on accessibility, simple user experience, and practical healthcare guidance.

---

## Features

### Health Risk Assessment

Users answer a few simple questions related to:

* Family history of genetic disorders
* Consanguineous (cousin) marriage
* Sexual health history

Based on the responses, the system suggests relevant medical tests such as:

* HPLC
* Extended Carrier Screening
* Genetic Counseling
* Thalassemia Screening
* HIV Test
* Hepatitis B
* VDRL
* CBC
* Blood Group & Rh Typing
* Vitamin D Test

A basic risk score is also generated to provide an overall indication.

---

### Diagnostic Lab Search

Users can search for diagnostic laboratories by city.

The platform currently includes a curated healthcare dataset covering major Indian cities, allowing fast and reliable search without relying on external APIs.

Supported cities include:

* Delhi
* Mumbai
* Bangalore
* Hyderabad
* Kolkata
* Pune
* Chennai
* Ahmedabad
* Jaipur
* Lucknow

---

### Nearby Healthcare Services

Using the browser's geolocation API, users can quickly discover nearby healthcare providers.

* Nearby diagnostic laboratories
* Nearby hospitals and healthcare centres

Results are displayed both as information cards and as markers on an interactive map.

---

### Interactive Maps

Location data is visualized using Leaflet.js with OpenStreetMap tiles.

Features include:

* Current user location
* Healthcare location markers
* Clickable map popups
* Dynamic map updates

---

### User Authentication

Basic authentication functionality has been implemented for user registration and login.

Passwords are securely hashed before storage.

---

## Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Leaflet.js

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### Authentication

* Firebase Authentication (Google Sign-In)

### Libraries & Tools

* Mongoose
* bcrypt
* CORS
* dotenv
* node-fetch

### Deployment & Version Control

* Render
* GitHub
* Vercel

---

## Project Structure

```
VowSecure
│
├── backend
│   ├── models
│   ├── server.js
│   ├── seedLabs.js
│   ├── seedDoctors.js
│   ├── labs.json
│   └── doctors.json
│
├── frontend
│
├── index.html
├── labs.html
├── recommend.html
├── reports.html
├── login.html
├── signup.html
├── dashboard.html
├── script.js
└── style.css
```


## Future Improvements

* AI-assisted medical report interpretation
* Secure user report storage
* Appointment booking integration
* Expanded healthcare provider database
* Personalized preventive healthcare recommendations



