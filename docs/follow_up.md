# FOLLOW UP API SPECIFICATION

## Authentication
Use the following header for endpoints that require authentication:
```
Authorization: Bearer <token>
```

## Get All Follow Up
- Endpoint : `/follow-up/all`
- Method : `GET`
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get All Follow Up Success",
  "followUps": [
    {
      "follow_up_status": "CONTACTED",
      "follow_up_action": "WA customer untuk penawaran"
    }
  ]
}
```

## Add Follow Up
- Endpoint : `/follow-up/add`
- Method : `POST`
- Auth : ✅
- Request Body :
```json
{
  "visit_id": 1,
  "follow_up_status": "CONTACTED",
  "follow_up_action": "WA customer untuk penawaran"
}
```
- Response Success :
```json
{
  "statusCode": 201,
  "message": "Create Follow Up Success",
  "followUpCreated": {
    "visit_id": 1,
    "follow_up_status": "CONTACTED",
    "follow_up_action": "WA customer untuk penawaran"
  }
}
```

## Update Follow Up (PUT)
- Endpoint : `/follow-up/update/:followUpId`
- Method : `UPDATE`
- Auth : ✅
- Request Body :
```json
{
  "follow_up_status": "DONE",
  "follow_up_action": "WA customer done"
}
```
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Update Follow Up Success",
  "followUpUpdated": {
    "follow_up_status": "DONE",
    "follow_up_action": "WA customer done"
  }
}
```

## Delete Follow Up
- Endpoint : `/follow-up/delete/:followUpId`
- Method : `DELETE`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Delete Follow Up Success",
  "followUpId": 1
}
```

---

# VISIT FOLLOW UP

## Get Visit Follow Up
- Endpoint : `/follow-up/visit/:visitId`
- Method : `GET`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Visit Follow Up Success",
  "followUps": [
    {
      "follow_up_id": 1,
      "visit_id": 1,
      "follow_up_status": "CONTACTED",
      "follow_up_action": "WA customer untuk penawaran",
      "created_at": "2026-01-21T03:30:27.000Z",
      "updated_at": "2026-01-21T03:30:27.000Z"
    }
  ]
}
```

## Create Visit Follow Up
- Endpoint : `/follow-up/visit/:visitId`
- Method : `POST`
- Auth : ✅
- Request Body :
```json
{
  "follow_up_status": "CONTACTED",
  "follow_up_action": "WA customer untuk penawaran"
}
```
- Response Success :
```json
{
  "statusCode": 201,
  "message": "Create Follow Up Success",
  "followUp": {
    "follow_up_id": 1,
    "visit_id": 1,
    "follow_up_status": "CONTACTED",
    "follow_up_action": "WA customer untuk penawaran",
    "created_at": "2026-01-21T03:30:27.000Z",
    "updated_at": "2026-01-21T03:30:27.000Z"
  }
}
```

## Update Visit Follow Up
- Endpoint : `/follow-up/visit/:visitId/:followUpId`
- Method : `PATCH`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Update Follow Up Success",
  "followUp": {
    "follow_up_id": 1,
    "visit_id": 1,
    "follow_up_status": "DONE",
    "follow_up_action": "Customer sudah datang ke toko",
    "created_at": "2026-01-21T03:30:27.000Z",
    "updated_at": "2026-01-21T04:30:27.000Z"
  }
}
```

## Delete Visit Follow Up
- Endpoint : `/follow-up/visit/:visitId/:followUpId`
- Method : `DELETE`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Follow up deleted"
}
```
