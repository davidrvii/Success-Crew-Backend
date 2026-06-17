# NOTIFICATION API SPECIFICATION

## Authentication
Use the following header for endpoints that require authentication:
```
Authorization: Bearer <token>
```

> Note: `user_id` for creating user-based data (attendance, leave, overtime, visit, notification) is taken from the JWT (`req.userData.user_id`), **not** from the request body unless specified.

## Get All Notification
- Endpoint : `/notification/all`
- Method : `GET`
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get All Notification Success",
  "notifications": [
    {
      "notification_id": 1,
      "notification_title": "Reminder",
      "notification_desc": "Jangan lupa absen",
      "is_read": false,
      "created_at": "2026-01-21T03:30:27.000Z"
    }
  ]
}
```

## Get Notification Basic
- Endpoint : `/notification/basic/:notificationId`
- Method : `GET`
- Auth : ✅
- Response Success (output: total notification unread) :
```json
{
  "statusCode": 200,
  "message": "Get Notification Basic Success",
  "notificationBasic": {
    "notification_id": 1,
    "is_read": false,
    "total_unread": 5
  }
}
```

## Get Notification History (By User) (Kept as per Rule 2)
- Endpoint : `/notification/history/:id`
- Method : `GET`
- Auth : ✅
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

## Get Notification Detail (Kept as per Rule 2)
- Endpoint : `/notification/detail/:id`
- Method : `GET`
- Auth : ✅
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

## Create New Notification
- Endpoint : `/notification/add`
- Method : `POST`
- Auth : ✅
- Request Body :
```json
{
  "user_id": 10,
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
    "user_id": 10,
    "notification_title": "Reminder",
    "notification_desc": "Jangan lupa absen",
    "is_read": false
  }
}
```

## Patch Notification Read Status
- Endpoint : `/notification/read/:id`
- Method : `PATCH`
- Auth : ✅
- Request Body (optional) :
```json
{
  "is_read": true
}
```
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Read Notification Success",
  "notificationRead": {
    "notification_id": 1,
    "is_read": true
  }
}
```

## Update Notification (PATCH) (Kept as per Rule 2)
- Endpoint : `/notification/update/:id`
- Method : `PATCH`
- Auth : ✅
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

## Update Notification (PUT)
- Endpoint : `/notification/update/:notificationId`
- Method : `UPDATE`
- Auth : ✅
- Request Body :
```json
{
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
    "notification_title": "Reminder Update",
    "notification_desc": "Absen sekarang",
    "is_read": true
  }
}
```

## Delete Notification
- Endpoint : `/notification/delete/:notificationId`
- Method : `DELETE`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Delete Notification Success",
  "notificationId": 1
}
```
