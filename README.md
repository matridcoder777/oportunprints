# Oportun Retail Print Portal

A full-stack web application for ordering branded print materials at Oportun retail store locations. Authorized staff can browse products, manage a shopping cart, submit orders for approval, and track order history — all from a clean, dark-themed responsive interface.

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, TypeScript, Vite          |
| Routing   | React Router v6                     |
| HTTP      | Axios                               |
| Backend   | Node.js, Express                    |
| Data      | In-memory mock data (no DB needed)  |
| Dev tools | concurrently, node --watch          |

---

## Prerequisites

- **Node.js 18+** (includes npm 9+)

---

## Installation & Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd oportunprints

# 2. Install all dependencies (root + server + client)
npm run install:all
```

---

## Running in Development

```bash
# Start both server and client concurrently
npm run dev

# Or run them individually:
npm run dev:server   # API on http://localhost:3001
npm run dev:client   # UI  on http://localhost:5173
```

The Vite dev server proxies all `/api` requests to the Express backend, so no CORS issues during development.

---

## API Endpoints

### Auth
| Method | Path           | Description                          |
|--------|----------------|--------------------------------------|
| POST   | /api/auth/login | Authenticate and receive JWT token  |
| GET    | /api/auth/me    | Get current authenticated user      |

### Users
| Method | Path             | Description          |
|--------|------------------|----------------------|
| GET    | /api/users       | List all users       |
| POST   | /api/users       | Create a user        |
| PUT    | /api/users/:id   | Update a user        |
| DELETE | /api/users/:id   | Delete a user        |

### Stores
| Method | Path              | Description          |
|--------|-------------------|----------------------|
| GET    | /api/stores       | List all stores      |
| POST   | /api/stores       | Create a store       |
| PUT    | /api/stores/:id   | Update a store       |
| DELETE | /api/stores/:id   | Delete a store       |

### Products
| Method | Path                | Description           |
|--------|---------------------|-----------------------|
| GET    | /api/products       | List / search products|
| POST   | /api/products       | Create a product      |
| PUT    | /api/products/:id   | Update a product      |
| DELETE | /api/products/:id   | Delete a product      |

### Cart
| Method | Path                      | Description                   |
|--------|---------------------------|-------------------------------|
| GET    | /api/cart                 | Get current user's cart       |
| POST   | /api/cart/items           | Add item to cart              |
| PUT    | /api/cart/items/:productId| Update item quantity          |
| DELETE | /api/cart/items/:productId| Remove item from cart         |
| DELETE | /api/cart                 | Clear entire cart             |

### Orders
| Method | Path                       | Description                  |
|--------|----------------------------|------------------------------|
| GET    | /api/orders                | List orders (filterable)     |
| POST   | /api/orders                | Place a new order            |
| PUT    | /api/orders/:id/status     | Update order status (admin)  |

---

## Project Structure

```
oportunprints/
├── package.json              # Root workspace scripts
├── .gitignore
├── README.md
├── server/                   # Express backend
│   ├── package.json
│   └── src/
│       ├── index.js          # App entry point
│       ├── data/
│       │   └── store.js      # In-memory data store
│       └── routes/
│           ├── auth.js
│           ├── users.js
│           ├── stores.js
│           ├── products.js
│           ├── orders.js
│           └── cart.js
└── client/                   # React + TypeScript frontend
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── i18n.ts           # i18next config (EN + ES stub)
        ├── api/
        │   └── client.ts     # Axios instance with Bearer token interceptor
        ├── types/
        │   └── index.ts      # TypeScript interfaces
        ├── context/
        │   ├── AuthContext.tsx
        │   └── CartContext.tsx
        ├── components/
        │   ├── Navbar.tsx
        │   ├── ProductCard.tsx
        │   ├── Filters.tsx
        │   └── OrderTable.tsx
        └── pages/
            ├── Login.tsx
            ├── Dashboard.tsx
            ├── Products.tsx
            ├── Cart.tsx
            ├── Orders.tsx
            ├── AdminPanel.tsx
            ├── Support.tsx
            ├── StoreProfile.tsx
            └── NotFound.tsx
```
