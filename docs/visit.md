# VISIT API SPECIFICATION

## Authentication
Use the following header for endpoints that require authentication:
```
Authorization: Bearer <token>
```

> Note: `user_id` for creating user-based data (attendance, leave, overtime, visit, notification) is taken from the JWT (`req.userData.user_id`), **not** from the request body.

## Visit - Get All Visit (Testing/Admin)
- Endpoint : `/visit/admin`
- Method : `GET`
- Auth : (for testing purposes)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get All Visit Success",
  "visits": [
    {
      "visit_id": 1,
      "visitor_id": 5,
      "user_id": 10,
      "visitor_interest": "Laptop gaming",
      "visitor_status": "NEW",
      "created_at": "2026-01-21T03:30:27.000Z",
      "updated_at": "2026-01-21T03:30:27.000Z",
      "follow_up": [],
      "product_sold": [],
      "unit_serviced": []
    }
  ]
}
```
> This endpoint includes relations: `follow_up`, `product_sold`, `unit_serviced`.

## Visit - Get Visit Detail
- Endpoint : `/visit/detail/:id`
- Method : `GET`
- Auth : ✅
- Request Params :
  - `id` : visit_id (number)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Visit Detail Success",
  "visit": {
    "visit_id": 1,
    "visitor_id": 5,
    "user_id": 10,
    "visitor_interest": "Laptop gaming",
    "visitor_status": "NEW",
    "created_at": "2026-01-21T03:30:27.000Z",
    "updated_at": "2026-01-21T03:30:27.000Z",
    "follow_up": [],
    "product_sold": [],
    "unit_serviced": []
  }
}
```
- Response Error (Not found) :
```json
{
  "statusCode": 404,
  "message": "Visit Not Found"
}
```

## Visit - Create New Visit
- Endpoint : `/visit/add`
- Method : `POST`
- Auth : ✅
- Request Body :
```json
{
  "visitor_interest": "Laptop gaming",
  "visitor_status": "NEW"
}
```
- Required :
  - `visitor_interest`
  - `visitor_status`
- Response Success :
```json
{
  "statusCode": 201,
  "message": "Create Visit Success",
  "visit": {
    "visit_id": 1,
    "visitor_id": 5,
    "user_id": 10,
    "visitor_interest": "Laptop gaming",
    "visitor_status": "NEW",
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

## Visit - Update Visit
- Endpoint : `/visit/update/:id`
- Method : `PATCH`
- Auth : ✅
- Request Params :
  - `id` : visit_id (number)
- Request Body (optional, send only fields to be updated):
```json
{
  "visitor_id": 5,
  "user_id": 10,
  "visitor_interest": "Laptop untuk kerja",
  "visitor_status": "FOLLOW_UP"
}
```
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Update Visit Success",
  "visit": {
    "visit_id": 1,
    "visitor_id": 5,
    "user_id": 10,
    "visitor_interest": "Laptop untuk kerja",
    "visitor_status": "FOLLOW_UP",
    "created_at": "2026-01-21T03:30:27.000Z",
    "updated_at": "2026-01-21T04:30:27.000Z"
  }
}
```
- Response Error (Not found) :
```json
{
  "statusCode": 404,
  "message": "Visit Not Found"
}
```

## Visit - Delete Visit
- Endpoint : `/visit/delete/:id`
- Method : `DELETE`
- Auth : ✅
- Request Params :
  - `id` : visit_id (number)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Delete Visit Success",
  "visitId": 1
}
```
- Response Error (Not found) :
```json
{
  "statusCode": 404,
  "message": "Visit Not Found"
}
```
> Deleting a visit will also delete child data (`follow_up`, `product_sold`, `unit_serviced`) using a database transaction.

---

# FOLLOW UP (Nested in Visit)

## Get Visit Follow Up
- Endpoint : `/visit/:id/follow-up`
- Method : `GET`
- Auth : ✅
- Request Params :
  - `id` : visit_id (number)
- Request Body : -
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
- Endpoint : `/visit/:id/follow-up`
- Method : `POST`
- Auth : ✅
- Request Params :
  - `id` : visit_id (number)
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
- Response Error (Visit not found) :
```json
{
  "statusCode": 404,
  "message": "Visit Not Found"
}
```

## Update Visit Follow Up
- Endpoint : `/visit/:id/follow-up/:followUpId`
- Method : `PATCH`
- Auth : ✅
- Request Params :
  - `id` : visit_id (number)
  - `followUpId` : follow_up_id (number)
- Request Body (optional, send only fields to be updated):
```json
{
  "follow_up_status": "DONE",
  "follow_up_action": "Customer sudah datang ke toko"
}
```
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
- Response Error (Not found) :
```json
{
  "statusCode": 404,
  "message": "Follow Up Not Found"
}
```

## Delete Visit Follow Up
- Endpoint : `/visit/:id/follow-up/:followUpId`
- Method : `DELETE`
- Auth : ✅
- Request Params :
  - `id` : visit_id (number)
  - `followUpId` : follow_up_id (number)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Follow up deleted"
}
```

---

# PRODUCT SOLD (Nested in Visit)

