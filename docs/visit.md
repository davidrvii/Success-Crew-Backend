# VISIT API SPECIFICATION

## Authentication
Use the following header for endpoints that require authentication:
```
Authorization: Bearer <token>
```

> Note: `user_id` for creating user-based data (attendance, leave, overtime, out_of_office, visit, notification) is taken from the JWT (`req.userData.user_id`), **not** from the request body unless specified.

## Visit - Get All Visit
- Endpoint : `/visit/all`
- Method : `GET`
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get All Visit Success",
  "visits": [
    {
      "visitor_name": "John Doe",
      "visitor_phone": "08123456789",
      "visitory_category": "VIP",
      "visitor_company": "Perusahaan A",
      "visit_type": "WALK_IN",
      "created_at": "2026-06-17T03:30:27.000Z",
      "interest": "Laptop gaming",
      "visit_status": "NEW",
      "visit_desc": "Ingin lihat stok dan promo",
      "visit_sales": "Sales notes / name",
      "user_id": 10
    }
  ]
}
```

## Visit - Get Visit List
- Endpoint : `/visit/list`
- Method : `GET`
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Visit List Success",
  "visitList": [
    {
      "visit_id": 1,
      "visitor_name": "John Doe",
      "visitor_interest": "Laptop gaming",
      "visit_type": "WALK_IN",
      "visitor_category": "VIP",
      "visit_status": "NEW",
      "created_at": "2026-06-17T03:30:27.000Z"
    }
  ]
}
```

## Visit - Get Visit Statistics
- Endpoint : `/visit/stats` (Aliases: `/visit/count/daily`, `/visit/count/weekly`, `/visit/rushhour`)
- Method : `GET`
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Visit Stats Success",
  "dailyCount": {
    "total_visit": 25,
    "call_in": 5,
    "chat_in": 10,
    "walk_in": 10,
    "total_unit_service": 8,
    "total_product_sold": 15
  },
  "weeklyCount": [
    {
      "date": "2026-06-11",
      "total_visit": 12
    },
    {
      "date": "2026-06-12",
      "total_visit": 15
    },
    {
      "date": "2026-06-13",
      "total_visit": 8
    },
    {
      "date": "2026-06-14",
      "total_visit": 20
    },
    {
      "date": "2026-06-15",
      "total_visit": 14
    },
    {
      "date": "2026-06-16",
      "total_visit": 18
    },
    {
      "date": "2026-06-17",
      "total_visit": 25
    }
  ],
  "rushHour": [
    {
      "hour": "09:00",
      "total_visit": 5
    },
    {
      "hour": "10:00",
      "total_visit": 8
    },
    {
      "hour": "11:00",
      "total_visit": 12
    },
    {
      "hour": "12:00",
      "total_visit": 4
    },
    {
      "hour": "13:00",
      "total_visit": 6
    },
    {
      "hour": "14:00",
      "total_visit": 10
    },
    {
      "hour": "15:00",
      "total_visit": 15
    },
    {
      "hour": "16:00",
      "total_visit": 9
    },
    {
      "hour": "17:00",
      "total_visit": 7
    }
  ]
}
```

## Visit - Get Visit Detail
- Endpoint : `/visit/detail/:visitId`
- Method : `GET`
- Auth : ✅
- Request Params :
  - `visitId` : visit_id (number)
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Visit Detail Success",
  "visit": {
    "visit_id": 1,
    "visitor_id": 5,
    "visitor_name": "John Doe",
    "visitor_phone": "08123456789",
    "visitor_category": "VIP",
    "visitor_company": "Perusahaan A",
    "visit_type": "WALK_IN",
    "created_at": "2026-06-17T03:30:27.000Z",
    "visit_interest": "Laptop gaming",
    "visit_status": "Follow Up",
    "visit_desc": "Ingin lihat stok dan promo",
    "user_name": "Sales A",
    "Follow UP": [
      {
        "follow_up_id": 1,
        "follow_up_status": "CONTACTED",
        "follow_up_action": "WA customer untuk penawaran",
        "created_at": "2026-06-17T03:30:27.000Z"
      }
    ],
    "Product Sold": [
      {
        "product_sold_id": 1,
        "product_sold_name": "Laptop",
        "product_sold_quantity": 1,
        "product_sold_total": 15000000,
        "product_sold_desc": "Gaming",
        "created_at": "2026-06-17T03:30:27.000Z"
      }
    ],
    "Unit Serviced": [
      {
        "unit_serviced_id": 1,
        "unit_serviced_name": "Laptop",
        "unit_serviced_issue": "keyboard rusak",
        "unit_serviced_action": "ganti keyboard",
        "unit_serviced_status": "SELESAI",
        "unit_serviced_id_desc": "Cleaning",
        "unit_serviced_desc": "Cleaning",
        "created_at": "2026-06-17T03:30:27.000Z"
      }
    ]
  }
}
```

