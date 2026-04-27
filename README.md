# GlowCart - Local Production-Style Full Stack App

This project is now upgraded to a local, placement-ready architecture with:

- JWT authentication
- bcrypt password hashing
- route protection middleware
- SQLite database for users/products/cart/orders
- API-driven frontend (no hardcoded product list)
- product search/filter/sort/pagination
- backend cart + checkout + order history
- profile update + change password
- admin product CRUD (role-based)

## Project Structure

```text
Login_Page/
  backend/
    src/
      config/ db setup
      controllers/ auth, user, product, cart, order
      middleware/ auth + error
      models/ db query modules
      routes/ modular API routes
      utils/ token + seed
      app.js
      server.js
    data/glowcart.sqlite
    public/images/placeholder.svg
    .env
  frontend/
    assets/css/styles.css
    assets/js/app.js
    index.html
    products.html
    product.html
    cart.html
    checkout.html
    orders.html
    profile.html
    login.html
    register.html
    admin.html
```

## Local Run Steps

1. Start backend:

```bash
cd backend
npm install
npm start
```

2. Open frontend in browser:

- [http://localhost:5000/app/index.html](http://localhost:5000/app/index.html)

## Default Admin

- username: `admin`
- password: `Admin@123`

## Main API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/users/profile`
- `PATCH /api/users/change-password`
- `GET /api/products`
- `GET /api/products/:id`
- `POST|PUT|DELETE /api/products` (admin)
- `GET /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/:productId`
- `DELETE /api/cart/items/:productId`
- `GET /api/orders`
- `POST /api/orders`

## Notes

- This setup is fully local and does not include deployment.
- Product images are served from backend static folder (`/images`).