# USER API SPECIFICATION

## Authentication
Use the following header for endpoints that require authentication:
```
Authorization: Bearer <token>
```

> Note: `user_id` for creating user-based data (attendance, leave, overtime, out_of_office, visit, notification) is taken from the JWT (`req.userData.user_id`), **not** from the request body.

## Register User
- Endpoint : `/user/register`
- Method : `POST`
- Request Body :
```json
{
  "office_id": 1,
  "role_id": 3,
  "user_name": "Budi",
  "user_email": "budi@mail.com",
  "user_password": "password123",
  "user_phone": "081234567890",
  "user_birth": "1995-10-24",
  "start_work": "2026-01-01",
  "end_work": null,
  "crew_status": "ACTIVE",
  "contract_status": "KONTRAK"
}
```
- Response Success :
```json
{
  "statusCode": 201,
  "message": "Register User Success",
  "userRegistered": {
    "user_id": 10,
    "office_id": 1,
    "role_id": 3,
    "user_name": "Budi",
    "user_email": "budi@mail.com",
    "user_phone": "081234567890",
    "user_birth": "1995-10-24T00:00:00.000Z",
    "start_work": "2026-01-01T00:00:00.000Z",
    "end_work": null,
    "crew_status": "ACTIVE",
    "contract_status": "KONTRAK",
    "created_at": "2026-01-21T03:30:27.000Z"
  }
}
```

## Login User
- Endpoint : `/user/login`
- Method : `POST`
- Request Body :
```json
{
  "email": "budi@mail.com",
  "password": "password123"
}
```
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Login Success",
  "loginResult": {
    "user_id": 10,
    "user_name": "Budi",
    "user_email": "budi@mail.com",
    "role_id": 3,
    "role_name": "Sales",
    "office_id": 1,
    "office_name": "Office A",
    "token": "jwt_token_here"
  }
}
```

## Get All Users
- Endpoint : `/user/all`
- Method : `GET`
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get All Users Success",
  "users": [
    {
      "user_id": 10,
      "user_photo": null,
      "user_name": "Budi",
      "crew_status": "ACTIVE",
      "contract_status": "KONTRAK",
      "user_email": "budi@mail.com",
      "user_phone": "081234567890",
      "user_birth": "1995-10-24T00:00:00.000Z",
      "start_work": "2026-01-01T00:00:00.000Z",
      "end_work": null,
      "role_name": "Sales",
      "office_name": "Office A"
    }
  ]
}
```

## Get All Crews
- Endpoint : `/user/crew/all`
- Method : `GET`
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get All Crews Success",
  "crew": [
    {
      "user_id": 10,
      "user_photo": null,
      "user_name": "Budi",
      "role_name": "Sales",
      "office_name": "Office A"
    }
  ]
}
```

## Get User Basic
- Endpoint : `/user/basic/:userId`
- Method : `GET`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get User Basic Success",
  "userBasic": {
    "user_id": 10,
    "user_name": "Budi",
    "role_name": "Sales",
    "attedance_in": "2026-06-17T09:15:00.000Z"
  }
}
```

## Get Crew Detail
- Endpoint : `/user/crew/:userId`
- Method : `GET`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Crew User Detail Success",
  "userCrew": {
    "user_id": 10,
    "user_photo": null,
    "user_name": "Budi",
    "role_name": "Sales",
    "crew_status": "ACTIVE",
    "contract_status": "KONTRAK",
    "user_email": "budi@mail.com",
    "user_phone": "081234567890",
    "user_birth": "1995-10-24T00:00:00.000Z",
    "start_work": "2026-01-01T00:00:00.000Z",
    "end_work": null,
    "office_name": "Office A",
    "total_attendance": 150,
    "total_late": 10,
    "total_leave": 5,
    "total_overtime": 20,
    "total_out_of_office": 2,
    "history": [
      {
        "id": 1,
        "type": "attendance",
        "date": "2026-06-17T00:00:00.000Z",
        "status": "Hadir",
        "description": null,
        "details": {
          "attendance_in": "2026-06-17T08:00:00.000Z",
          "attendance_out": "2026-06-17T17:00:00.000Z"
        }
      },
      {
        "id": 2,
        "type": "overtime",
        "date": "2026-06-16T00:00:00.000Z",
        "status": "APPROVED",
        "description": "Lembur pekerjaan X",
        "details": {
          "overtime_start": "2026-06-16T18:00:00.000Z",
          "overtime_end": "2026-06-16T21:00:00.000Z"
        }
      },
      {
        "id": 1,
        "type": "out_of_office",
        "date": "2026-06-15T00:00:00.000Z",
        "status": "APPROVED",
        "description": "Dinas Luar Client Y",
        "details": {
          "out_of_office_start": "2026-06-15T00:00:00.000Z",
          "out_of_office_end": "2026-06-17T00:00:00.000Z"
        }
      },
      {
        "id": 1,
        "type": "leave",
        "date": "2026-06-14T00:00:00.000Z",
        "status": "APPROVED",
        "description": "Acara keluarga",
        "details": {
          "leave_start": "2026-06-14T00:00:00.000Z",
          "leave_end": "2026-06-16T00:00:00.000Z"
        }
      }
    ],
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
        "overtime_id": 2
      }
    ],
    "out_of_office": [
      {
        "out_of_office_id": 1
      }
    ]
  }
}
```

## Get User Detail
- Endpoint : `/user/detail/:userId`
- Method : `GET`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get User Detail Success",
  "userDetail": {
    "user_id": 10,
    "user_photo": null,
    "user_name": "Budi",
    "crew_status": "ACTIVE",
    "contract_status": "KONTRAK",
    "user_email": "budi@mail.com",
    "user_phone": "081234567890",
    "user_birth": "1995-10-24T00:00:00.000Z",
    "start_work": "2026-01-01T00:00:00.000Z",
    "end_work": null,
    "role_name": "Sales",
    "office_name": "Office A"
  }
}
```

