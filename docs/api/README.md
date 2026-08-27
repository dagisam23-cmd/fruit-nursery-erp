# API Documentation

## Overview

The Fruit Nursery ERP API is a RESTful API built with Express.js and TypeScript. It follows a microservices architecture with 10 core services.

## Base URL

```
http://localhost:3000/api/v1
```

## Authentication

All API endpoints (except `/auth/*`) require JWT authentication.

### Header Format

```
Authorization: Bearer {token}
```

## Core Endpoints

### Authentication Service

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "role": "NURSERY_MANAGER"
}

Response: 201
{
  "id": "uuid",
  "token": "jwt_token",
  "refreshToken": "refresh_token"
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}

Response: 200
{
  "token": "jwt_token",
  "refreshToken": "refresh_token",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "role": "NURSERY_MANAGER"
  }
}
```

### Nursery Service

#### Get All Batches
```
GET /nursery/batches?page=1&limit=20&status=in_progress&variety=Apple
Authorization: Bearer {token}

Response: 200
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

#### Create Batch
```
POST /nursery/batches
Authorization: Bearer {token}
Content-Type: application/json

{
  "batchNumber": "BATCH-2024-001",
  "seedSource": "Local Supplier",
  "supplier": "ABC Nursery",
  "collectionDate": "2024-01-15",
  "variety": "Apple - Gala",
  "parentMaterial": "Clone 45",
  "totalQuantity": 5000,
  "locationId": "uuid"
}

Response: 201
{
  "id": "uuid",
  "batchNumber": "BATCH-2024-001",
  ...
}
```

#### Get Batch Details with Stages
```
GET /nursery/batches/{batchId}
Authorization: Bearer {token}

Response: 200
{
  "id": "uuid",
  "batchNumber": "BATCH-2024-001",
  "stages": [
    {
      "id": "uuid",
      "stageNumber": 1,
      "stageName": "Seed Collection",
      "quantityEntered": 5000,
      "quantityPassed": 4950,
      "quantityLost": 50,
      "survivalRate": 99.0
    },
    ...
  ]
}
```

#### Get Production Pipeline Status
```
GET /nursery/production-pipeline
Authorization: Bearer {token}

Response: 200
[
  {
    "stage_number": 1,
    "stage_name": "Seed Collection",
    "total_entered": 50000,
    "total_passed": 48500,
    "total_lost": 1500,
    "avg_survival_rate": 97.0
  },
  ...
]
```

### Inventory Service

#### Get Inventory Items
```
GET /inventory/items?page=1&limit=20&itemType=SEEDS&search=Apple
Authorization: Bearer {token}

Response: 200
{
  "data": [
    {
      "id": "uuid",
      "itemType": "SEEDS",
      "itemName": "Apple Gala Seeds",
      "sku": "SKU-001",
      "quantity": 1000,
      "reorderLevel": 200,
      "totalValue": 5000.00,
      "expiryDate": "2025-12-31"
    }
  ],
  "pagination": {...}
}
```

#### Scan Barcode
```
POST /inventory/scan-barcode
Authorization: Bearer {token}
Content-Type: application/json

{
  "barcode": "8901234567890",
  "quantity": 10,
  "action": "add"
}

Response: 200
{
  "id": "uuid",
  "itemName": "Apple Gala Seeds",
  "quantity": 1010,
  "totalValue": 5050.00
}
```

#### Get Reorder Alerts
```
GET /inventory/reorder-alerts
Authorization: Bearer {token}

Response: 200
[
  {
    "id": "uuid",
    "itemName": "Fertilizer NPK",
    "quantity": 150,
    "reorderLevel": 200,
    "alertType": "LOW_STOCK"
  },
  {
    "id": "uuid",
    "itemName": "Pesticide ABC",
    "expiryDate": "2024-03-15",
    "alertType": "EXPIRY_WARNING"
  }
]
```

### CRM Service

#### Get Customers
```
GET /crm/customers?page=1&limit=20&customerType=FARMER&search=John
Authorization: Bearer {token}

Response: 200
{
  "data": [
    {
      "id": "uuid",
      "customerName": "John's Farm",
      "customerType": "FARMER",
      "phone": "+1234567890",
      "email": "john@farm.com",
      "creditLimit": 50000,
      "satisfactionRating": 4.5
    }
  ],
  "pagination": {...}
}
```

#### Create Order
```
POST /crm/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "orderNumber": "ORD-2024-001",
  "customerId": "uuid",
  "items": [
    {
      "batchId": "uuid",
      "quantity": 500,
      "unitPrice": 10.00,
      "totalPrice": 5000.00
    }
  ],
  "totalAmount": 5000.00
}

Response: 201
{
  "id": "uuid",
  "orderNumber": "ORD-2024-001",
  "status": "draft",
  ...
}
```

### Dashboard Service

#### Get KPIs
```
GET /dashboard/kpis
Authorization: Bearer {token}

Response: 200
{
  "totalSeedlings": 500000,
  "saleReadySeedlings": 250000,
  "productionCapacityUtilization": 75.5,
  "revenue": 1250000,
  "profitMargin": 35.2,
  "operatingCost": 812500,
  "inventoryValue": 500000,
  "customerSatisfactionIndex": 4.6,
  "complianceScore": 92.5,
  "employeeProductivityScore": 88.3,
  "nurseryHealthIndex": 89.7
}
```

#### Get Risk Predictions
```
GET /dashboard/risk-predictions
Authorization: Bearer {token}

Response: 200
[
  {
    "riskType": "STOCK_SHORTAGE",
    "probability": 0.65,
    "severity": "high",
    "affectedItems": ["Fertilizer NPK", "Pots 6 inch"],
    "recommendation": "Order 2000 units immediately"
  },
  {
    "riskType": "DISEASE_OUTBREAK",
    "probability": 0.25,
    "severity": "medium",
    "affectedBatches": ["BATCH-2024-001"],
    "recommendation": "Increase fungicide application"
  }
]
```

## Error Responses

### 400 Bad Request
```json
{
  "error": {
    "message": "Invalid input data",
    "status": 400,
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### 401 Unauthorized
```json
{
  "error": {
    "message": "Invalid or missing token",
    "status": 401
  }
}
```

### 403 Forbidden
```json
{
  "error": {
    "message": "Insufficient permissions",
    "status": 403
  }
}
```

### 404 Not Found
```json
{
  "error": {
    "message": "Resource not found",
    "status": 404
  }
}
```

### 500 Server Error
```json
{
  "error": {
    "message": "Internal server error",
    "status": 500
  }
}
```

## Rate Limiting

API requests are rate-limited to prevent abuse.

- **Default**: 100 requests per 15 minutes per IP
- **Headers**: 
  - `X-RateLimit-Limit`: Maximum requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Timestamp when limit resets

## Pagination

All list endpoints support pagination:

```
GET /endpoint?page=1&limit=20
```

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 500,
    "pages": 25
  }
}
```

## Sorting & Filtering

Supported query parameters vary by endpoint but commonly include:

```
GET /endpoint?sort=-createdAt&status=active&search=keyword
```

## Webhook Events

Supported webhook events for integrations:

- `batch.created`
- `batch.stage_updated`
- `order.created`
- `order.status_changed`
- `inventory.low_stock_alert`
- `inspection.completed`
- `disease.recorded`
- `employee.attendance_recorded`

## Rate Limits & Quotas

- **Free Tier**: 1,000 requests/day
- **Business**: 100,000 requests/day
- **Enterprise**: Unlimited

## Support

For API support, contact: api-support@fruiitnerseryyerp.com
