# LEAVE (CUTI) API SPECIFICATION

## Authentication
Use the following header for endpoints that require authentication:
```
Authorization: Bearer <token>
```

> Note: `user_id` for creating user-based data (attendance, leave, overtime, out_of_office, visit, notification) is taken from the JWT (`req.userData.user_id`), **not** from the request body.

## Get All Leave Requests (Admin)
- Endpoint : `/leave/admin`
- Method : `GET`
- Auth : (for testing/admin purposes)
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
      "leave_desc": "Acara keluarga penting di luar kota",
      "leave_date": "2026-06-25T00:00:00.000Z",
      "leave_status": "PENDING",
      "created_at": "2026-06-17T07:00:00.000Z",
      "updated_at": "2026-06-17T07:00:00.000Z"
    }
  ]
}
```

## Get Crew Leave Requests
- Endpoint : `/leave/crew/:id`
- Method : `GET`
- Auth : ✅
- Request Params :
  - `id` : user_id (number)
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Crew Leave Success",
  "crewLeaves": [
    {
      "leave_id": 1,
      "user_id": 10,
      "leave_desc": "Acara keluarga penting di luar kota",
      "leave_date": "2026-06-25T00:00:00.000Z",
      "leave_status": "PENDING",
      "created_at": "2026-06-17T07:00:00.000Z",
      "updated_at": "2026-06-17T07:00:00.000Z"
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
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Leave Detail Success",
  "leaveDetail": {
    "leave_id": 1,
    "user_id": 10,
    "leave_desc": "Acara keluarga penting di luar kota",
    "leave_date": "2026-06-25T00:00:00.000Z",
    "leave_status": "PENDING",
    "created_at": "2026-06-17T07:00:00.000Z",
    "updated_at": "2026-06-17T07:00:00.000Z"
  }
}
```

## Create Leave Request
- Endpoint : `/leave/add`
- Method : `POST`
- Auth : ✅
- Request Body :
```json
{
  "leave_desc": "Acara keluarga penting di luar kota",
  "leave_date": "2026-06-25"
}
```
- Required :
  - `leave_desc`
  - `leave_date`
- Response Success :
```json
{
  "statusCode": 201,
  "message": "Create Leave Success",
  "newLeave": {
    "leave_id": 1,
    "user_id": 10,
    "leave_desc": "Acara keluarga penting di luar kota",
    "leave_date": "2026-06-25T00:00:00.000Z",
    "leave_status": "PENDING",
    "created_at": "2026-06-17T07:00:00.000Z",
    "updated_at": "2026-06-17T07:00:00.000Z"
  }
}
```

## Update Leave Status (Approval)
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
    "leave_desc": "Acara keluarga penting di luar kota",
    "leave_date": "2026-06-25T00:00:00.000Z",
    "leave_status": "APPROVED",
    "created_at": "2026-06-17T07:00:00.000Z",
    "updated_at": "2026-06-17T07:06:00.000Z"
  }
}
```
> Note: If the status is updated to `APPROVED` or `DITERIMA`, an attendance record for the date will automatically be created/updated with `attendance_status: 'Cuti'`.

## Delete Leave Request
- Endpoint : `/leave/delete/:id`
- Method : `DELETE`
- Auth : ✅
- Request Params :
  - `id` : leave_id (number)
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Delete Leave Success",
  "leaveId": 1
}
```
