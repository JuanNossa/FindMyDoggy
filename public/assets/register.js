/**
 * register.js
 * Maneja la lógica de registro en la página de registro (register.html).
 * Envía la información del formulario al endpoint de registro y, en caso de éxito,
 * redirige al usuario a la página de login (index.html).
 */

document.addEventListener('DOMContentLoaded', () => {
    // Obtener el formulario de registro
    const registerForm = document.getElementById('registerForm');
  
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Recopilar datos del formulario
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
  
        try {
          // Realizar la petición POST al endpoint de registro
          const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
          });
          const data = await response.json();
  
          if (!response.ok) {
            // Si hay error, mostrar mensaje
            alert(data.message || 'Error en el registro.');
            return;
          }
  
          // Registro exitoso, notificar al usuario y redirigir al login
          alert('Registro exitoso. Por favor, inicie sesión.');
          window.location.href = 'index.html';
        } catch (err) {
          console.error('Error en el registro:', err);
          alert('Error al registrar el usuario.');
        }
      });
    }
  });  