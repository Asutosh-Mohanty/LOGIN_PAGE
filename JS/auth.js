const API_BASE_URL = 'http://localhost:5000';
const APP_BASE_PATH = '/Skin_Care';

function navigateTo(pageName) {
    window.location.href = `${APP_BASE_PATH}/${pageName}`;
}

function showError(input, errorEl) {
    if (!input || !errorEl) return;
    input.classList.add('error-border');
    errorEl.style.display = 'block';
}

function clearError(input, errorEl) {
    if (!input || !errorEl) return;
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

function setLoadingState(button, spinner, textEl, loadingText, isLoading) {
    if (button) button.disabled = isLoading;
    if (spinner) spinner.style.display = isLoading ? 'inline-block' : 'none';
    if (textEl) textEl.textContent = isLoading ? loadingText : textEl.dataset.defaultText;
}

function saveSessionFromResponse(data, fallbackUsername) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.user?.username || fallbackUsername || '');
    localStorage.setItem('fullname', data.user?.fullname || '');
    localStorage.setItem('email', data.user?.email || '');
    if (data.user?.id !== undefined) {
        localStorage.setItem('userId', String(data.user.id));
    }
}

function bindPasswordToggle(toggleIcon, passwordInput) {
    if (!toggleIcon || !passwordInput) return;
    toggleIcon.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        toggleIcon.classList.toggle('bx-show', type === 'text');
        toggleIcon.classList.toggle('bx-hide', type !== 'text');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const rememberMe = document.getElementById('rememberMe');
        const togglePassword = document.getElementById('togglePassword');
        const loginBtn = document.getElementById('loginBtn');
        const spinner = document.getElementById('spinner');
        const btnText = document.getElementById('btnText');
        btnText.dataset.defaultText = btnText.textContent;

        bindPasswordToggle(togglePassword, passwordInput);

        usernameInput?.addEventListener('input', () => clearError(usernameInput, document.getElementById('usernameError')));
        passwordInput?.addEventListener('input', () => clearError(passwordInput, document.getElementById('passwordError')));

        const savedUsername = localStorage.getItem('savedUsername');
        if (savedUsername && usernameInput && rememberMe) {
            usernameInput.value = savedUsername;
            rememberMe.checked = true;
        }

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = usernameInput?.value.trim();
            const password = passwordInput?.value;
            let valid = true;

            if (!username) {
                showError(usernameInput, document.getElementById('usernameError'));
                valid = false;
            }

            if (!password || password.length < 6) {
                showError(passwordInput, document.getElementById('passwordError'));
                valid = false;
            }

            if (!valid) return;

            setLoadingState(loginBtn, spinner, btnText, 'Logging in...', true);

            try {
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await response.json();
                setLoadingState(loginBtn, spinner, btnText, 'Logging in...', false);

                if (!response.ok || !data.success) {
                    showToast(data.message || 'Login failed', 'error');
                    return;
                }

                saveSessionFromResponse(data, username);
                if (rememberMe?.checked) {
                    localStorage.setItem('savedUsername', username);
                } else {
                    localStorage.removeItem('savedUsername');
                }

                showToast(data.message || 'Login successful', 'success');
                setTimeout(() => { navigateTo('products.html'); }, 900);
            } catch (error) {
                setLoadingState(loginBtn, spinner, btnText, 'Logging in...', false);
                showToast('Cannot connect to server. Start backend with: npm start', 'error');
            }
        });
    }

    if (registerForm) {
        const fullnameInput = document.getElementById('fullname');
        const emailInput = document.getElementById('email');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const agreeTerms = document.getElementById('agreeTerms');
        const togglePassword = document.getElementById('togglePassword');
        const registerBtn = document.getElementById('registerBtn');
        const spinner = document.getElementById('spinner');
        const btnText = document.getElementById('btnText');
        const strengthBar = document.getElementById('strengthBar');
        const strengthLabel = document.getElementById('strengthLabel');
        btnText.dataset.defaultText = btnText.textContent;

        bindPasswordToggle(togglePassword, passwordInput);

        fullnameInput?.addEventListener('input', () => clearError(fullnameInput, document.getElementById('fullnameError')));
        emailInput?.addEventListener('input', () => clearError(emailInput, document.getElementById('emailError')));
        usernameInput?.addEventListener('input', () => clearError(usernameInput, document.getElementById('usernameError')));
        passwordInput?.addEventListener('input', () => {
            clearError(passwordInput, document.getElementById('passwordError'));
            const value = passwordInput.value;
            let score = 0;
            if (value.length >= 6) score++;
            if (value.length >= 10) score++;
            if (/[A-Z]/.test(value)) score++;
            if (/[0-9]/.test(value)) score++;
            if (/[^A-Za-z0-9]/.test(value)) score++;

            const widths = ['20%', '40%', '60%', '80%', '100%'];
            const colors = ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1b5e20'];
            const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];

            if (!strengthBar || !strengthLabel) return;
            if (score > 0) {
                const idx = Math.min(score - 1, 4);
                strengthBar.style.width = widths[idx];
                strengthBar.style.background = colors[idx];
                strengthLabel.textContent = `Strength: ${labels[idx]}`;
            } else {
                strengthBar.style.width = '0';
                strengthLabel.textContent = '';
            }
        });

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fullname = fullnameInput?.value.trim();
            const email = emailInput?.value.trim();
            const username = usernameInput?.value.trim();
            const password = passwordInput?.value;
            let valid = true;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!fullname) {
                showError(fullnameInput, document.getElementById('fullnameError'));
                valid = false;
            }
            if (!email || !emailRegex.test(email)) {
                showError(emailInput, document.getElementById('emailError'));
                valid = false;
            }
            if (!username || username.length < 3) {
                showError(usernameInput, document.getElementById('usernameError'));
                valid = false;
            }
            if (!password || password.length < 6) {
                showError(passwordInput, document.getElementById('passwordError'));
                valid = false;
            }
            if (!agreeTerms?.checked) {
                showToast('Please accept the terms and conditions', 'error');
                valid = false;
            }
            if (!valid) return;

            setLoadingState(registerBtn, spinner, btnText, 'Creating...', true);

            try {
                const response = await fetch(`${API_BASE_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullname, email, username, password })
                });
                const data = await response.json();
                setLoadingState(registerBtn, spinner, btnText, 'Creating...', false);

                if (!response.ok || !data.success) {
                    showToast(data.message || 'Registration failed', 'error');
                    return;
                }

                showToast(data.message || 'Account created successfully', 'success');
                setTimeout(() => { navigateTo('login.html'); }, 1100);
            } catch (error) {
                setLoadingState(registerBtn, spinner, btnText, 'Creating...', false);
                showToast('Cannot connect to server. Start backend with: npm start', 'error');
            }
        });
    }
});