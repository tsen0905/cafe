# Cafe Manager API Specification

Base URL: `http://localhost:3000/api`

## Response Format
**Success**:
```json
{
  "success": true,
  "data": { ... },
  "message": "OK"
}
```

**Error**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

## Endpoints

### Menu Items (`/menu-items`)

#### GET `/menu-items`
Get all menu items.
- **Response**: List of `MenuItem` objects.

#### POST `/menu-items`
Create a new menu item.
- **Body**:
  ```json
  {
    "name": "Latte",
    "category": "coffee",
    "price": 120,
    "description": "Milk coffee",
    "isAvailable": true
  }
  ```
- **Response**: Created `MenuItem`.

#### GET `/menu-items/:id`
Get specific menu item.

#### PUT `/menu-items/:id`
Update menu item.
- **Body**: Partial fields to update.

#### DELETE `/menu-items/:id`
Delete menu item.

---

### Orders (`/orders`)

#### GET `/orders`
Get all orders (newest first).

#### POST `/orders`
Create a new order.
- **Body**:
  ```json
  {
    "customerName": "Alice",
    "items": [
      { "menuItemId": "...", "name": "Latte", "price": 120, "qty": 1 }
    ],
    "note": "Less ice"
  }
  ```
- **Response**: Created `Order`.

#### GET `/orders/:id`
Get specific order.

#### PUT `/orders/:id`
Update order (e.g. status).
- **Body**:
  ```json
  { "status": "making" }
  ```
- **Response**: Updated `Order`.

#### DELETE `/orders/:id`
Delete order.
