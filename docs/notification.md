# NOTIFICATION API SPECIFICATION

## Authentication
Use the following header for endpoints that require authentication:
```
Authorization: Bearer <token>
```

> Note: `user_id` for creating user-based data (attendance, leave, overtime, visit, notification) is taken from the JWT (`req.userData.user_id`), **not** from the request body.

## Get All Notification (Testing/Admin)
- Endpoint : `/notification/admin`
- Method : `GET`
- Auth : (for testing purposes)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get All Notification Success",
  "notifications": [
    {
      "notification_id": 1,
      "user_id": 10,
      "notification_title": "Reminder",
      "notification_desc": "Jangan lupa absen",
      "is_read": false,
      "created_at": "2026-01-21T03:30:27.000Z",
      "updated_at": "2026-01-21T03:30:27.000Z"
    }
  ]
}
```

## Get Notification History (By User)
- Endpoint : `/notification/history/:id`
- Method : `GET`
- Auth : ✅
- Request Params :
  - `id` : user_id (number)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get History Notification Success",
  "notificationsHistory": [
    {
      "notification_id": 1,
      "user_id": 10,
      "notification_title": "Reminder",
      "notification_desc": "Jangan lupa absen",
      "is_read": false,
      "created_at": "2026-01-21T03:30:27.000Z",
      "updated_at": "2026-01-21T03:30:27.000Z"
    }
  ]
}
```

## Get Notification Detail
- Endpoint : `/notification/detail/:id`
- Method : `GET`
- Auth : ✅
- Request Params :
  - `id` : notification_id (number)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Notification Detail Success",
  "notificationDetail": {
    "notification_id": 1,
    "user_id": 10,
    "notification_title": "Reminder",
    "notification_desc": "Jangan lupa absen",
    "is_read": false,
    "created_at": "2026-01-21T03:30:27.000Z",
    "updated_at": "2026-01-21T03:30:27.000Z"
  }
}
```
- Response Error (Not found) :
```json
{
  "statusCode": 404,
  "message": "Notification Not Found"
}
```

## Create New Notification
- Endpoint : `/notification/add`
- Method : `POST`
- Auth : ✅
- Request Body :
```json
{
  "notification_title": "Reminder",
  "notification_desc": "Jangan lupa absen",
  "is_read": false
}
```
- Response Success :
```json
{
  "statusCode": 201,
  "message": "Create Notification Success",
  "notificationCreated": {
    "notification_id": 1,
    "user_id": 10,
    "notification_title": "Reminder",
    "notification_desc": "Jangan lupa absen",
    "is_read": false,
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

## Update Notification
- Endpoint : `/notification/update/:id`
- Method : `PATCH`
- Auth : ✅
- Request Params :
  - `id` : notification_id (number)
- Request Body (optional, send only fields to be updated):
```json
{
  "user_id": 10,
  "notification_title": "Reminder Update",
  "notification_desc": "Absen sekarang",
  "is_read": true
}
```
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Update Notification Success",
  "notificationUpdated": {
    "notification_id": 1,
    "user_id": 10,
    "notification_title": "Reminder Update",
    "notification_desc": "Absen sekarang",
    "is_read": true,
    "created_at": "2026-01-21T03:30:27.000Z",
    "updated_at": "2026-01-21T04:30:27.000Z"
  }
}
```
- Response Error (Not found) :
```json
{
  "statusCode": 404,
  "message": "Notification Not Found"
}
```

## Delete Notification
- Endpoint : `/notification/delete/:id`
- Method : `DELETE`
- Auth : ✅
- Request Params :
  - `id` : notification_id (number)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Delete Notification Success",
  "notificationId": 1
}
```
- Response Error (Not found) :
```json
{
  "statusCode": 404,
  "message": "Notification Not Found"
}
```