## Add Crew
- Endpoint : `/user/crew/add`
- Method : `POST`
- Auth : ✅
- Request Body :
```json
{
  "user_name": "Ahmad",
  "crew_status": "ACTIVE",
  "contract_status": "KONTRAK",
  "user_email": "ahmad@mail.com",
  "password": "password123",
  "user_phone": "081234567891",
  "user_birth": "1996-11-25",
  "start_work": "2026-02-01",
  "end_work": null,
  "role_name": "Crew",
  "office_name": "Main Office"
}
```
- Response Success :
```json
{
  "statusCode": 201,
  "message": "Add Crew Success",
  "crewAdded": {
    "user_id": 11,
    "user_name": "Ahmad",
    "crew_status": "ACTIVE",
    "contract_status": "KONTRAK",
    "user_email": "ahmad@mail.com",
    "user_phone": "081234567891",
    "user_birth": "1996-11-25T00:00:00.000Z",
    "start_work": "2026-02-01T00:00:00.000Z",
    "end_work": null,
    "role_name": "Crew",
    "office_name": "Main Office"
  }
}
```

## Update Crew User
- Endpoint : `/user/crew/update/:userId`
- Method : `PATCH`
- Auth : ✅
- Request Body :
```json
{
  "user_name": "Ahmad Updated",
  "crew_status": "INACTIVE"
}
```
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Update Crew Success",
  "crewUpdated": {
    "user_id": 11,
    "user_name": "Ahmad Updated",
    "crew_status": "INACTIVE",
    "contract_status": "KONTRAK",
    "user_email": "ahmad@mail.com",
    "user_phone": "081234567891",
    "user_birth": "1996-11-25T00:00:00.000Z",
    "start_work": "2026-02-01T00:00:00.000Z",
    "end_work": null,
    "role_name": "Crew",
    "office_name": "Main Office"
  }
}
```

## Update User details (PATCH)
- Endpoint : `/user/update/:userId`
- Method : `PATCH`
- Auth : ✅
- Content-Type : `multipart/form-data`
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Update User Success",
  "user": {
    "user_id": 10,
    "user_photo": "/uploads/images/filename.jpg",
    "user_name": "Budi Update",
    "user_email": "budi@mail.com",
    "user_phone": "081234567890",
    "user_birth": "1995-10-24T00:00:00.000Z"
  }
}
```

## Update User details (PUT)
- Endpoint : `/user/update/:userId`
- Method : `UPDATE`
- Auth : ✅
- Content-Type : `multipart/form-data`
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Update User (PUT) Success",
  "user": {
    "user_id": 10,
    "user_photo": "/uploads/images/filename.jpg",
    "user_name": "Budi Update",
    "crew_status": "ACTIVE",
    "contract_status": "KONTRAK",
    "user_email": "budi@mail.com",
    "user_phone": "081234567890",
    "user_birth": "1995-10-24T00:00:00.000Z",
    "start_work": "2026-01-01T00:00:00.000Z",
    "end_work": null
  }
}
```

## Delete User
- Endpoint : `/user/delete/:userId`
- Method : `DELETE`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 200,
  "message": "DELETE User Success",
  "userId": 10
}
```
