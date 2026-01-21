# LEAVE API SPECIFICATION

## Authentication
Use the following header for endpoints that require authentication:
```
Authorization: Bearer <token>
```

> Note: `user_id` for creating user-based data (attendance, leave, overtime, visit, notification) is taken from the JWT (`req.userData.user_id`), **not** from the request body.

## Get All Leave (Testing/Admin)
- Endpoint : `/leave/admin`
- Method : `GET`
- Auth : (for testing purposes)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get All Leave Success",
  "leaves": [
    {
      "leave_id": 1,
      "user_id": 10,
      "attendance_id": 1,
      "leave_title": "Cuti Tahunan",
      "leave_desc": "Acara keluarga",
      "leave_date": "2026-01-25",
      "leave_status": "PENDING",
      "created_at": "2026-01-21T03:30:27.000Z",
      "updated_at": "2026-01-21T03:30:27.000Z"
    }
  ]
}
```

## Get Crew Leave (By User)
- Endpoint : `/leave/crew/:id`
- Method : `GET`
- Auth : ✅
- Request Params :
  - `id` : user_id (number)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Crew Leave Success",
  "crewLeaves": [
    {
      "leave_id": 1,
      "user_id": 10,
      "attendance_id": 1,
      "leave_title": "Cuti Tahunan",
      "leave_desc": "Acara keluarga",
      "leave_date": "2026-01-25",
      "leave_status": "PENDING",
      "created_at": "2026-01-21T03:30:27.000Z",
      "updated_at": "2026-01-21T03:30:27.000Z"
    }
  ]
}
```

## Get Leave Detail
- Endpoint : `/leave/detail/:id`
- Method : `GET`
- Auth : ✅
- Request Params :
  - `id` : leave_id (number)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Leave Detail Success",
  "leaveDetail": {
    "leave_id": 1,
    "user_id": 10,
    "attendance_id": 1,
    "leave_title": "Cuti Tahunan",
    "leave_desc": "Acara keluarga",
    "leave_date": "2026-01-25",
    "leave_status": "PENDING",
    "created_at": "2026-01-21T03:30:27.000Z",
    "updated_at": "2026-01-21T03:30:27.000Z"
  }
}
```
- Response Error (Not found) :
```json
{
  "statusCode": 404,
  "message": "Leave Not Found"
}
```

## Create New Leave
- Endpoint : `/leave/add`
- Method : `POST`
- Auth : ✅
- Request Body :
```json
{
  "attendance_id": 1,
  "leave_title": "Cuti Tahunan",
  "leave_desc": "Acara keluarga",
  "leave_date": "2026-01-25",
  "leave_status": "PENDING"
}
```
- Required :
  - `leave_title`
  - `leave_date`
- Response Success :
```json
{
  "statusCode": 201,
  "message": "Create Leave Success",
  "newLeave": {
    "leave_id": 1,
    "user_id": 10,
    "attendance_id": 1,
    "leave_title": "Cuti Tahunan",
    "leave_desc": "Acara keluarga",
    "leave_date": "2026-01-25",
    "leave_status": "PENDING",
    "created_at": "2026-01-21T03:30:27.000Z",
    "updated_at": "2026-01-21T03:30:27.000Z"
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

## Update Leave Status
- Endpoint : `/leave/update/:id`
- Method : `PATCH`
- Auth : ✅
- Request Params :
  - `id` : leave_id (number)
- Request Body :
```json
{
  "leave_status": "APPROVED"
}
```
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Update Leave Success",
  "updatedLeave": {
    "leave_id": 1,
    "user_id": 10,
    "attendance_id": 1,
    "leave_title": "Cuti Tahunan",
    "leave_desc": "Acara keluarga",
    "leave_date": "2026-01-25",
    "leave_status": "APPROVED",
    "created_at": "2026-01-21T03:30:27.000Z",
    "updated_at": "2026-01-21T04:30:27.000Z"
  }
}
```
- Response Error (leave_status missing) :
```json
{
  "statusCode": 400,
  "message": "leave_status is required"
}
```
- Response Error (Not found) :
```json
{
  "statusCode": 404,
  "message": "Leave Not Found"
}
```

## Delete Leave
- Endpoint : `/leave/delete/:id`
- Method : `DELETE`
- Auth : ✅
- Request Params :
  - `id` : leave_id (number)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Delete Leave Success",
  "leaveId": 1
}
```
- Response Error (Not found) :
```json
{
  "statusCode": 404,
  "message": "Leave Not Found"
}
```
