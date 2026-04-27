const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// File-based user storage (persistent across restarts)
const dataDir = path.join(__dirname, "data");
const usersFile = path.join(dataDir, "users.json");

function ensureUsersFile() {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(usersFile)) {
        const seedUsers = [
            {
                id: 1,
                fullname: "Admin User",
                email: "admin@glowcart.com",
                username: "admin",
                password: "Admin@123"
            }
        ];
        fs.writeFileSync(usersFile, JSON.stringify(seedUsers, null, 2), "utf8");
    }
}

function loadUsers() {
    ensureUsersFile();
    const raw = fs.readFileSync(usersFile, "utf8");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
}

function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), "utf8");
}

function generateToken(userId) {
    return `token_${userId}_${Date.now()}`;
}

function getUserIdFromToken(token) {
    if (!token || typeof token !== "string") return null;
    const parts = token.split("_");
    if (parts.length < 3 || parts[0] !== "token") return null;
    const userId = Number(parts[1]);
    return Number.isInteger(userId) ? userId : null;
}

function getAuthUser(req) {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) return null;
    const token = authHeader.slice(7).trim();
    const userId = getUserIdFromToken(token);
    if (!userId) return null;

    const users = loadUsers();
    return users.find(u => u.id === userId) || null;
}

// ========== ROUTES ==========

// Health check
app.get("/", (req, res) => {
    res.json({ 
        message: "GlowCart API Server Running",
        version: "1.0.0",
        endpoints: ["/login", "/register", "/me", "/users/me"]
    });
});

// Login endpoint
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();

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
        const token = generateToken(user.id);
        
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
    const users = loadUsers();

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
    const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = {
        id: nextId,
        fullname,
        email,
        username,
        password // In production, hash this password
    };

    users.push(newUser);
    saveUsers(users);

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

// Get currently logged-in user profile
app.get("/me", (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    res.json({
        success: true,
        user: {
            id: user.id,
            username: user.username,
            fullname: user.fullname,
            email: user.email
        }
    });
});

// Delete current user's account
app.delete("/users/me", (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    const users = loadUsers();
    const updatedUsers = users.filter(u => u.id !== user.id);
    saveUsers(updatedUsers);

    res.json({
        success: true,
        message: "Account deleted successfully"
    });
});

// Get all users (for debugging only - remove in production)
app.get("/users", (req, res) => {
    const users = loadUsers();
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