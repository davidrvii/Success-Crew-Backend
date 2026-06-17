# OVERTIME API SPECIFICATION

## Authentication
Use the following header for endpoints that require authentication:
```
Authorization: Bearer <token>
```

> Note: `user_id` for creating user-based data (attendance, leave, overtime, out_of_office, visit, notification) is taken from the JWT (`req.userData.user_id`), **not** from the request body unless specified.

## Get All Overtime
- Endpoint : `/overtime/all`
- Method : `GET`
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get All Overtime Success",
  "overtimes": [
    {
      "overtime_id": 1,
      "overtime_desc": "Stock opname",
      "overtime_start": "2026-06-17T17:00:00.000Z",
      "overtime_end": "2026-06-17T20:00:00.000Z",
      "overtime_status": "PENDING"
    }
  ]
}
```

## Get Overtime Basic All
- Endpoint : `/overtime/basic/all`
- Method : `GET`
- Response Success (output: total overtime unapproved) :
```json
{
  "statusCode": 200,
  "message": "Get Overtime Basic All Success",
  "overtimes": [
    {
      "overtime_id": 1,
      "overtime_status": "PENDING"
    }
  ],
  "total_unapproved": 1
}
```

## Get Overtime Basic By ID
- Endpoint : `/overtime/basic/:overtimeId`
- Method : `GET`
- Auth : ✅
- Response Success (output: total overtime unapproved overall) :
```json
{
  "statusCode": 200,
  "message": "Get Overtime Basic Success",
  "overtimeBasic": {
    "overtime_id": 1,
    "overtime_status": "PENDING",
    "total_unapproved": 1
  }
}
```

## Get Crew Overtime (By User) (Kept as per Rule 2)
- Endpoint : `/overtime/crew/:id`
- Method : `GET`
- Auth : ✅
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
      "overtime_date": "2026-06-17T00:00:00.000Z",
      "overtime_start": "2026-06-17T17:00:00.000Z",
      "overtime_end": "2026-06-17T20:00:00.000Z",
      "overtime_status": "PENDING",
      "created_at": "2026-06-17T10:00:00.000Z",
      "updated_at": "2026-06-17T10:00:00.000Z"
    }
  ]
}
```

## Get Overtime Detail (Kept as per Rule 2)
- Endpoint : `/overtime/detail/:id`
- Method : `GET`
- Auth : ✅
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
    "overtime_date": "2026-06-17T00:00:00.000Z",
    "overtime_start": "2026-06-17T17:00:00.000Z",
    "overtime_end": "2026-06-17T20:00:00.000Z",
    "overtime_status": "PENDING",
    "created_at": "2026-06-17T10:00:00.000Z",
    "updated_at": "2026-06-17T10:00:00.000Z"
  }
}
```

## Add Overtime
- Endpoint : `/overtime/add`
- Method : `POST`
- Auth : ✅
- Request Body :
```json
{
  "user_id": 10,
  "attendance_id": 1,
  "overtime_desc": "Stock opname",
  "overtime_start": "2026-06-17T17:00:00.000Z",
  "overtime_end": "2026-06-17T20:00:00.000Z",
  "overtime_status": "PENDING"
}
```
- Response Success :
```json
{
  "statusCode": 201,
  "message": "Create Overtime Success",
  "overtimeCreated": {
    "user_id": 10,
    "attendance_id": 1,
    "overtime_desc": "Stock opname",
    "overtime_start": "2026-06-17T17:00:00.000Z",
    "overtime_end": "2026-06-17T20:00:00.000Z",
    "overtime_status": "PENDING"
  }
}
```

## Patch Overtime Status
- Endpoint : `/overtime/update/:overtimeId`
- Method : `PATCH`
- Auth : ✅
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
  "overtimeUpdated": {
    "overtime_id": 1,
    "overtime_status": "APPROVED"
  }
}
```

## Update Overtime (PUT)
- Endpoint : `/overtime/update/:overtimeId`
- Method : `UPDATE`
- Auth : ✅
- Request Body :
```json
{
  "overtime_desc": "Stock opname updated",
  "overtime_start": "2026-06-17T17:00:00.000Z",
  "overtime_end": "2026-06-17T21:00:00.000Z",
  "overtime_status": "APPROVED"
}
```
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Update Overtime Success",
  "overtimeUpdated": {
    "overtime_desc": "Stock opname updated",
    "overtime_start": "2026-06-17T17:00:00.000Z",
    "overtime_end": "2026-06-17T21:00:00.000Z",
    "overtime_status": "APPROVED"
  }
}
```

## Delete Overtime
- Endpoint : `/overtime/delete/:overtimeId`
- Method : `DELETE`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Delete Overtime Success",
  "overtimeId": 1
}
```
