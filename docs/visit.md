# VISIT API SPECIFICATION

## Authentication
Use the following header for endpoints that require authentication:
```
Authorization: Bearer <token>
```

> Note: `user_id` for creating user-based data (attendance, leave, overtime, out_of_office, visit, notification) is taken from the JWT (`req.userData.user_id`), **not** from the request body unless specified.

---

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
      "visitor_category": "VIP",
      "visitor_company": "Perusahaan A",
      "visit_type": "WALK_IN",
      "visit_location": "bogor",
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

---

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
      "visit_location": "bogor",
      "visitor_category": "VIP",
      "visit_status": "NEW",
      "visit_sales": "Sales A",
      "created_at": "2026-06-17T03:30:27.000Z"
    }
  ]
}
```

---

## Visit - Get Visit Statistics (Semua Lokasi)
- Endpoint : `/visit/stats`
- Aliases : `/visit/count/daily`, `/visit/count/weekly`, `/visit/rushhour`
- Method : `GET`
- Request Query :
  - `range` (optional): `this_week` — filter data minggu ini (Senin s/d Sabtu). Jika tidak diisi, default 7 hari terakhir.
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
    "unit_serviced": 8,
    "product_sold": 15
  },
  "weeklyCount": [
    { "date": "2026-06-11", "total_visit": 12 },
    { "date": "2026-06-12", "total_visit": 15 },
    { "date": "2026-06-13", "total_visit": 8 },
    { "date": "2026-06-14", "total_visit": 14 },
    { "date": "2026-06-16", "total_visit": 18 },
    { "date": "2026-06-17", "total_visit": 25 }
  ],
  "productSoldWeekly": [
    { "date": "2026-06-11", "total_product_sold": 5 },
    { "date": "2026-06-12", "total_product_sold": 10 },
    { "date": "2026-06-13", "total_product_sold": 4 },
    { "date": "2026-06-14", "total_product_sold": 8 },
    { "date": "2026-06-16", "total_product_sold": 12 },
    { "date": "2026-06-17", "total_product_sold": 15 }
  ],
  "unitServiceWeekly": [
    { "date": "2026-06-11", "total_unit_service": 2 },
    { "date": "2026-06-12", "total_unit_service": 4 },
    { "date": "2026-06-13", "total_unit_service": 1 },
    { "date": "2026-06-14", "total_unit_service": 3 },
    { "date": "2026-06-16", "total_unit_service": 5 },
    { "date": "2026-06-17", "total_unit_service": 8 }
  ],
  "rushHour": [
    { "hour": "09:00", "total_visit": 5 },
    { "hour": "10:00", "total_visit": 8 },
    { "hour": "11:00", "total_visit": 12 },
    { "hour": "12:00", "total_visit": 4 },
    { "hour": "13:00", "total_visit": 6 },
    { "hour": "14:00", "total_visit": 10 },
    { "hour": "15:00", "total_visit": 15 },
    { "hour": "16:00", "total_visit": 9 }
  ]
}
```

---

## Visit - Get Visit Statistics - Bogor Store
- Endpoint : `/visit/stats/bogor`
- Method : `GET`
- Request Query :
  - `range` (optional): `this_week` — filters data to the current week (Monday to Saturday). If not specified, defaults to the last 7 days.
