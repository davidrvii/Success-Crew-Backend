# OUT OF OFFICE (DINAS LUAR) API SPECIFICATION

## Authentication
Use the following header for endpoints that require authentication:
```
Authorization: Bearer <token>
```

> Note: `user_id` for creating user-based data (attendance, leave, overtime, out_of_office, visit, notification) is taken from the JWT (`req.userData.user_id`), **not** from the request body unless specified.

## Get All Out of Office Requests
- Endpoint : `/out-of-office/all`
- Method : `GET`
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get All Out Of Office Success",
  "outOfOffices": [
    {
      "outofoffice_id": 1,
      "outofoffice_desc": "Dinas luar ke klien di Bandung",
      "outofoffice_date": "2026-06-20T00:00:00.000Z",
      "outofoffice_status": "PENDING"
    }
  ]
}
```

## Get Out of Office Basic All
- Endpoint : `/outofoffice/basic/all`
- Method : `GET`
- Response Success (output: total outofoffice unapproved) :
```json
{
  "statusCode": 200,
  "message": "Get Out Of Office Basic All Success",
  "outOfOffices": [
    {
      "outofoffice_id": 1,
      "outofoffice_status": "PENDING"
    }
  ],
  "total_unapproved": 1
}
```

## Get Out of Office Basic By ID
- Endpoint : `/outofoffice/basic/:outOfOfficeId`
- Method : `GET`
- Auth : ✅
- Response Success (output: total outofoffice unapproved overall) :
```json
{
  "statusCode": 200,
  "message": "Get Out Of Office Basic Success",
  "outOfOfficeBasic": {
    "outofoffice_id": 1,
    "outofoffice_status": "PENDING",
    "total_unapproved": 1
  }
}
```

## Get Crew Out of Office Requests (By User) (Kept as per Rule 2)
- Endpoint : `/out-of-office/crew/:id`
- Method : `GET`
- Auth : ✅
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

## Get Out of Office Detail (Kept as per Rule 2)
- Endpoint : `/out-of-office/detail/:id`
- Method : `GET`
- Auth : ✅
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

## Add Out of Office Request
- Endpoint : `/outofoffice/add`
- Method : `POST`
- Auth : ✅
- Request Body :
```json
{
  "user_id": 10,
  "outofoffice_desc": "Dinas luar ke klien di Bandung",
  "outofoffice_date": "2026-06-20",
  "outofoffice_status": "PENDING"
}
```
- Response Success :
```json
{
  "statusCode": 201,
  "message": "Create Out Of Office Success",
  "outOfOfficeCreated": {
    "user_id": 10,
    "outofoffice_desc": "Dinas luar ke klien di Bandung",
    "outofoffice_date": "2026-06-20T00:00:00.000Z",
    "outofoffice_status": "PENDING"
  }
}
```
- Response Error (Conflict) :
  - **409 Conflict** (Out of office request already exists for this date):
  ```json
  {
    "statusCode": 409,
    "message": "Out of office request already exists for this date"
  }
  ```

## Patch Out of Office Status
- Endpoint : `/outofoffice/update/:outOfOfficeId`
- Method : `PATCH`
- Auth : ✅
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
  "outOfOfficeUpdated": {
    "outofoffice_id": 1,
    "outofoffice_status": "APPROVED"
  }
}
```

## Update Out of Office Request (PUT)
- Endpoint : `/out-of-office/update/:outOfOfficeId`
- Method : `UPDATE`
- Auth : ✅
- Request Body :
```json
{
  "outofoffice_desc": "Dinas luar ke klien di Bandung updated",
  "outofoffice_date": "2026-06-21",
  "outofoffice_status": "APPROVED"
}
```
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Update Out Of Office Success",
  "outOfOfficeUpdated": {
    "outofoffice_desc": "Dinas luar ke klien di Bandung updated",
    "outofoffice_date": "2026-06-21T00:00:00.000Z",
    "outofoffice_status": "APPROVED"
  }
}
```

## Delete Out of Office Request
- Endpoint : `/out-of-office/delete/:outOfOfficeId`
- Method : `DELETE`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Delete Out Of Office Success",
  "outOfOfficeId": 1
}
```
