/**
 * users.js
 * Maneja la lógica para el módulo de Usuarios en el dashboard de administrador.
 * Permite cargar la lista de usuarios y realizar acciones de edición y activación/desactivación.
 */

document.addEventListener('DOMContentLoaded', () => {
  loadUsers();

  const btnLogoutUsers = document.getElementById('btnLogoutUsers');
  if (btnLogoutUsers) {
    btnLogoutUsers.addEventListener('click', () => {
      logout();
    });
  }
});

/**
 * Carga usuarios desde la API y renderiza la tabla.
 */
async function loadUsers() {
  const token = getToken();
  try {
    const response = await fetch('http://localhost:3000/api/users', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await response.json();
    renderUsersTable(data.users || []);
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
  }
}

/**
 * Renderiza la tabla de usuarios.
 */
function renderUsersTable(users) {
  const usersTableDiv = document.getElementById('usersTable');
  if (!usersTableDiv) return;

  let tableHtml = `
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Saldo Wallet</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
  `;

  users.forEach(user => {
    const buttonText = user.estado_usuario === 1 ? 'Desactivar' : 'Activar';
    const buttonClass = user.estado_usuario === 1 ? 'btn-danger' : 'btn-success';

    tableHtml += `
      <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>${user.wallet_balance || 0}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="openEditUserModal(${user.id}, '${user.name}', '${user.email}', '${user.role}', ${user.wallet_balance || 0})">Editar</button>
          <button class="btn btn-sm ${buttonClass}" id="toggle-btn-${user.id}" onclick="toggleUserStatus(${user.id}, ${user.estado_usuario})">
            ${buttonText}
          </button>
        </td>
      </tr>`;
  });

  tableHtml += '</tbody></table>';
  usersTableDiv.innerHTML = tableHtml;
}

/**
 * Abre el modal para editar un usuario.
 */
function openEditUserModal(id, name, email, role, walletBalance) {
  const newName = prompt("Editar nombre:", name);
  const newEmail = prompt("Editar correo:", email);
  const newPassword = prompt("Nueva contraseña (dejar en blanco para no cambiar):", "");
  const newRole = prompt("Editar rol (user/admin):", role);

  if (newName && newEmail && newRole) {
    updateUser(id, newName, newEmail, newPassword, newRole);
  }
}

/**
 * Actualiza la información de un usuario.
 */
async function updateUser(id, name, email, password, role) {
  const token = getToken();
  const payload = { name, email, role };

  if (password && password.trim() !== "") {
    payload.password = password;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    alert(data.message || 'Usuario actualizado');
    loadUsers(); // ✅ Recarga usuarios para actualizar la tabla
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
  }
}

/**
 * Cambia el estado de un usuario y actualiza el botón en tiempo real.
 */
async function toggleUserStatus(id, currentStatus) {
  const confirmMessage = currentStatus === 1 ? "¿Deseas desactivar este usuario?" : "¿Deseas activar este usuario?";
  if (!confirm(confirmMessage)) return;

  try {
    const response = await fetch(`http://localhost:3000/api/users/toggleStatus/${id}`, { method: 'PUT' });
    const data = await response.json();

    if (data && data.message) {
      alert(data.message);

      const button = document.getElementById(`toggle-btn-${id}`);
      if (button) {
        const newStatus = data.newStatus; // Recibe el estado actualizado desde la API
        button.textContent = newStatus === 1 ? 'Desactivar' : 'Activar';
        button.className = `btn btn-sm ${newStatus === 1 ? 'btn-danger' : 'btn-success'}`;
        button.setAttribute('onclick', `toggleUserStatus(${id}, ${newStatus})`);
      }

    } else {
      console.error('Respuesta inesperada:', data);
    }

  } catch (error) {
    console.error('Error al cambiar estado:', error);
  }
}