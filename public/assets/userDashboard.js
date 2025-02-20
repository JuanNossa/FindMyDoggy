/**
 * userDashboard.js
 * Lógica específica para el dashboard de usuario.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Verificar si hay token, si no, redirigir
    requireAuth();
  
    // Manejo del botón de logout
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        logout();
      });
    }
  
    // Ejemplo: cargar datos de publicaciones o notificaciones si fuera necesario
    loadNotificationsUser();
  
    function loadNotificationsUser() {
      // Aquí podrías hacer un fetch a /api/notifications/{userId} para obtener el conteo
      // y actualizar un badge en la navbar, etc.
      // Ejemplo simulado:
      const notifCount = document.getElementById('notifCount');
      if (notifCount) {
        notifCount.innerText = '2'; // Ejemplo
      }
    }
  });  