## Visit - Create New Visit
- Endpoint : `/visit/add`
- Method : `POST`
- Auth : ✅
- Request Body :
```json
{
  "visitor_name": "John Doe",
  "visitor_phone": "08123456789",
  "visitory_category": "VIP",
  "visitor_company": "Perusahaan A",
  "visit_type": "WALK_IN",
  "created_at": "2026-06-17T03:30:27.000Z",
  "interest": "Laptop gaming",
  "visit_status": "NEW",
  "visit_desc": "Mau tanya promo dan cicilan",
  "visit_sales": "Sales notes / name",
  "user_id": 10
}
```
- Response Success :
```json
{
  "statusCode": 201,
  "message": "Create Visit Success",
  "visitCreated": {
    "visit_id": 1,
    "visitor_id": 5,
    "user_id": 10,
    "visitor_interest": "Laptop gaming",
    "visit_status": "NEW",
    "visit_type": "WALK_IN",
    "visit_desc": "Mau tanya promo dan cicilan",
    "visit_sales": "Sales notes / name",
    "created_at": "2026-06-17T03:30:27.000Z",
    "updated_at": "2026-06-17T03:30:27.000Z"
  }
}
```

## Visit - Update Visit (PUT)
- Endpoint : `/visit/update/:visitId`
- Method : `UPDATE`
- Auth : ✅
- Request Body :
```json
{
  "visitor_name": "John Doe Updated",
  "visitor_phone": "08123456789",
  "visitory_category": "VIP",
  "visitor_company": "Perusahaan A",
  "visit_type": "WALK_IN",
  "created_at": "2026-06-17T03:30:27.000Z",
  "interest": "Laptop gaming",
  "visit_status": "Follow Up",
  "visit_desc": "Mau tanya promo dan cicilan",
  "visit_sales": "Sales notes / name",
  "user_id": 10
}
```
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Update Visit Success",
  "visitUpdated": {
    "visit_id": 1,
    "visitor_id": 5,
    "user_id": 10,
    "visitor_interest": "Laptop gaming",
    "visit_status": "Follow Up",
    "visit_type": "WALK_IN",
    "visit_desc": "Mau tanya promo dan cicilan",
    "visit_sales": "Sales notes / name",
    "created_at": "2026-06-17T03:30:27.000Z",
    "updated_at": "2026-06-17T04:30:27.000Z"
  }
}
```

## Visit - Delete Visit
- Endpoint : `/visit/delete/:visitId`
- Method : `DELETE`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Delete Visit Success",
  "visitId": 1
}
```

---

# FOLLOW UP (Nested in Visit) (Kept as per Rule 2)

## Get Visit Follow Up
- Endpoint : `/visit/:id/follow-up`
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
- Endpoint : `/visit/:id/follow-up`
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
- Endpoint : `/visit/:id/follow-up/:followUpId`
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
- Endpoint : `/visit/:id/follow-up/:followUpId`
- Method : `DELETE`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Follow up deleted"
}
```

---

# PRODUCT SOLD (Nested in Visit) (Kept as per Rule 2)

## Get Visit Products Sold
- Endpoint : `/visit/:id/products-sold`
- Method : `GET`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Visit Products Sold Success",
  "products": [
    {
      "product_sold_id": 1,
      "visit_id": 1,
      "product_sold_name": "Laptop",
      "product_sold_quantity": 1,
      "product_sold_total": 15000000,
      "product_sold_desc": "Gaming",
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
- Response Success :
```json
{
  "statusCode": 201,
  "message": "Create Product Sold Success",
  "productSold": {
    "product_sold_id": 1,
    "visit_id": 1,
    "product_sold_name": "Laptop",
    "product_sold_quantity": 1,
    "product_sold_total": 15000000,
    "product_sold_desc": "Gaming",
    "created_at": "2026-01-21T03:30:27.000Z",
    "updated_at": "2026-01-21T03:30:27.000Z"
  }
}
```

## Update Visit Product Sold
- Endpoint : `/visit/:id/products-sold/:productSoldId`
- Method : `PATCH`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Update Product Sold Success",
  "productSold": {
    "product_sold_id": 1,
    "visit_id": 1,
    "product_sold_name": "PC",
    "product_sold_quantity": 1,
    "product_sold_total": 12000000,
    "product_sold_desc": "Office",
    "created_at": "2026-01-21T03:30:27.000Z",
    "updated_at": "2026-01-21T04:30:27.000Z"
  }
}
```

## Delete Visit Product Sold
- Endpoint : `/visit/:id/products-sold/:productSoldId`
- Method : `DELETE`
- Auth : ✅
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Delete Product Sold Success",
  "productSoldId": 1
}
```

---

# UNIT SERVICED (Nested in Visit) (Kept as per Rule 2)

## Get Visit Units Serviced
- Endpoint : `/visit/:id/units-serviced`
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
- Endpoint : `/visit/:id/units-serviced`
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
- Endpoint : `/visit/:id/units-serviced/:unitServicedId`
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
- Endpoint : `/visit/:id/units-serviced/:unitServicedId`
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
