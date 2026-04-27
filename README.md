🌿 SKINCARE E-COMMERCE WEB APPLICATION

🧠 PROJECT OVERVIEW

This project is a full-stack skincare e-commerce web application that allows users to:

Browse skincare products
Register and log in securely
Add products to cart
Access a personalized dashboard
Manage their account

It integrates frontend, backend, and database to simulate a real-world application.

🚀 FEATURES

🔐 Authentication

User Registration
User Login
Logout functionality
Delete account option
Form validation with feedback

🛍️ Product System

Product listing page
Dynamic product rendering
Product categories
Image handling

🛒 Cart System

Add to cart
Remove from cart
Quantity handling
Cart persistence

👤 User Dashboard

Post-login redirection
User-specific interface
Navigation system

⚙️ Backend

REST API using Node.js & Express
Authentication handling
Database integration
User data management

🎨 UI/UX

Responsive layout
Modular CSS design
Password strength indicator
Toast notifications
Smooth animations

🧱 PROJECT STRUCTURE

LOGIN_PAGE/

├── frontend/
│   ├── Skin_Care/
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── products.html
│   │   ├── cart.html
│   │   ├── dashboard.html
│   │
│   ├── CSS/
│   │   ├── main.css
│   │   ├── auth.css
│   │   ├── product.css
│   │
│   ├── JS/
│   │   └── script.js
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── database/
│
├── .gitignore
├── package.json
├── README.md

⚙️ TECHNOLOGIES USED

🖥️ Frontend

HTML5
CSS3 (modular styling)
JavaScript

🛠️ Backend

Node.js
Express.js

🗄️ Database

Database system for storing user and application data

🔧 Tools

Git & GitHub
Cursor / VS Code

🔄 DEVELOPMENT WORKFLOW

Designed responsive UI using HTML and CSS
Modularized styling into multiple CSS files
Implemented frontend logic using JavaScript
Added form validation and password strength feature
Built cart functionality
Developed backend server using Express
Created authentication APIs
Integrated database for storing user data
Connected frontend and backend using fetch API
Added multiple pages and navigation
Improved UI/UX and user interaction
Structured project into frontend and backend
Managed version control using Git
Cleaned repository using .gitignore

💡 HOW IT WORKS

User opens the application
Products are visible without login
Login required for full access
After login → redirected to dashboard
User can:
Browse products
Add items to cart
Manage account

✨ HIGHLIGHTS

Full-stack implementation
Authentication system
Functional cart system
Modular structure
Clean UI design
API-based communication
Proper Git workflow

🔐 SECURITY PRACTICES

.env used for sensitive data
.gitignore configured
Basic input validation

⚙️ SETUP INSTRUCTIONS

1️⃣ Clone Repository
git clone https://github.com/Asutosh-Mohanty/LOGIN_PAGE.git
cd LOGIN_PAGE

2️⃣ Install Dependencies
npm install

3️⃣ Setup Environment Variables

Create .env file:

PORT=5000
MONGO_URI=your_database_url
JWT_SECRET=your_secret

4️⃣ Run Server
node server.js

5️⃣ Run Frontend
Open HTML files
OR
Use Live Server

🔮 FUTURE SCOPE

JWT authentication
Backend-based cart system
Payment integration
Product filters & search
React frontend
Cloud deployment

🏁 CONCLUSION

This project demonstrates:

Full-stack development
Backend integration
Authentication handling
Project structuring
Git usage

It serves as a strong base for scalable web applications.

💬 Final Touch

Now your README:

looks clean ✅
visually strong ✅
recruiter-friendly ✅