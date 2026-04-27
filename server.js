const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (will be replaced with real DB later)
const users = [
    { 
        id: 1,
        fullname: "Admin User",
        email: "admin@glowcart.com",
        username: "admin", 
        password: "Admin@123" // In production, this should be hashed
    }
];

// ========== ROUTES ==========

// Health check
app.get("/", (req, res) => {
    res.json({ 
        message: "GlowCart API Server Running",
        version: "1.0.0",
        endpoints: ["/login", "/register"]
    });
});

// Login endpoint
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
        return res.status(400).json({ 
            success: false, 
            message: "Username and password are required" 
        });
    }

    // Find user
    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (user) {
        // Generate simple token (in production, use JWT)
        const token = `token_${user.id}_${Date.now()}`;
        
        res.json({ 
            success: true, 
            message: "Login successful!",
            token: token,
            user: {
                id: user.id,
                username: user.username,
                fullname: user.fullname,
                email: user.email
            }
        });
    } else {
        res.status(401).json({ 
            success: false, 
            message: "Invalid username or password" 
        });
    }
});

// Register endpoint
app.post("/register", (req, res) => {
    const { fullname, email, username, password } = req.body;

    // Validation
    if (!fullname || !email || !username || !password) {
        return res.status(400).json({ 
            success: false, 
            message: "All fields are required" 
        });
    }

    // Check if username already exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(409).json({ 
            success: false, 
            message: "Username already exists" 
        });
    }

    // Check if email already exists
    const existingEmail = users.find(u => u.email === email);
    if (existingEmail) {
        return res.status(409).json({ 
            success: false, 
            message: "Email already registered" 
        });
    }

    // Create new user
    const newUser = {
        id: users.length + 1,
        fullname,
        email,
        username,
        password // In production, hash this password
    };

    users.push(newUser);

    res.status(201).json({ 
        success: true, 
        message: "Account created successfully! Please login.",
        user: {
            id: newUser.id,
            username: newUser.username,
            fullname: newUser.fullname,
            email: newUser.email
        }
    });
});

// Get all users (for debugging only - remove in production)
app.get("/users", (req, res) => {
    res.json({ 
        count: users.length,
        users: users.map(u => ({ id: u.id, username: u.username, email: u.email }))
    });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════╗
║     🌟 GLOWCART API SERVER 🌟       ║
╚══════════════════════════════════════╝

✅ Server running on: http://localhost:${PORT}
✅ CORS enabled
✅ Endpoints available:
   - GET  /           (Health check)
   - POST /login      (User login)
   - POST /register   (User registration)
   - GET  /users      (Debug only)

📝 Test credentials:
   Username: admin
   Password: Admin@123

Ready to accept requests! 🚀
    `);
});