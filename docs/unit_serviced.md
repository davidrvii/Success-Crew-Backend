# UNIT SERVICED API SPECIFICATION

## Authentication
Use the following header for endpoints that require authentication:
```
Authorization: Bearer <token>
```

## Get All Unit Serviced
- Endpoint : `/unit-serviced/all`
- Method : `GET`
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get All Unit Serviced Success",
  "units": [
    {
      "unit_serviced_name": "Laptop",
      "unit_serviced_issue": "keyboard rusak",
      "unit_serviced_action": "ganti keyboard",
      "unit_serviced_status": "SELESAI",
      "unit_serviced_desc": "Cleaning"
    }
  ]
}
```

## Add Unit Serviced
- Endpoint : `/unit-serviced/add`
- Method : `POST`
- Auth : ✅
- Request Body :
```json
{
  "visit_id": 1,
  "unit_serviced_name": "Laptop",
  "unit_serviced_issue": "keyboard rusak",
  "unit_serviced_action": "ganti keyboard",
  "unit_serviced_status": "SELESAI",
  "unit_serviced_desc": "Cleaning"
}
```
- Response Success :
```json
{
  "statusCode": 201,
  "message": "Create Unit Serviced Success",
  "unitServicedCreated": {
    "visit_id": 1,
    "unit_serviced_name": "Laptop",
    "unit_serviced_issue": "keyboard rusak",
    "unit_serviced_action": "ganti keyboard",
    "unit_serviced_status": "SELESAI",
    "unit_serviced_id_desc": "Cleaning",
    "unit_serviced_desc": "Cleaning"
  }
}
```

## Update Unit Serviced (PUT)
- Endpoint : `/unit-serviced/update/:unitServicedId`
- Method : `UPDATE`
- Auth : ✅
- Request Body :
```json
{
  "unit_serviced_name": "Laptop updated",
  "unit_serviced_issue": "keyboard dan lcd rusak",
  "unit_serviced_action": "ganti keyboard dan lcd",
  "unit_serviced_status": "SELESAI",
  "unit_serviced_desc": "Cleaning updated"
}
```
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Update Unit Serviced Success",
  "unitServicedUpdated": {
    "unit_serviced_name": "Laptop updated",
    "unit_serviced_issue": "keyboard dan lcd rusak",
    "unit_serviced_action": "ganti keyboard dan lcd",
    "unit_serviced_status": "SELESAI",
    "unit_serviced_id_desc": "Cleaning updated",
    "unit_serviced_desc": "Cleaning updated"
  }
}
```

## Delete Unit Serviced
- Endpoint : `/unit-serviced/delete/:unitServicedId`
- Method : `DELETE`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Delete Unit Serviced Success",
  "unitServicedId": 1
}
```

---

# VISIT UNIT SERVICED

## Get Visit Units Serviced
- Endpoint : `/unit-serviced/visit/:visitId`
- Method : `GET`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Visit Units Serviced Success",
  "units": [
    {
      "unit_serviced_id": 1,
      "visit_id": 1,
      "unit_serviced_name": "Laptop",
      "unit_serviced_issue": "keyboard rusak",
      "unit_serviced_action": "ganti keyboard",
      "unit_serviced_status": "SELESAI",
      "unit_serviced_desc": "Cleaning",
      "created_at": "2026-01-21T03:30:27.000Z",
      "updated_at": "2026-01-21T03:30:27.000Z"
    }
  ]
}
```

## Create Visit Unit Serviced
- Endpoint : `/unit-serviced/visit/:visitId`
- Method : `POST`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 201,
  "message": "Create Unit Serviced Success",
  "unitServiced": {
    "unit_serviced_id": 1,
    "visit_id": 1,
    "unit_serviced_name": "Laptop",
    "unit_serviced_issue": "keyboard rusak",
    "unit_serviced_action": "ganti keyboard",
    "unit_serviced_status": "SELESAI",
    "unit_serviced_desc": "Cleaning",
    "created_at": "2026-01-21T03:30:27.000Z",
    "updated_at": "2026-01-21T03:30:27.000Z"
  }
}
```

## Update Visit Unit Serviced
- Endpoint : `/unit-serviced/visit/:visitId/:unitServicedId`
- Method : `PATCH`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Update Unit Serviced Success",
  "unitServiced": {
    "unit_serviced_id": 1,
    "visit_id": 1,
    "unit_serviced_name": "Laptop",
    "unit_serviced_issue": "keyboard rusak",
    "unit_serviced_action": "ganti keyboard",
    "unit_serviced_status": "SELESAI",
    "unit_serviced_desc": "Install OS",
    "created_at": "2026-01-21T03:30:27.000Z",
    "updated_at": "2026-01-21T04:30:27.000Z"
  }
}
```

## Delete Visit Unit Serviced
- Endpoint : `/unit-serviced/visit/:visitId/:unitServicedId`
- Method : `DELETE`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Delete Unit Serviced Success",
  "unitServicedId": 1
}
```
