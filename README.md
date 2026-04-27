# 🌟 GlowCart - Skincare E-commerce Platform

A full-stack e-commerce web application for skincare products with modern UI/UX and complete authentication system.

## 🚀 Features

### ✅ PHASE 1 - COMPLETE
- **Multi-page Navigation**: Landing page, Products, Login, Register, Cart
- **Responsive Design**: Mobile-friendly layout
- **Modern UI**: Clean, professional interface
- **Navigation System**: Seamless page transitions

### ✅ PHASE 2 - COMPLETE
- **Product Catalog**: 12+ skincare products
- **Dynamic Rendering**: Products loaded from JavaScript
- **Product Cards**: Image, name, price, category, add-to-cart button
- **Price Filter**: Range slider (₹0 - ₹5000)
- **Category Filter**: Face wash, Serum, Moisturizer, Sunscreen
- **Skin Type Filter**: Oily, Dry, Combination, Sensitive
- **Real-time Filtering**: Instant results on filter change

### 🔐 Authentication System
- User registration with validation
- Login system with "Remember Me"
- Password strength indicator
- JWT token-based authentication (mock)
- Protected routes (cart requires login)

### 🛒 Shopping Cart
- Add to cart (login required)
- Quantity adjustment
- Remove items
- Order summary with tax calculation
- Free shipping on orders above ₹499

## 📁 Project Structure

```
skincare-project/
├── index.html          # Landing page
├── products.html       # Product listing with filters
├── login.html          # User login
├── register.html       # User registration
├── cart.html           # Shopping cart
├── css/
│   ├── main.css        # Global styles
│   ├── products.css    # Product page styles
│   └── auth.css        # Auth pages styles
├── js/
│   ├── main.js         # Global functions & product data
│   ├── products.js     # Product filtering logic
│   └── auth.js         # Authentication logic
├── server.js           # Node.js backend server
└── package.json        # Dependencies
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Step 1: Install Dependencies
```bash
cd skincare-project
npm install
```

### Step 2: Start Backend Server
```bash
npm start
```

Server will run on: `http://localhost:5000`

### Step 3: Open Frontend
Open `index.html` in your browser or use Live Server extension in VS Code.

## 🔑 Test Credentials

**Default Admin Account:**
- Username: `admin`
- Password: `Admin@123`

## 🎯 How to Use

### For Users:
1. **Browse Products**: Visit the landing page and click "Shop Now"
2. **Filter Products**: Use price slider, category, and skin type filters
3. **Add to Cart**: Click "Add" button (requires login)
4. **Register**: Create a new account on the register page
5. **Login**: Use your credentials to access cart features
6. **Checkout**: View cart and proceed to checkout

### For Developers:
1. **Add Products**: Edit `products` array in `js/main.js`
2. **Modify Filters**: Update filter logic in `js/products.js`
3. **Change Styling**: Edit CSS files in `css/` folder
4. **Backend API**: Modify `server.js` for new endpoints

## 📡 API Endpoints

### Base URL: `http://localhost:5000`

| Method | Endpoint    | Description           | Body                                    |
|--------|-------------|-----------------------|-----------------------------------------|
| GET    | /           | Health check          | -                                       |
| POST   | /login      | User login            | `{ username, password }`                |
| POST   | /register   | User registration     | `{ fullname, email, username, password }` |
| GET    | /users      | Get all users (debug) | -                                       |

## 🎨 Design Features

- **Color Scheme**: Professional blue gradient
- **Typography**: Poppins font family
- **Animations**: Smooth transitions and hover effects
- **Icons**: BoxIcons library
- **Layout**: CSS Grid & Flexbox
- **Responsive**: Mobile-first approach

## 🔄 Next Steps (Future Phases)

### PHASE 3 - Login Gate ✅ (Already Implemented)
- [x] Detect logged-in state
- [x] Block cart without login
- [x] Redirect to login page

### PHASE 4 - Filters ✅ (Already Implemented)
- [x] Price range slider
- [x] Category filters
- [x] Skin type filters

### PHASE 5 - Cart System ✅ (Already Implemented)
- [x] Add to cart
- [x] Cart page
- [x] Quantity management
- [x] Total calculation

### PHASE 6 - Backend Upgrade (Upcoming)
- [ ] MongoDB/MySQL integration
- [ ] Real database models
- [ ] RESTful API structure
- [ ] Password hashing (bcrypt)

### PHASE 7 - Authentication (Upcoming)
- [ ] JWT token generation
- [ ] Protected API routes
- [ ] Token verification middleware

### PHASE 8 - UI Polish (Upcoming)
- [ ] Loading skeletons
- [ ] Better animations
- [ ] Toast notifications (✅ already added)
- [ ] Mobile responsiveness improvements

### PHASE 9 - Deployment (Upcoming)
- [ ] Frontend: Vercel/Netlify
- [ ] Backend: Render/Railway
- [ ] Environment variables
- [ ] Production build

## 🐛 Known Issues

- Server runs only locally (no deployment yet)
- No real database (using in-memory array)
- Passwords stored in plain text (needs hashing)
- No email verification
- No payment gateway integration

## 📝 Notes

- This is a **learning project** - not production-ready
- Designed for **placement preparation**
- Focus on **full-stack development** skills
- Demonstrates **modern web development** practices

## 🤝 Contributing

This is a personal learning project. Feel free to fork and modify for your own use.

## 📧 Contact

For questions or suggestions, reach out via email or GitHub.

## 📜 License

MIT License - Free to use for learning purposes

---