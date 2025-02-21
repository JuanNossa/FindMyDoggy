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

        // Guardar token, userId y role
        localStorage.setItem('token', data.token);
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        localStorage.setItem('userId', payload.userId);
        localStorage.setItem('role', payload.role);

        // Intentar almacenar la información del usuario:
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          // Si no se envía la info del usuario, hacemos una petición a GET /api/users
          // y filtramos por el userId del token
          const usersResponse = await fetch('http://localhost:3000/api/users', {
            headers: { 'Authorization': 'Bearer ' + data.token }
          });
          if (usersResponse.ok) {
            const allUsersData = await usersResponse.json();
            if (allUsersData.users) {
              const currentUser = allUsersData.users.find(u => u.id == payload.userId);
              if (currentUser) {
                localStorage.setItem('user', JSON.stringify(currentUser));
              } else {
                localStorage.setItem('user', JSON.stringify({ name: 'Sin nombre', email: 'Sin correo' }));
              }
            } else {
              localStorage.setItem('user', JSON.stringify({ name: 'Sin nombre', email: 'Sin correo' }));
            }
          } else {
            localStorage.setItem('user', JSON.stringify({ name: 'Sin nombre', email: 'Sin correo' }));
          }
        }
        
        // Redirigir según rol
        if (payload.role === "admin") {
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