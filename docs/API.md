# 📡 Vizhop REST API Documentation

Base URL (Local): `http://localhost:8000/api`  
Base URL (Production): `https://nasspht.onrender.com/api`

---

## 🔒 Authentication Headers

Protected endpoints require a JSON Web Token (JWT) sent in the HTTP Request Header:

```http
Authorization: Bearer <YOUR_JWT_TOKEN>
```

---

## 🟢 Health Check

### `GET /health`
- **Access**: Public
- **Description**: Verify server and API status.
- **Response `200 OK`**:
  ```json
  {
    "status": "OK",
    "message": "Vizhop API is running 🚀"
  }
  ```

---

## 🔑 Authentication Routes (`/auth`)

### `POST /auth/register`
- **Access**: Public
- **Description**: Create a new customer account.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123",
    "phone": "9876543210"
  }
  ```
- **Response `201 Created`**: Returns user details and JWT token.

### `POST /auth/login`
- **Access**: Public
- **Description**: Authenticate user and obtain token.
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
- **Response `200 OK`**: Returns user profile and authentication token.

### `GET /auth/profile`
- **Access**: Protected (User)
- **Description**: Fetch logged-in user profile details.

### `PUT /auth/profile`
- **Access**: Protected (User)
- **Description**: Update user profile information.

---

## 🛍️ Product Catalog Routes (`/products`)

### `GET /products`
- **Access**: Public
- **Description**: Get list of products with optional filtering, sorting, and pagination.
- **Query Parameters**:
  - `search` (string): Search by product name/description
  - `category` (string): Filter by category
  - `sort` (string): `price-asc`, `price-desc`, `rating`, `newest`
  - `page` (number): Default `1`
  - `limit` (number): Default `12`

### `GET /products/:id`
- **Access**: Public
- **Description**: Fetch detailed info for a single product.

### `POST /products`
- **Access**: Protected (Admin)
- **Description**: Create a new product.

### `PUT /products/:id`
- **Access**: Protected (Admin)
- **Description**: Update an existing product.

### `DELETE /products/:id`
- **Access**: Protected (Admin)
- **Description**: Delete a product by ID.

---

## 🛒 Cart Routes (`/cart`)

### `GET /cart`
- **Access**: Protected (User)
- **Description**: Fetch logged-in user's shopping cart.

### `POST /cart/add`
- **Access**: Protected (User)
- **Description**: Add item to cart.
- **Request Body**: `{"productId": "...", "quantity": 1}`

### `PUT /cart/item/:itemId`
- **Access**: Protected (User)
- **Description**: Update item quantity in cart.

### `DELETE /cart/item/:itemId`
- **Access**: Protected (User)
- **Description**: Remove an item from cart.

### `DELETE /cart/clear`
- **Access**: Protected (User)
- **Description**: Empty the entire shopping cart.

---

## 📦 Order Routes (`/orders`)

### `POST /orders`
- **Access**: Protected (User)
- **Description**: Place order from current cart.
- **Request Body**:
  ```json
  {
    "shippingAddress": {
      "address": "123 Main St",
      "city": "Metropolis",
      "postalCode": "10001",
      "country": "USA"
    },
    "paymentMethod": "Credit Card"
  }
  ```

### `GET /orders/my-orders`
- **Access**: Protected (User)
- **Description**: Fetch customer's personal order history.

### `GET /orders/:id`
- **Access**: Protected (User)
- **Description**: Fetch specific order by ID.

---

## ⚙️ Admin Routes (`/admin`)

### `GET /admin/dashboard`
- **Access**: Protected (Admin)
- **Description**: Get summary metrics (total sales, total revenue, user count, product count, recent orders).

### `GET /admin/users`
- **Access**: Protected (Admin)
- **Description**: List all registered users.

### `DELETE /admin/users/:id`
- **Access**: Protected (Admin)
- **Description**: Delete user account.

### `GET /admin/orders`
- **Access**: Protected (Admin)
- **Description**: List all orders across all customers.

### `PUT /admin/orders/:id/status`
- **Access**: Protected (Admin)
- **Description**: Update order processing status (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