- Description : Returns visit statistics **only** for data where `visit_location = "bogor"` (case-insensitive). Response format is identical to `/visit/stats`.
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Visit Stats Bogor Success",
  "dailyCount": {
    "total_visit": 12,
    "call_in": 2,
    "chat_in": 5,
    "walk_in": 5,
    "unit_serviced": 4,
    "product_sold": 8
  },
  "weeklyCount": [
    { "date": "2026-06-11", "total_visit": 5 },
    { "date": "2026-06-12", "total_visit": 7 },
    { "date": "2026-06-13", "total_visit": 4 },
    { "date": "2026-06-14", "total_visit": 6 },
    { "date": "2026-06-16", "total_visit": 9 },
    { "date": "2026-06-17", "total_visit": 12 }
  ],
  "productSoldWeekly": [
    { "date": "2026-06-11", "total_product_sold": 2 },
    { "date": "2026-06-12", "total_product_sold": 4 },
    { "date": "2026-06-13", "total_product_sold": 2 },
    { "date": "2026-06-14", "total_product_sold": 3 },
    { "date": "2026-06-16", "total_product_sold": 6 },
    { "date": "2026-06-17", "total_product_sold": 8 }
  ],
  "unitServiceWeekly": [
    { "date": "2026-06-11", "total_unit_service": 1 },
    { "date": "2026-06-12", "total_unit_service": 2 },
    { "date": "2026-06-13", "total_unit_service": 0 },
    { "date": "2026-06-14", "total_unit_service": 1 },
    { "date": "2026-06-16", "total_unit_service": 2 },
    { "date": "2026-06-17", "total_unit_service": 4 }
  ],
  "rushHour": [
    { "hour": "09:00", "total_visit": 2 },
    { "hour": "10:00", "total_visit": 4 },
    { "hour": "11:00", "total_visit": 6 },
    { "hour": "12:00", "total_visit": 2 },
    { "hour": "13:00", "total_visit": 3 },
    { "hour": "14:00", "total_visit": 5 },
    { "hour": "15:00", "total_visit": 7 },
    { "hour": "16:00", "total_visit": 4 }
  ]
}
```

---

## Visit - Get Visit Statistics - Cibubur Store
- Endpoint : `/visit/stats/cibubur`
- Method : `GET`
- Request Query :
  - `range` (optional): `this_week` — filters data to the current week (Monday to Saturday). If not specified, defaults to the last 7 days.
- Description : Returns visit statistics **only** for data where `visit_location = "cibubur"` (case-insensitive). Response format is identical to `/visit/stats`.
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get Visit Stats Cibubur Success",
  "dailyCount": {
    "total_visit": 13,
    "call_in": 3,
    "chat_in": 5,
    "walk_in": 5,
    "unit_serviced": 4,
    "product_sold": 7
  },
  "weeklyCount": [
    { "date": "2026-06-11", "total_visit": 7 },
    { "date": "2026-06-12", "total_visit": 8 },
    { "date": "2026-06-13", "total_visit": 4 },
    { "date": "2026-06-14", "total_visit": 8 },
    { "date": "2026-06-16", "total_visit": 9 },
    { "date": "2026-06-17", "total_visit": 13 }
  ],
  "productSoldWeekly": [
    { "date": "2026-06-11", "total_product_sold": 3 },
    { "date": "2026-06-12", "total_product_sold": 6 },
    { "date": "2026-06-13", "total_product_sold": 2 },
    { "date": "2026-06-14", "total_product_sold": 5 },
    { "date": "2026-06-16", "total_product_sold": 6 },
    { "date": "2026-06-17", "total_product_sold": 7 }
  ],
  "unitServiceWeekly": [
    { "date": "2026-06-11", "total_unit_service": 1 },
    { "date": "2026-06-12", "total_unit_service": 2 },
    { "date": "2026-06-13", "total_unit_service": 1 },
    { "date": "2026-06-14", "total_unit_service": 2 },
    { "date": "2026-06-16", "total_unit_service": 3 },
    { "date": "2026-06-17", "total_unit_service": 4 }
  ],
  "rushHour": [
    { "hour": "09:00", "total_visit": 3 },
    { "hour": "10:00", "total_visit": 4 },
    { "hour": "11:00", "total_visit": 6 },
    { "hour": "12:00", "total_visit": 2 },
    { "hour": "13:00", "total_visit": 3 },
    { "hour": "14:00", "total_visit": 5 },
    { "hour": "15:00", "total_visit": 8 },
    { "hour": "16:00", "total_visit": 5 }
  ]
}
```

---

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
    "visit_location": "bogor",
    "created_at": "2026-06-17T03:30:27.000Z",
    "visit_interest": "Laptop gaming",
    "visit_status": "Follow Up",
    "visit_desc": "Ingin lihat stok dan promo",
    "visit_sales": "Sales A",
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
        "unit_serviced_desc": "Cleaning",
        "created_at": "2026-06-17T03:30:27.000Z"
      }
    ]
  }
}
```

---

## Visit - Create New Visit
- Endpoint : `/visit/add`
- Method : `POST`
- Auth : ✅
- Request Body :
```json
{
  "visitor_name": "John Doe",
  "visitor_phone": "08123456789",
  "visitor_category": "VIP",
  "visitor_company": "Perusahaan A",
  "visit_type": "WALK_IN",
  "visit_location": "bogor",
  "created_at": "2026-06-17T03:30:27.000Z",
  "visitor_interest": "Laptop gaming",
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
    "visit_location": "bogor",
    "visit_desc": "Mau tanya promo dan cicilan",
    "visit_sales": "Sales notes / name",
    "created_at": "2026-06-17T03:30:27.000Z",
    "updated_at": "2026-06-17T03:30:27.000Z"
  }
}
```

---

## Visit - Update Visit (PUT / PATCH)
- Endpoint : `/visit/update/:visitId`
- Method : `PUT` / `PATCH`
- Auth : ✅
- Request Body :
```json
{
  "visitor_name": "John Doe Updated",
  "visitor_phone": "08123456789",
  "visitor_category": "VIP",
  "visitor_company": "Perusahaan A",
  "visit_type": "WALK_IN",
  "visit_location": "cibubur",
  "created_at": "2026-06-17T03:30:27.000Z",
  "visitor_interest": "Laptop gaming",
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
    "visit_location": "cibubur",
    "visit_desc": "Mau tanya promo dan cicilan",
    "visit_sales": "Sales notes / name",
    "created_at": "2026-06-17T03:30:27.000Z",
    "updated_at": "2026-06-17T04:30:27.000Z"
  }
}
```

---

## Visit - Delete Visit
- Endpoint : `/visit/delete/:visitId`
- Method : `DELETE`
- Auth : ✅
- Request Params :
  - `visitId` : visit_id (number)
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Delete Visit Success",
  "visitId": 1
}
```
