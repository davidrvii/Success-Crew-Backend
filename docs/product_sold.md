# PRODUCT SOLD API SPECIFICATION

## Authentication
Use the following header for endpoints that require authentication:
```
Authorization: Bearer <token>
```

## Get All Product Sold
- Endpoint : `/product-sold/all`
- Method : `GET`
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Get All Product Sold Success",
  "products": [
    {
      "product_sold_name": "Laptop",
      "product_sold_quantity": 1,
      "product_sold_total": 15000000,
      "product_sold_desc": "Gaming"
    }
  ]
}
```

## Add Product Sold
- Endpoint : `/product-sold/add`
- Method : `POST`
- Auth : ✅
- Request Body :
```json
{
  "visit_id": 1,
  "product_sold_name": "Laptop",
  "product_sold_quantity": 1,
  "product_sold_total": 15000000,
  "product_sold_desc": "Gaming"
}
```
- Response Success :
```json
{
  "statusCode": 201,
  "message": "Create Product Sold Success",
  "productSoldCreated": {
    "visit_id": 1,
    "product_sold_name": "Laptop",
    "product_sold_quantity": 1,
    "product_sold_total": 15000000,
    "product_sold_desc": "Gaming"
  }
}
```

## Update Product Sold (PUT)
- Endpoint : `/product-sold/update/:productSoldId`
- Method : `UPDATE`
- Auth : ✅
- Request Body :
```json
{
  "product_sold_name": "Laptop updated",
  "product_sold_quantity": 2,
  "product_sold_total": 30000000,
  "product_sold_desc": "Gaming updated"
}
```
- Response Success :
```json
{
  "statusCode": 200,
  "message": "Update Product Sold Success",
  "productSoldUpdated": {
    "product_sold_name": "Laptop updated",
    "product_sold_quantity": 2,
    "product_sold_total": 30000000,
    "product_sold_desc": "Gaming updated"
  }
}
```

## Delete Product Sold
- Endpoint : `/product-sold/delete/:productSoldId`
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

# VISIT PRODUCT SOLD

## Get Visit Products Sold
- Endpoint : `/product-sold/visit/:visitId`
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
- Endpoint : `/product-sold/visit/:visitId`
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
- Endpoint : `/product-sold/visit/:visitId/:productSoldId`
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
- Endpoint : `/product-sold/visit/:visitId/:productSoldId`
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
