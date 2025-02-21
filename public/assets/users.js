/**
 * users.js
 * Maneja la lógica para el módulo de Usuarios en el dashboard de administrador.
 * Permite cargar la lista de usuarios y realizar acciones de edición y eliminación.
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

async function loadUsers() {
  const token = getToken();
  try {
    const response = await fetch('http://localhost:3000/api/users', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await response.json();
    if (data.users) {
      renderUsersTable(data.users);
    } else {
      console.error('No se obtuvo la lista de usuarios.');
    }
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
  }
}

function renderUsersTable(users) {
  const usersTableDiv = document.getElementById('usersTable');
  if (!usersTableDiv) return;
  let tableHtml = '<table class="table table-bordered">';
  tableHtml += '<thead><tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Saldo Wallet</th><th>Acciones</th></tr></thead>';
  tableHtml += '<tbody>';
  users.forEach(user => {
    tableHtml += `<tr>
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${user.wallet_balance || 0}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="openEditUserModal(${user.id}, '${user.name}', '${user.email}', '${user.role}', ${user.wallet_balance || 0})">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Eliminar</button>
      </td>
    </tr>`;
  });
  tableHtml += '</tbody></table>';
  usersTableDiv.innerHTML = tableHtml;
}

function openEditUserModal(id, name, email, role, walletBalance) {
  const newName = prompt("Editar nombre:", name);
  const newEmail = prompt("Editar correo:", email);
  const newPassword = prompt("Nueva contraseña (dejar en blanco para no cambiar):", "");
  const newRole = prompt("Editar rol (user/admin):", role);
  if (newName && newEmail && newRole) {
    updateUser(id, newName, newEmail, newPassword, newRole);
  }
}

async function updateUser(id, name, email, password, role) {
  const token = getToken();
  const payload = { name, email, role };
  if (password && password.trim() !== "") {
    payload.password = password;
  }
  try {
    const response = await fetch(`http://localhost:3000/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    alert(data.message || 'Usuario actualizado');
    loadUsers();
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
  }
}

async function deleteUser(id) {
  if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
  const token = getToken();
  try {
    const response = await fetch(`http://localhost:3000/api/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await response.json();
    alert(data.message || 'Usuario eliminado');
    loadUsers();
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
  }
}