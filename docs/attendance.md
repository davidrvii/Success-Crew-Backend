# ATTENDANCE API SPECIFICATION

## Authentication
Use the following header for endpoints that require authentication:
```
Authorization: Bearer <token>
```

> Note: `user_id` for creating user-based data (attendance, leave, overtime, out_of_office, visit, notification) is taken from the JWT (`req.userData.user_id`), **not** from the request body unless specified.

## Get All Attendance
- Endpoint : `/attendance/all`
- Method : `GET`
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get All Attendance Success",
  "attendance": [
    {
      "attendance_id": 1,
      "attendance_status": "Hadir",
      "attendance_in": "2026-06-17T08:00:00.000Z",
      "attendance_out": "2026-06-17T17:00:00.000Z",
      "attendance_date": "2026-06-17T00:00:00.000Z"
    }
  ]
}
```

## Get Attendance Basic (Berdasarkan Tanggal)
- Endpoint : `/attendance/basic`
- Method : `GET`
- Auth : ✅
- Query Params (optional):
  - `date`: Date string formatted as `YYYY-MM-DD` (defaults to today)
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Attendance Basic Success",
  "attendanceBasic": {
    "attendance_in": "2026-06-17T08:00:00.000Z",
    "attendance_out": "2026-06-17T17:00:00.000Z"
  }
}
```

## Get Crew Attendance (By User)
- Endpoint : `/attendance/crew/:userId`
- Method : `GET`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Crew Attendance Success",
  "crewAttendanceHistory": {
    "total_attendance": 150,
    "total_late": 5,
    "total_leave": 3,
    "total_overtime": 10,
    "attendance": [
      {
        "attendance_id": 1,
        "attendance_status": "Hadir",
        "attendance_in": "2026-06-17T08:00:00.000Z",
        "attendance_out": "2026-06-17T17:00:00.000Z",
        "attendance_date": "2026-06-17T00:00:00.000Z"
      }
    ],
    "leave": [
      {
        "leave_id": 1
      }
    ],
    "overtime": [
      {
        "overtime_id": 1
      }
    ]
  }
}
```

## Get Attendance Detail (Kept as per Rule 2)
- Endpoint : `/attendance/detail/:id`
- Method : `GET`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Attendance Detail Success",
  "attendanceDetail": {
    "attendance_id": 1,
    "user_id": 10,
    "attendance_status": "Hadir",
    "attendance_in": "2026-06-17T08:00:00.000Z",
    "attendance_out": "2026-06-17T17:00:00.000Z",
    "attendance_date": "2026-06-17T00:00:00.000Z",
    "created_at": "2026-06-17T08:00:00.000Z",
    "updated_at": "2026-06-17T17:00:00.000Z",
    "overtimes": []
  }
}
```

## Add Attendance
- Endpoint : `/attendance/add`
- Method : `POST`
- Auth : ✅
- Request Body :
```json
{
  "user_id": 10,
  "attendance_date": "2026-06-17"
}
```
- Response Success :
```json
{
  "statusCode": 201,
  "message": "Create Attendance Success",
  "attendanceAdded": {
    "user_id": 10,
    "attendance_date": "2026-06-17T00:00:00.000Z"
  }
}
```

## Patch Checkin (Berdasarkan Tanggal)
- Endpoint : `/attendance/checkin`
- Method : `PATCH`
- Auth : ✅
- Request Body :
```json
{
  "date": "2026-06-17",
  "attendance_status": "Hadir"
}
```
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Check-in Success",
  "checkin": {
    "attendance_in": "2026-06-17T08:15:00.000Z",
    "attendance_status": "Hadir"
  }
}
```

## Patch Checkout (Berdasarkan Tanggal)
- Endpoint : `/attendance/checkout`
- Method : `PATCH`
- Auth : ✅
- Request Body :
```json
{
  "date": "2026-06-17"
}
```
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Check-out Success",
  "checkout": {
    "attendance_date": "2026-06-17T00:00:00.000Z",
    "attendance_out": "2026-06-17T17:05:00.000Z"
  }
}
```

## Update Attendance
- Endpoint : `/attendance/update/:attendanceId`
- Method : `UPDATE`
- Auth : ✅
- Request Body :
```json
{
  "attendance_status": "Telat",
  "attendance_in": "2026-06-17T09:15:00.000Z",
  "attendance_out": "2026-06-17T17:00:00.000Z",
  "attendance_date": "2026-06-17"
}
```
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Update Attendance Success",
  "attendanceUpdated": {
    "attendance_status": "Telat",
    "attendance_in": "2026-06-17T09:15:00.000Z",
    "attendance_out": "2026-06-17T17:00:00.000Z",
    "attendance_date": "2026-06-17T00:00:00.000Z"
  }
}
```

## Delete Attendance
- Endpoint : `/attendance/delete/:attendanceId`
- Method : `DELETE`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Delete Attendance Success",
  "attendanceId": 1
}
```