## Get Visit Products Sold
- Endpoint : `/visit/:id/products-sold`
- Method : `GET`
- Auth : ✅
- Request Params :
  - `id` : visit_id (number)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Visit Products Sold Success",
  "products": [
    {
      "product_sold_id": 1,
      "visit_id": 1,
      "product_sold_type": "Laptop",
      "product_sold_category": "Gaming",
      "created_at": "2026-01-21T03:30:27.000Z",
      "updated_at": "2026-01-21T03:30:27.000Z"
    }
  ]
}
```

## Create Visit Product Sold
- Endpoint : `/visit/:id/products-sold`
- Method : `POST`
- Auth : ✅
- Request Params :
  - `id` : visit_id (number)
- Request Body :
```json
{
  "product_sold_type": "Laptop",
  "product_sold_category": "Gaming"
}
```
- Response Success :
```json
{
  "statusCode": 201,
  "message": "Create Product Sold Success",
  "productSold": {
    "product_sold_id": 1,
    "visit_id": 1,
    "product_sold_type": "Laptop",
    "product_sold_category": "Gaming",
    "created_at": "2026-01-21T03:30:27.000Z",
    "updated_at": "2026-01-21T03:30:27.000Z"
  }
}
```
- Response Error (Visit not found) :
```json
{
  "statusCode": 404,
  "message": "Visit Not Found"
}
```

## Update Visit Product Sold
- Endpoint : `/visit/:id/products-sold/:productSoldId`
- Method : `PATCH`
- Auth : ✅
- Request Params :
  - `id` : visit_id (number)
  - `productSoldId` : product_sold_id (number)
- Request Body (optional):
```json
{
  "product_sold_type": "PC",
  "product_sold_category": "Office"
}
```
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Update Product Sold Success",
  "productSold": {
    "product_sold_id": 1,
    "visit_id": 1,
    "product_sold_type": "PC",
    "product_sold_category": "Office",
    "created_at": "2026-01-21T03:30:27.000Z",
    "updated_at": "2026-01-21T04:30:27.000Z"
  }
}
```
- Response Error (Not found) :
```json
{
  "statusCode": 404,
  "message": "Product Sold Not Found"
}
```

## Delete Visit Product Sold
- Endpoint : `/visit/:id/products-sold/:productSoldId`
- Method : `DELETE`
- Auth : ✅
- Request Params :
  - `id` : visit_id (number)
  - `productSoldId` : product_sold_id (number)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Delete Product Sold Success",
  "productSoldId": 1
}
```
- Response Error (Not found) :
```json
{
  "statusCode": 404,
  "message": "Product Sold Not Found"
}
```

---

# UNIT SERVICED (Nested in Visit)

## Get Visit Units Serviced
- Endpoint : `/visit/:id/units-serviced`
- Method : `GET`
- Auth : ✅
- Request Params :
  - `id` : visit_id (number)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Visit Units Serviced Success",
  "units": [
    {
      "unit_serviced_id": 1,
      "visit_id": 1,
      "unit_serviced_type": "Laptop",
      "unit_serviced_category": "Cleaning",
      "created_at": "2026-01-21T03:30:27.000Z",
      "updated_at": "2026-01-21T03:30:27.000Z"
    }
  ]
}
```

## Create Visit Unit Serviced
- Endpoint : `/visit/:id/units-serviced`
- Method : `POST`
- Auth : ✅
- Request Params :
  - `id` : visit_id (number)
- Request Body :
```json
{
  "unit_serviced_type": "Laptop",
  "unit_serviced_category": "Cleaning"
}
```
- Response Success :
```json
{
  "statusCode": 201,
  "message": "Create Unit Serviced Success",
  "unitServiced": {
    "unit_serviced_id": 1,
    "visit_id": 1,
    "unit_serviced_type": "Laptop",
    "unit_serviced_category": "Cleaning",
    "created_at": "2026-01-21T03:30:27.000Z",
    "updated_at": "2026-01-21T03:30:27.000Z"
  }
}
```
- Response Error (Visit not found) :
```json
{
  "statusCode": 404,
  "message": "Visit Not Found"
}
```

## Update Visit Unit Serviced
- Endpoint : `/visit/:id/units-serviced/:unitServicedId`
- Method : `PATCH`
- Auth : ✅
- Request Params :
  - `id` : visit_id (number)
  - `unitServicedId` : unit_serviced_id (number)
- Request Body (optional):
```json
{
  "unit_serviced_type": "Laptop",
  "unit_serviced_category": "Install OS"
}
```
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Update Unit Serviced Success",
  "unitServiced": {
    "unit_serviced_id": 1,
    "visit_id": 1,
    "unit_serviced_type": "Laptop",
    "unit_serviced_category": "Install OS",
    "created_at": "2026-01-21T03:30:27.000Z",
    "updated_at": "2026-01-21T04:30:27.000Z"
  }
}
```
- Response Error (Not found) :
```json
{
  "statusCode": 404,
  "message": "Unit Serviced Not Found"
}
```

## Delete Visit Unit Serviced
- Endpoint : `/visit/:id/units-serviced/:unitServicedId`
- Method : `DELETE`
- Auth : ✅
- Request Params :
  - `id` : visit_id (number)
  - `unitServicedId` : unit_serviced_id (number)
- Request Body : -
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Delete Unit Serviced Success",
  "unitServicedId": 1
}
```
- Response Error (Not found) :
```json
{
  "statusCode": 404,
  "message": "Unit Serviced Not Found"
}
```
