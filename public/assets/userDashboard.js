document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  
  // Cargar datos del perfil (si se usa en esta vista)
  loadUserProfile();

  // Manejo del botón de logout
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      logout();
    });
  }

  // Ejemplo: cargar notificaciones
  loadNotificationsUser();

  function loadNotificationsUser() {
    const notifCount = document.getElementById('notifCount');
    if (notifCount) {
      notifCount.innerText = '2'; // Ejemplo
    }
  }

  // Función para cargar la información del usuario desde localStorage
  function loadUserProfile() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      const userNameElem = document.getElementById('userName');
      const userEmailElem = document.getElementById('userEmail');
      if (userNameElem) {
        userNameElem.textContent = user.name || 'Sin nombre';
      }
      if (userEmailElem) {
        userEmailElem.textContent = user.email || 'Sin correo';
      }
    }
  }
});