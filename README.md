# Postman Testing Guide - Content Broadcasting System

## Base URL
```
http://localhost:3000
```

---

## Step 1: Register Users

### 1.1 Register Principal (Admin)
```http
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "name": "Principal Kumar",
  "email": "principal@test.com",
  "password": "123456",
  "role": "principal"
}
```

### 1.2 Register Teacher 1
```http
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "name": "Teacher Sharma",
  "email": "teacher1@test.com",
  "password": "123456",
  "role": "teacher"
}
```

### 1.3 Register Teacher 2
```http
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "name": "Teacher Gupta",
  "email": "teacher2@test.com",
  "password": "123456",
  "role": "teacher"
}
```

---

## Step 2: Login

### 2.1 Login as Principal
```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "principal@test.com",
  "password": "123456"
}
```
**Save the `token` from response for Principal requests.**

### 2.2 Login as Teacher 1
```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "teacher1@test.com",
  "password": "123456"
}
```
**Save the `token` from response for Teacher 1 requests.**

### 2.3 Login as Teacher 2
```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "teacher2@test.com",
  "password": "123456"
}
```
**Save the `token` from response for Teacher 2 requests.**

---

## Step 3: Get My Profile
```http
GET http://localhost:3000/auth/me
Authorization: Bearer <your_token_here>
```

---

## Step 4: Teacher Uploads Content

### 4.1 Upload Maths Content (Teacher 1)
```http
POST http://localhost:3000/content/upload
Authorization: Bearer <teacher1_token>
Content-Type: multipart/form-data

Form Data:
- title: "Maths Chapter 1"
- description: "Algebra basics"
- subject: "Maths"
- start_time: "2025-01-01T00:00:00Z"
- end_time: "2026-12-31T23:59:59Z"
- file: <select a JPG/PNG/GIF file>
```

### 4.2 Upload Science Content (Teacher 1)
```http
POST http://localhost:3000/content/upload
Authorization: Bearer <teacher1_token>
Content-Type: multipart/form-data

Form Data:
- title: "Science Chapter 1"
- description: "Physics basics"
- subject: "Science"
- start_time: "2025-01-01T00:00:00Z"
- end_time: "2026-12-31T23:59:59Z"
- file: <select a JPG/PNG/GIF file>
```

### 4.3 Upload Maths Content (Teacher 2)
```http
POST http://localhost:3000/content/upload
Authorization: Bearer <teacher2_token>
Content-Type: multipart/form-data

Form Data:
- title: "Maths Chapter 2"
- description: "Geometry"
- subject: "Maths"
- start_time: "2025-01-01T00:00:00Z"
- end_time: "2026-12-31T23:59:59Z"
- file: <select a JPG/PNG/GIF file>
```

---

## Step 5: Teacher Views Their Uploads
```http
GET http://localhost:3000/content/my-uploads
Authorization: Bearer <teacher1_token>
```

Optional filters:
```http
GET http://localhost:3000/content/my-uploads?status=pending
GET http://localhost:3000/content/my-uploads?subject=Maths
```

---

## Step 6: Principal Views All Content
```http
GET http://localhost:3000/content/all
Authorization: Bearer <principal_token>
```

With filters:
```http
GET http://localhost:3000/content/all?status=pending
GET http://localhost:3000/content/all?subject=Maths
GET http://localhost:3000/content/all?teacher_id=1
GET http://localhost:3000/content/all?page=1&limit=10
```

---

## Step 7: Principal Views Pending Content
```http
GET http://localhost:3000/content/pending
Authorization: Bearer <principal_token>
```

---

## Step 8: Principal Approves Content
```http
PUT http://localhost:3000/content/approve/1
Authorization: Bearer <principal_token>
```

---

## Step 9: Principal Rejects Content
```http
PUT http://localhost:3000/content/reject/2
Authorization: Bearer <principal_token>
Content-Type: application/json

{
  "reason": "Content quality is not sufficient"
}
```

---

## Step 10: Get Content by ID
```http
GET http://localhost:3000/content/1
Authorization: Bearer <any_valid_token>
```

---

## Step 11: Public Broadcasting API (No Auth Required)

### 11.1 Get Live Content for Teacher 1
```http
GET http://localhost:3000/content/live/1
```

### 11.2 Get Live Content for Teacher 1 with Subject Filter
```http
GET http://localhost:3000/content/live/1?subject=Maths
```

### 11.3 Get Live Content for Teacher 2
```http
GET http://localhost:3000/content/live/2
```

---

## Step 12: Delete Content
```http
DELETE http://localhost:3000/content/1
Authorization: Bearer <teacher1_token_or_principal_token>
```

---

## Important Notes

1. **Authorization Header**: Always use `Bearer <token>` format
2. **File Upload**: In Postman, select `form-data` and choose `File` type for the `file` field
3. **Allowed File Types**: Only JPG, PNG, GIF (max 10MB)
4. **Date Format**: Use ISO 8601 format like `2025-01-01T00:00:00Z`
5. **Live API**: No authentication required, but rate limited to 100 requests/minute
6. **Role Check**: Teachers can only upload/view their own content. Principal can approve/reject/view all.

---

## Expected Response Examples

### Register Success
```json
{
  "msg": "User registered successfully",
  "user": {
    "id": 1,
    "name": "Principal Kumar",
    "email": "principal@test.com",
    "role": "principal"
  }
}
```

### Login Success
```json
{
  "msg": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Principal Kumar",
    "email": "principal@test.com",
    "role": "principal"
  }
}
```

### Upload Success
```json
{
  "msg": "Content uploaded successfully",
  "data": {
    "id": 1,
    "title": "Maths Chapter 1",
    "subject": "Maths",
    "status": "pending",
    "file_url": "/uploads/1234567890_image.png",
    ...
  }
}
```

### Live Content Success
```json
{
  "msg": "Live content fetched successfully",
  "data": [
    {
      "subject": "Maths",
      "content": {
        "id": 1,
        "title": "Maths Chapter 1",
        "file_url": "/uploads/1234567890_image.png"
      },
      "rotation": {
        "current_index": 0,
        "total_items": 2,
        "rotation_duration_minutes": 5
      }
    }
  ]
}
```

### No Content Available
```json
{
  "msg": "No content available",
  "data": []
}
```

