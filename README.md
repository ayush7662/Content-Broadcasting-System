


# 🌐 Content Broadcasting System API

A role-based content broadcasting backend where teachers upload content and principals approve or reject it, with scheduled live delivery.

---

## 🚀 Base URL

https://content-broadcasting-system-wma9.onrender.com

---

## 🔐 Authentication

### Register User

POST /auth/register

Request Body:
{
"name": "Teacher1",
"email": "[teacher1@gmail.com](mailto:teacher1@gmail.com)",
"password": "123456",
"role": "teacher"
}

Response:
{
"id": 1,
"name": "Teacher1",
"email": "[teacher1@gmail.com](mailto:teacher1@gmail.com)",
"role": "teacher"
}

---

### Login User

POST /auth/login

Request Body:
{
"email": "[teacher1@gmail.com](mailto:teacher1@gmail.com)",
"password": "123456"
}

Response:
{
"token": "JWT_TOKEN"
}

---

## 📤 Content Management

### Upload Content (Teacher)

POST /content/upload

Headers:
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
title
description
subject
start_time
end_time
file

---

### Approve Content (Principal)

PUT /content/approve/:id

Headers:
Authorization: Bearer <token>

Response:
{
"msg": "Approved"
}

---

### Reject Content (Principal)

PUT /content/reject/:id

Headers:
Authorization: Bearer <token>

Body:
{
"reason": "Not valid content"
}

---

### Get Live Content

GET /content/live/:teacherId

Response:
{
"data": []
}

---

## 🔐 Authorization

All protected routes require:
Authorization: Bearer YOUR_JWT_TOKEN

---

## 📁 File Access

GET /uploads/{filename}

Example:
GET /uploads/sample.png

---

## 🧠 Role-Based Access

Teacher → Upload content
Principal → Approve / Reject content

---

## 🔄 Application Flow

Teacher → Register → Login → Upload Content
↓
Principal → Login → Approve / Reject
↓
Live API → Shows scheduled approved content

---

## 📌 Notes

* JWT token is required for all protected APIs
* Only teachers can upload content
* Only principals can approve or reject content
* Live API returns only approved and scheduled content

---
