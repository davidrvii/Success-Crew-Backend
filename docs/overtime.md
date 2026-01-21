# OVERTIME API SPECIFICATION

## Authentication
Use the following header for endpoints that require authentication:
```
Authorization: Bearer <token>
```

> Note: `user_id` for creating user-based data (attendance, leave, overtime, visit, notification) is taken from the JWT (`req.userData.user_id`), **not** from the request body.

## Get All Overtime (Testing/Admin)
- Endpoint : `/overtime/admin`
- Method : `GET`
- Auth : (for testing purposes)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get All Overtime Success",
  "overtimes": [
    {
      "overtime_id": 1,
      "user_id": 10,
      "attendance_id": 1,
      "overtime_desc": "Stock opname",
      "overtime_date": "2026-01-21",
      "overtime_start": "2026-01-21T11:00:00.000Z",
      "overtime_end": "2026-01-21T13:00:00.000Z",
      "overtime_status": "PENDING",
      "created_at": "2026-01-21T03:30:27.000Z",
      "updated_at": "2026-01-21T03:30:27.000Z"
    }
  ]
}
```

## Get Crew Overtime (By User)
- Endpoint : `/overtime/crew/:id`
- Method : `GET`
- Auth : ✅
- Request Params :
  - `id` : user_id (number)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Crew Overtime Success",
  "crewOvertimes": [
    {
      "overtime_id": 1,
      "user_id": 10,
      "attendance_id": 1,
      "overtime_desc": "Stock opname",
      "overtime_date": "2026-01-21",
      "overtime_start": "2026-01-21T11:00:00.000Z",
      "overtime_end": "2026-01-21T13:00:00.000Z",
      "overtime_status": "PENDING",
      "created_at": "2026-01-21T03:30:27.000Z",
      "updated_at": "2026-01-21T03:30:27.000Z"
    }
  ]
}
```

## Get Overtime Detail
- Endpoint : `/overtime/detail/:id`
- Method : `GET`
- Auth : ✅
- Request Params :
  - `id` : overtime_id (number)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Overtime Detail Success",
  "overtimeDetail": {
    "overtime_id": 1,
    "user_id": 10,
    "attendance_id": 1,
    "overtime_desc": "Stock opname",
    "overtime_date": "2026-01-21",
    "overtime_start": "2026-01-21T11:00:00.000Z",
    "overtime_end": "2026-01-21T13:00:00.000Z",
    "overtime_status": "PENDING",
    "created_at": "2026-01-21T03:30:27.000Z",
    "updated_at": "2026-01-21T03:30:27.000Z"
  }
}
```
- Response Error (Not found) :
```json
{
  "statusCode": 404,
  "message": "Overtime Not Found"
}
```

## Create New Overtime
- Endpoint : `/overtime/add`
- Method : `POST`
- Auth : ✅
- Request Body :
```json
{
  "attendance_id": 1,
  "overtime_desc": "Stock opname",
  "overtime_date": "2026-01-21",
  "overtime_start": "2026-01-21T11:00:00.000Z",
  "overtime_end": "2026-01-21T13:00:00.000Z",
  "overtime_status": "PENDING"
}
```
- Required :
  - `attendance_id`
  - `overtime_desc`
  - `overtime_date`
  - `overtime_start`
  - `overtime_end`
- Notes :
  - `overtime_status` default: `PENDING`
- Response Success :
```json
{
  "statusCode": 201,
  "message": "Create Overtime Success",
  "newOvertime": {
    "overtime_id": 1,
    "user_id": 10,
    "attendance_id": 1,
    "overtime_desc": "Stock opname",
    "overtime_date": "2026-01-21",
    "overtime_start": "2026-01-21T11:00:00.000Z",
    "overtime_end": "2026-01-21T13:00:00.000Z",
    "overtime_status": "PENDING",
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
- Response Error (Overtime desc missing) :
```json
{
  "statusCode": 400,
  "message": "Overtime description is required"
}
```

## Update Overtime Status
- Endpoint : `/overtime/update/:id`
- Method : `PATCH`
- Auth : ✅
- Request Params :
  - `id` : overtime_id (number)
- Request Body :
```json
{
  "overtime_status": "APPROVED"
}
```
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Update Overtime Status Success",
  "updatedOvertime": {
    "overtime_id": 1,
    "user_id": 10,
    "attendance_id": 1,
    "overtime_desc": "Stock opname",
    "overtime_date": "2026-01-21",
    "overtime_start": "2026-01-21T11:00:00.000Z",
    "overtime_end": "2026-01-21T13:00:00.000Z",
    "overtime_status": "APPROVED",
    "created_at": "2026-01-21T03:30:27.000Z",
    "updated_at": "2026-01-21T04:30:27.000Z"
  }
}
```
- Response Error (overtime_status missing) :
```json
{
  "statusCode": 400,
  "message": "overtime_status is required"
}
```
- Response Error (Not found) :
```json
{
  "statusCode": 404,
  "message": "Overtime Not Found"
}
```

## Delete Overtime
- Endpoint : `/overtime/delete/:id`
- Method : `DELETE`
- Auth : ✅
- Request Params :
  - `id` : overtime_id (number)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Delete Overtime Success",
  "overtimeId": 1
}
```
- Response Error (Not found) :
```json
{
  "statusCode": 404,
  "message": "Overtime Not Found"
}
```
