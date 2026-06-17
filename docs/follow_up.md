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
