// ========== AUTH HELPER FUNCTIONS ==========
function showError(input, errorEl) {
    input.classList.add('error-border');
    errorEl.style.display = 'block';
}

function clearError(input, errorEl) {
    input.classList.remove('error-border');
    errorEl.style.display = 'none';
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ========== LOGIN PAGE LOGIC ==========
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // LOGIN FORM HANDLER
    if (loginForm) {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const togglePassword = document.getElementById('togglePassword');
        const rememberMe = document.getElementById('rememberMe');
        const loginBtn = document.getElementById('loginBtn');
        const spinner = document.getElementById('spinner');
        const btnText = document.getElementById('btnText');
        
        // Clear errors on input
        usernameInput?.addEventListener('input', () => {
            clearError(usernameInput, document.getElementById('usernameError'));
        });
        
        passwordInput?.addEventListener('input', () => {
            clearError(passwordInput, document.getElementById('passwordError'));
        });
        
        // Toggle password visibility
        togglePassword?.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            
            // Toggle icon
            if (type === 'text') {
                togglePassword.classList.remove('bx-hide');
                togglePassword.classList.add('bx-show');
            } else {
                togglePassword.classList.remove('bx-show');
                togglePassword.classList.add('bx-hide');
            }
        });
        
        // Form submission
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = usernameInput.value.trim();
            const password = passwordInput.value;
            let valid = true;
            
            // Validation
            if (!username) {
                showError(usernameInput, document.getElementById('usernameError'));
                valid = false;
            }
            
            if (!password || password.length < 6) {
                showError(passwordInput, document.getElementById('passwordError'));
                valid = false;
            }
            
            if (!valid) return;
            
            // Show loading
            loginBtn.disabled = true;
            spinner.style.display = 'inline-block';
            btnText.textContent = 'Logging in...';
            
            // Send to backend
            fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            .then(res => res.json())
            .then(data => {
                loginBtn.disabled = false;
                spinner.style.display = 'none';
                btnText.textContent = 'Login';
                
                if (data.success) {
                    // Save token and username
                    localStorage.setItem('token', data.token || 'mock-token-' + Date.now());
                    localStorage.setItem('username', username);
                    
                    // Remember me
                    if (rememberMe.checked) {
                        localStorage.setItem('savedUsername', username);
                    } else {
                        localStorage.removeItem('savedUsername');
                    }
                    
                    showToast(data.message, 'success');
                    
                    // Redirect to products page
                    setTimeout(() => {
                        window.location.href = 'products.html';
                    }, 1000);
                } else {
                    showToast(data.message, 'error');
                }
            })
            .catch(() => {
                loginBtn.disabled = false;
                spinner.style.display = 'none';
                btnText.textContent = 'Login';
                showToast('Server error. Please try again.', 'error');
            });
        });
        
        // Load saved username
        const savedUsername = localStorage.getItem('savedUsername');
        if (savedUsername) {
            usernameInput.value = savedUsername;
            rememberMe.checked = true;
        }
    }
    
    // REGISTER FORM - Password Strength (already in register.html inline script)
    // Toggle password for register page
    const registerTogglePassword = document.getElementById('togglePassword');
    const registerPasswordInput = document.getElementById('password');
    
    if (registerTogglePassword && registerPasswordInput) {
        registerTogglePassword.addEventListener('click', () => {
            const type = registerPasswordInput.type === 'password' ? 'text' : 'password';
            registerPasswordInput.type = type;
            
            // Toggle icon
            if (type === 'text') {
                registerTogglePassword.classList.remove('bx-hide');
                registerTogglePassword.classList.add('bx-show');
            } else {
                registerTogglePassword.classList.remove('bx-show');
                registerTogglePassword.classList.add('bx-hide');
            }
        });
    }
});