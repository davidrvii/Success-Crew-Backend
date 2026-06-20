# LEAVE (CUTI) API SPECIFICATION

## Authentication
Use the following header for endpoints that require authentication:
```
Authorization: Bearer <token>
```

> Note: `user_id` for creating user-based data (attendance, leave, overtime, out_of_office, visit, notification) is taken from the JWT (`req.userData.user_id`), **not** from the request body unless specified.

## Get All Leave Request
- Endpoint : `/leave/all`
- Method : `GET`
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get All Leave Success",
  "leaves": [
    {
      "leave_id": 1,
      "leave_desc": "Acara keluarga penting di luar kota",
      "leave_start": "2026-06-25T00:00:00.000Z",
      "leave_end": "2026-06-27T00:00:00.000Z",
      "leave_status": "PENDING",
      "Crew": "David Revivaldy"
    }
  ]
}
```

## Get Leave Basic All
- Endpoint : `/leaves/basic/all`
- Method : `GET`
- Response Success (output: total leave unapproved) :
```json
{
  "statusCode": 200,
  "message": "Get Leave Basic All Success",
  "leaves": [
    {
      "leave_id": 1,
      "leave_status": "PENDING",
      "Crew": "David Revivaldy"
    }
  ],
  "total_unapproved": 1
}
```

## Get Leave Basic By ID
- Endpoint : `/leaves/basic/:leaveId`
- Method : `GET`
- Auth : ✅
- Response Success (output: total leave unapproved overall) :
```json
{
  "statusCode": 200,
  "message": "Get Leave Basic Success",
  "leaveBasic": {
    "leave_id": 1,
    "leave_status": "PENDING",
    "total_unapproved": 1,
    "Crew": "David Revivaldy"
  }
}
```

## Get Crew Leave Requests (By User) (Kept as per Rule 2)
- Endpoint : `/leave/crew/:id`
- Method : `GET`
- Auth : ✅
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
      "leave_start": "2026-06-25T00:00:00.000Z",
      "leave_end": "2026-06-27T00:00:00.000Z",
      "leave_status": "PENDING",
      "created_at": "2026-06-17T07:00:00.000Z",
      "updated_at": "2026-06-17T07:00:00.000Z",
      "Crew": "David Revivaldy"
    }
  ]
}
```

## Get Leave Detail (Kept as per Rule 2)
- Endpoint : `/leave/detail/:id`
- Method : `GET`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Leave Detail Success",
  "leaveDetail": {
    "leave_id": 1,
    "user_id": 10,
    "leave_desc": "Acara keluarga penting di luar kota",
    "leave_start": "2026-06-25T00:00:00.000Z",
    "leave_end": "2026-06-27T00:00:00.000Z",
    "leave_status": "PENDING",
    "created_at": "2026-06-17T07:00:00.000Z",
    "updated_at": "2026-06-17T07:00:00.000Z",
    "Crew": "David Revivaldy"
  }
}
```

## Add Leave
- Endpoint : `/leave/add`
- Method : `POST`
- Auth : ✅
- Request Body :
```json
{
  "user_id": 10,
  "leave_desc": "Acara keluarga penting di luar kota",
  "leave_start": "2026-06-25",
  "leave_end": "2026-06-27",
  "leave_status": "PENDING"
}
```
- Response Success :
```json
{
  "statusCode": 201,
  "message": "Create Leave Success",
  "leaveCreated": {
    "user_id": 10,
    "leave_desc": "Acara keluarga penting di luar kota",
    "leave_start": "2026-06-25T00:00:00.000Z",
    "leave_end": "2026-06-27T00:00:00.000Z",
    "leave_status": "PENDING"
  }
}
```
- Response Error (Conflict / Overlap) :
  - **409 Conflict** (Leave request overlaps with an existing leave record for this user):
  ```json
  {
    "statusCode": 409,
    "message": "Leave request overlaps with an existing leave record for this user"
  }
  ```

## Patch Leave Status
- Endpoint : `/leave/update/:leaveId`
- Method : `PATCH`
- Auth : ✅
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
  "leaveUpdated": {
    "leave_id": 1,
    "leave_status": "APPROVED"
  }
}
```

## Update Leave (PUT)
- Endpoint : `/leave/update/:leaveId`
- Method : `UPDATE`
- Auth : ✅
- Request Body :
```json
{
  "leave_desc": "Acara keluarga penting di luar kota updated",
  "leave_start": "2026-06-26",
  "leave_end": "2026-06-28",
  "leave_status": "APPROVED"
}
```
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Update Leave Success",
  "leaveUpdated": {
    "leave_desc": "Acara keluarga penting di luar kota updated",
    "leave_start": "2026-06-26T00:00:00.000Z",
    "leave_end": "2026-06-28T00:00:00.000Z",
    "leave_status": "APPROVED"
  }
}
```

## Delete Leave
- Endpoint : `/leave/delete/:leaveId`
- Method : `DELETE`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Delete Leave Success",
  "leaveId": 1
}
```
