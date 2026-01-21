# ATTENDANCE API SPECIFICATION

## Authentication
Use the following header for endpoints that require authentication:
```
Authorization: Bearer <token>
```

> Note: `user_id` for creating user-based data (attendance, leave, overtime, visit, notification) is taken from the JWT (`req.userData.user_id`), **not** from the request body.

## Get All Attendance (Testing/Admin)
- Endpoint : `/attendance/admin`
- Method : `GET`
- Auth : (for testing purposes)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get All Attendance Success",
  "attendances": [
    {
      "attendance_id": 1,
      "user_id": 10,
      "attendance_status": "PRESENT",
      "attendance_in": "2026-01-21T01:00:00.000Z",
      "attendance_out": "2026-01-21T10:00:00.000Z",
      "attendance_desc": null,
      "attendance_date": "2026-01-21",
      "created_at": "2026-01-21T01:00:00.000Z",
      "updated_at": "2026-01-21T10:00:00.000Z",
      "leaves": [],
      "overtimes": []
    }
  ]
}
```
> This endpoint includes relations: `leaves` and `overtimes`.

## Get Crew Attendance (By User)
- Endpoint : `/attendance/crew/:id`
- Method : `GET`
- Auth : ✅
- Request Params :
  - `id` : user_id (number)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Crew Attendance Success",
  "crewAttendances": [
    {
      "attendance_id": 1,
      "user_id": 10,
      "attendance_status": "PRESENT",
      "attendance_in": "2026-01-21T01:00:00.000Z",
      "attendance_out": null,
      "attendance_desc": null,
      "attendance_date": "2026-01-21",
      "created_at": "2026-01-21T01:00:00.000Z",
      "updated_at": "2026-01-21T01:00:00.000Z",
      "leaves": [
        {
          "leave_id": 3,
          "leave_title": "Cuti Tahunan",
          "leave_status": "PENDING"
        }
      ],
      "overtimes": [
        {
          "overtime_id": 2,
          "overtime_start": "2026-01-21T11:00:00.000Z",
          "overtime_end": "2026-01-21T13:00:00.000Z"
        }
      ]
    }
  ]
}
```

## Get Attendance Detail
- Endpoint : `/attendance/detail/:id`
- Method : `GET`
- Auth : ✅
- Request Params :
  - `id` : attendance_id (number)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Attendance Detail Success",
  "attendanceDetail": {
    "attendance_id": 1,
    "user_id": 10,
    "attendance_status": "PRESENT",
    "attendance_in": "2026-01-21T01:00:00.000Z",
    "attendance_out": "2026-01-21T10:00:00.000Z",
    "attendance_desc": null,
    "attendance_date": "2026-01-21",
    "created_at": "2026-01-21T01:00:00.000Z",
    "updated_at": "2026-01-21T10:00:00.000Z",
    "leaves": [],
    "overtimes": []
  }
}
```
- Response Error (Not found) :
```json
{
  "statusCode": 404,
  "message": "Attendance Not Found"
}
```

## Check-in Attendance
- Endpoint : `/attendance/check-in`
- Method : `POST`
- Auth : ✅
- Request Body :
```json
{
  "attendance_status": "PRESENT",
  "attendance_in": "2026-01-21T01:00:00.000Z",
  "attendance_date": "2026-01-21"
}
```
- Response Success :
```json
{
  "statusCode": 201,
  "message": "Create Attendance (Check-in) Success",
  "attendanceIn": {
    "attendance_id": 1,
    "user_id": 10,
    "attendance_status": "PRESENT",
    "attendance_in": "2026-01-21T01:00:00.000Z",
    "attendance_out": null,
    "attendance_desc": null,
    "attendance_date": "2026-01-21",
    "created_at": "2026-01-21T01:00:00.000Z",
    "updated_at": "2026-01-21T01:00:00.000Z"
  }
}
```
- Response Error (Missing required field) :
```json
{
  "statusCode": 400,
  "message": "Missing Required Field"
}
```
- Response Error (Already check-in today) :
```json
{
  "statusCode": 409,
  "message": "You've Already Check In Today"
}
```

## Check-out Attendance
- Endpoint : `/attendance/check-out/:id`
- Method : `PATCH`
- Auth : ✅
- Request Params :
  - `id` : attendance_id (number)
- Request Body :
```json
{
  "attendance_out": "2026-01-21T10:00:00.000Z"
}
```
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Update Attendance (Check-out) Success",
  "attendanceOut": {
    "attendance_id": 1,
    "user_id": 10,
    "attendance_status": "PRESENT",
    "attendance_in": "2026-01-21T01:00:00.000Z",
    "attendance_out": "2026-01-21T10:00:00.000Z",
    "attendance_desc": null,
    "attendance_date": "2026-01-21",
    "created_at": "2026-01-21T01:00:00.000Z",
    "updated_at": "2026-01-21T10:00:00.000Z"
  }
}
```
- Response Error (attendance_out missing) :
```json
{
  "statusCode": 400,
  "message": "attendance_out is required"
}
```
- Response Error (Not found) :
```json
{
  "statusCode": 404,
  "message": "Attendance Not Found"
}
```

## Delete Attendance
- Endpoint : `/attendance/delete/:id`
- Method : `DELETE`
- Auth : ✅
- Request Params :
  - `id` : attendance_id (number)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Delete Attendance Success",
  "attendanceId": 1
}
```
- Response Error (Not found) :
```json
{
  "statusCode": 404,
  "message": "Attendance Not Found"
}
```
