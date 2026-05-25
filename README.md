# VowSecure

VowSecure is a full-stack healthcare-tech platform designed to promote premarital health awareness and genetic disease screening.

The platform helps users:
- search diagnostic labs,
- get premarital medical test recommendations,
- register/login securely,
- understand possible genetic and infectious disease risks before marriage.

---

# Problem Statement

In many arranged marriages, premarital health screening is often ignored.

This can lead to:
- transmission of genetic disorders,
- inherited blood diseases,
- undetected infectious diseases,
- preventable health complications in future generations.

VowSecure aims to provide:
- awareness,
- accessibility,
- healthcare recommendations,
- centralized lab discovery.

---

# Features

## User Authentication
- User Signup
- User Login

## Lab Search
- Search labs by city
- Search labs by available tests

## Recommendation Engine
AI-assisted premarital test recommendations based on:
- family history,
- cousin marriage,
- sexual health risk factors.

## Dynamic Frontend
- Interactive recommendation system
- Dynamic lab cards
- Multiple frontend pages

---

# Tech Stack

## Frontend
- HTML
- CSS
- JavaScript

## Backend
- Node.js
- Express.js

## Database
- MySQL

---

# APIs Implemented

## Labs
- `/labs`
- `/labs/:city`

## Test Search
- `/tests/:test`

## Authentication
- `/signup`
- `/login`

## Recommendation System
- `/recommend`

---

# Project Structure

```text
VowSecure
│
├── backend
│     ├── server.js
│     ├── package.json
│
└── frontend
      ├── index.html
      ├── signup.html
      ├── login.html
      ├── recommend.html
      ├── dashboard.html
      ├── style.css
      └── script.js
