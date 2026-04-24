const form          = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');
const togglePw      = document.getElementById('togglePw');
const loginBtn      = document.getElementById('loginBtn');
const spinner       = document.getElementById('spinner');
const btnText       = document.getElementById('btnText');
const toast         = document.getElementById('toast');
const strengthBar   = document.getElementById('strengthBar');
const strengthLabel = document.getElementById('strengthLabel');
const rememberMe    = document.getElementById('rememberMe');

function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function showError(input, errorEl) {
    input.classList.add('error-border');
    errorEl.style.display = 'block';
}

function clearError(input, errorEl) {
    input.classList.remove('error-border');
    errorEl.style.display = 'none';
}

togglePw.addEventListener('click', () => {
    const show = passwordInput.type === 'password';
    passwordInput.type = show ? 'text' : 'password';
});

passwordInput.addEventListener('input', () => {
    clearError(passwordInput, passwordError);
    const val = passwordInput.value;

    let score = 0;
    if (val.length >= 6) score++;
    if (val.length >= 10) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const widths = ['20%','40%','60%','80%','100%'];
    const colors = ['#e53935','#fb8c00','#fdd835','#43a047','#1b5e20'];
    const labels = ['Very Weak','Weak','Fair','Strong','Very Strong'];

    if (score > 0) {
        strengthBar.style.width = widths[Math.min(score-1,4)];
        strengthBar.style.background = colors[Math.min(score-1,4)];
        strengthLabel.textContent = `Strength: ${labels[Math.min(score-1,4)]}`;
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = usernameInput.value.trim();
    const pass = passwordInput.value;
    let valid  = true;

    if (!user) { showError(usernameInput, usernameError); valid = false; }
    if (!pass || pass.length < 6) { showError(passwordInput, passwordError); valid = false; }
    if (!valid) return;

    loginBtn.classList.add('loading');
    spinner.style.display = 'block';
    btnText.textContent = 'Logging in…';

    // ✅ REAL BACKEND CALL (replaces setTimeout)
    fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: user,
            password: pass
        })
    })
    .then(res => res.json())
    .then(data => {
        loginBtn.classList.remove('loading');
        spinner.style.display = 'none';
        btnText.textContent = 'Login';

        if (data.success) {
            if (rememberMe.checked) {
                localStorage.setItem('savedUsername', user);
            } else {
                localStorage.removeItem('savedUsername');
            }

            showToast(data.message);
        } else {
            showToast(data.message, "error-toast");
        }
    })
    .catch(() => {
        loginBtn.classList.remove('loading');
        spinner.style.display = 'none';
        btnText.textContent = 'Login';

        showToast("Server error 😬", "error-toast");
    });
});

window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('savedUsername');
    if (saved) {
        usernameInput.value = saved;
        rememberMe.checked  = true;
    }
});