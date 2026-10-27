import { loginUser } from './api.js';

// Verificar si ya está logueado para mandarlo directo al sistema
document.addEventListener('DOMContentLoaded', () => {
    const session = localStorage.getItem('authUser');
    if (session) {
        window.location.href = 'dashboard.html';
    }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userVal = document.getElementById('username').value;
    const passVal = document.getElementById('password').value;
    const errorDiv = document.getElementById('errorMessage');
    const btn = document.getElementById('submitBtn');

    errorDiv.style.display = 'none';
    btn.textContent = 'Ingresando...';
    btn.disabled = true;

    try {
        const userData = await loginUser(userVal, passVal);
        localStorage.setItem('authUser', JSON.stringify(userData));
        window.location.href = 'dashboard.html';
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    } finally {
        btn.textContent = 'Ingresar';
        btn.disabled = false;
    }
});