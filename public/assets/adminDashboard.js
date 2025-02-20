/**
 * adminDashboard.js
 * Lógica para el dashboard de administrador.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Verificar token
    requireAuth();
    // Verificar rol admin
    if (getUserRole() !== 'admin') {
      // Si no es admin, redirigir a user-dashboard
      window.location.href = 'user-dashboard.html';
    }
  
    // Manejo del botón de logout
    const btnLogoutAdmin = document.getElementById('btnLogoutAdmin');
    if (btnLogoutAdmin) {
      btnLogoutAdmin.addEventListener('click', () => {
        logout();
      });
    }
  
    // Aquí se pueden cargar datos de usuarios, wallets, etc.
  });  