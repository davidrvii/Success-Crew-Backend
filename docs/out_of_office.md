# OUT OF OFFICE (DINAS LUAR) API SPECIFICATION

## Authentication
Use the following header for endpoints that require authentication:
```
Authorization: Bearer <token>
```

> Note: `user_id` for creating user-based data (attendance, leave, overtime, out_of_office, visit, notification) is taken from the JWT (`req.userData.user_id`), **not** from the request body.

## Get All Out of Office Requests (Admin)
- Endpoint : `/out-of-office/admin`
- Method : `GET`
- Auth : (for testing/admin purposes)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get All Out Of Office Success",
  "outOfOffices": [
    {
      "out_of_office_id": 1,
      "user_id": 10,
      "out_of_office_desc": "Dinas luar ke klien di Bandung",
      "out_of_office_date": "2026-06-20T00:00:00.000Z",
      "out_of_office_status": "PENDING",
      "created_at": "2026-06-17T07:00:00.000Z",
      "updated_at": "2026-06-17T07:00:00.000Z"
    }
  ]
}
```

## Get Crew Out of Office Requests
- Endpoint : `/out-of-office/crew/:id`
- Method : `GET`
- Auth : ✅
- Request Params :
  - `id` : user_id (number)
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Crew Out Of Office Success",
  "crewOutOfOffices": [
    {
      "out_of_office_id": 1,
      "user_id": 10,
      "out_of_office_desc": "Dinas luar ke klien di Bandung",
      "out_of_office_date": "2026-06-20T00:00:00.000Z",
      "out_of_office_status": "PENDING",
      "created_at": "2026-06-17T07:00:00.000Z",
      "updated_at": "2026-06-17T07:00:00.000Z"
    }
  ]
}
```

## Get Out of Office Detail
- Endpoint : `/out-of-office/detail/:id`
- Method : `GET`
- Auth : ✅
- Request Params :
  - `id` : out_of_office_id (number)
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Out Of Office Detail Success",
  "outOfOfficeDetail": {
    "out_of_office_id": 1,
    "user_id": 10,
    "out_of_office_desc": "Dinas luar ke klien di Bandung",
    "out_of_office_date": "2026-06-20T00:00:00.000Z",
    "out_of_office_status": "PENDING",
    "created_at": "2026-06-17T07:00:00.000Z",
    "updated_at": "2026-06-17T07:00:00.000Z"
  }
}
```

## Create Out of Office Request
- Endpoint : `/out-of-office/add`
- Method : `POST`
- Auth : ✅
- Request Body :
```json
{
  "out_of_office_desc": "Dinas luar ke klien di Bandung",
  "out_of_office_date": "2026-06-20"
}
```
- Required :
  - `out_of_office_desc`
  - `out_of_office_date`
- Response Success :
```json
{
  "statusCode": 201,
  "message": "Create Out Of Office Success",
  "newOutOfOffice": {
    "out_of_office_id": 1,
    "user_id": 10,
    "out_of_office_desc": "Dinas luar ke klien di Bandung",
    "out_of_office_date": "2026-06-20T00:00:00.000Z",
    "out_of_office_status": "PENDING",
    "created_at": "2026-06-17T07:00:00.000Z",
    "updated_at": "2026-06-17T07:00:00.000Z"
  }
}
```

## Update Out of Office Status (Approval)
- Endpoint : `/out-of-office/update/:id`
- Method : `PATCH`
- Auth : ✅
- Request Params :
  - `id` : out_of_office_id (number)
- Request Body :
```json
{
  "out_of_office_status": "APPROVED"
}
```
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Update Out Of Office Success",
  "updatedOutOfOffice": {
    "out_of_office_id": 1,
    "user_id": 10,
    "out_of_office_desc": "Dinas luar ke klien di Bandung",
    "out_of_office_date": "2026-06-20T00:00:00.000Z",
    "out_of_office_status": "APPROVED",
    "created_at": "2026-06-17T07:00:00.000Z",
    "updated_at": "2026-06-17T07:05:00.000Z"
  }
}
```
> Note: If the status is updated to `APPROVED` or `DITERIMA`, an attendance record for the date will automatically be created/updated with `attendance_status: 'Dinas Luar'`.

## Delete Out of Office Request
- Endpoint : `/out-of-office/delete/:id`
- Method : `DELETE`
- Auth : ✅
- Request Params :
  - `id` : out_of_office_id (number)
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Delete Out Of Office Success",
  "outOfOfficeId": 1
}
```
