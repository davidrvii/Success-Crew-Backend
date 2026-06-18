# VISITOR API SPECIFICATION

## Authentication
Use the following header for endpoints that require authentication:
```
Authorization: Bearer <token>
```

## Get All Visitor
- Endpoint : `/visitor/all`
- Method : `GET`
- Auth : ❌
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get All Visitor Success",
  "visitors": [
    {
      "visitor_id": 1,
      "visitor_name": "John Doe",
      "visitor_phone": "08123456789",
      "visitor_category": "VIP",
      "visitor_company": "Perusahaan A"
    }
  ]
}
```

## Get Visitor Detail
- Endpoint : `/visitor/detail/:id`
- Method : `GET`
- Auth : ✅
- Request Params :
  - `id` : visitor_id (number)
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Visitor Detail Success",
  "visitor": {
    "visitor_id": 1,
    "visitor_name": "John Doe",
    "visitor_phone": "08123456789",
    "visitor_company": "Perusahaan A",
    "visitor_category": "VIP",
    "created_at": "2026-06-18T03:01:36.000Z",
    "updated_at": "2026-06-18T03:01:36.000Z",
    "visit": [
      {
        "visit_id": 1,
        "user_id": 10,
        "visitor_id": 1,
        "visitor_interest": "Laptop Gaming",
        "visit_status": "NEW",
        "visit_type": "WALK_IN",
        "visit_desc": "Ingin lihat stok dan promo",
        "visit_sales": "Sales notes",
        "created_at": "2026-06-18T03:01:36.000Z",
        "updated_at": "2026-06-18T03:01:36.000Z"
      }
    ]
  }
}
```

## Add Visitor
- Endpoint : `/visitor/add`
- Method : `POST`
- Auth : ✅
- Request Body :
```json
{
  "visitor_name": "John Doe",
  "visitor_phone": "08123456789",
  "visitor_company": "Perusahaan A",
  "visitor_category": "VIP"
}
```
- Response Success :
```json
{
  "statusCode": 201,
  "message": "Create Visitor Success",
  "visitor": {
    "visitor_id": 1,
    "visitor_name": "John Doe",
    "visitor_phone": "08123456789",
    "visitor_company": "Perusahaan A",
    "visitor_category": "VIP",
    "created_at": "2026-06-18T03:01:36.000Z",
    "updated_at": "2026-06-18T03:01:36.000Z"
  }
}
```

## Update Visitor (PUT)
- Endpoint : `/visitor/update/:visitorId`
- Method : `PUT`
- Auth : ✅
- Request Body :
```json
{
  "visitor_name": "John Doe Updated",
  "visitor_phone": "08123456789",
  "visitor_company": "Perusahaan A Updated",
  "visitor_category": "VIP"
}
```
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Update Visitor Success",
  "visitorUpdated": {
    "visitor_id": 1,
    "visitor_name": "John Doe Updated",
    "visitor_phone": "08123456789",
    "visitor_category": "VIP",
    "visitor_company": "Perusahaan A Updated"
  }
}
```

## Delete Visitor
- Endpoint : `/visitor/delete/:visitorId`
- Method : `DELETE`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Delete Visitor Success",
  "visitorId": 1
}
```
