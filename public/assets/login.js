/**
 * login.js
 * Maneja la lógica de login en la página index.html
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
      loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
  
        try {
          const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const data = await response.json();
          if (!response.ok) {
            showAlert(data.message || 'Error en el login');
            return;
          }
  
          // Guardar token, userId, role
          localStorage.setItem('token', data.token);
          const payload = JSON.parse(atob(data.token.split('.')[1]));
          localStorage.setItem('userId', payload.userId);
          localStorage.setItem('role', payload.role);
  
          // Redirigir según rol
          if (payload.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
          } else {
            window.location.href = 'user-dashboard.html';
          }
        } catch (err) {
          console.error('Error en el login:', err);
          showAlert('Error al iniciar sesión.');
        }
      });
    }
  });  