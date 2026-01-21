# USER API SPECIFICATION

## Authentication
Use the following header for endpoints that require authentication:
```
Authorization: Bearer <token>
```

> Note: `user_id` for creating user-based data (attendance, leave, overtime, visit, notification) is taken from the JWT (`req.userData.user_id`), **not** from the request body.

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
  "user_password": "password123"
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
    "created_at": "2026-01-21T03:30:27.000Z"
  }
}
```
- Response Error (Email already registered) :
```json
{
  "statusCode": 400,
  "message": "Email Already Registered"
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
- Response Error (Invalid credential) :
```json
{
  "statusCode": 401,
  "message": "Invalid Email or Password",
  "loginResult": null
}
```

## Get All Users (Testing/Admin)
- Endpoint : `/user/admin`
- Method : `GET`
- Auth : (for testing purposes)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get All Users Success",
  "users": [
    {
      "user_id": 10,
      "user_name": "Budi",
      "user_email": "budi@mail.com",
      "user_photo": null,
      "role_name": "Sales",
      "office_name": "Office A",
      "created_at": "2026-01-21T03:30:27.000Z",
      "updated_at": "2026-01-21T03:30:27.000Z"
    }
  ]
}
```

## Get User Detail
- Endpoint : `/user/detail/:id`
- Method : `GET`
- Auth : ✅
- Request Params :
  - `id` : user_id (number)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get User Detail Success",
  "userDetail": {
    "user_id": 10,
    "office_id": 1,
    "role_id": 3,
    "user_name": "Budi",
    "user_email": "budi@mail.com",
    "user_photo": null,
    "role_name": "Sales",
    "office_name": "Office A",
    "created_at": "2026-01-21T03:30:27.000Z",
    "updated_at": "2026-01-21T03:30:27.000Z"
  }
}
```
- Response Error (Not found) :
```json
{
  "statusCode": 404,
  "message": "User Not Found"
}
```

## Get User Basic
- Endpoint : `/user/basic/:id`
- Method : `GET`
- Auth : ✅
- Request Params :
  - `id` : user_id (number)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get User Basic Success",
  "userBasic": {
    "user_id": 10,
    "user_name": "Budi",
    "user_photo": null,
    "role_name": "Sales"
  }
}
```
- Response Error (Not found) :
```json
{
  "statusCode": 404,
  "message": "User Not Found"
}
```

## Update User
- Endpoint : `/user/update/:id`
- Method : `PATCH`
- Auth : ✅
- Content-Type : `multipart/form-data`
- Request Params :
  - `id` : user_id (number)
- Form Data (optional, send only fields to be updated):
  - `office_id` (number)
  - `role_id` (number)
  - `user_name` (string)
  - `user_email` (string)
  - `user_password` (string) → will be hashed
  - `user_image` (file) → stored in user_photo column (bytea)
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Update User Success",
  "user": {
    "user_id": 10,
    "office_id": 1,
    "role_id": 3,
    "user_name": "Budi Update",
    "user_email": "budi@mail.com",
    "user_photo": null,
    "role_name": "Sales",
    "office_name": "Office A",
    "updated_at": "2026-01-21T04:30:27.000Z"
  }
}
```
- Response Error (Not found) :
```json
{
  "statusCode": 404,
  "message": "User Not Found"
}
```

## Delete User
- Endpoint : `/user/delete/:id`
- Method : `DELETE`
- Auth : ✅
- Request Params :
  - `id` : user_id (number)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "DELETE User Success",
  "userId": 10
}
```
- Response Error (Not found) :
```json
{
  "statusCode": 404,
  "message": "User Not Found"
}
```
