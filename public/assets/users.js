/**
 * users.js
 *
 * Este archivo maneja la lógica para el módulo de Usuarios en el dashboard de administrador.
 * Permite cargar la lista de usuarios, mostrar sus datos en una tabla y ejecutar acciones de edición y eliminación.
 *
 * Se asume que el back‑end dispone de los siguientes endpoints:
 * - GET /api/users  -> Lista todos los usuarios.
 * - PUT /api/users/:id  -> Actualiza los datos de un usuario.
 * - DELETE /api/users/:id  -> Elimina un usuario.
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
   * Carga la lista de usuarios.
   */
  async function loadUsers() {
    const token = getToken();
    try {
      // Se asume que el endpoint para listar usuarios es /api/users
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
  
  /**
   * Renderiza una tabla HTML con la lista de usuarios.
   * @param {Array} users - Arreglo de objetos usuario.
   */
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
  
  /**
   * Abre un prompt para editar los datos de un usuario.
   * @param {number} id - ID del usuario.
   * @param {string} name - Nombre actual.
   * @param {string} email - Correo actual.
   * @param {string} role - Rol actual.
   * @param {number} walletBalance - Saldo actual de la wallet.
   */
  function openEditUserModal(id, name, email, role, walletBalance) {
    // Para simplificar se usan prompts; en una implementación real se usaría un modal
    const newName = prompt("Editar nombre:", name);
    const newEmail = prompt("Editar correo:", email);
    const newPassword = prompt("Nueva contraseña (dejar en blanco para no cambiar):", "");
    const newRole = prompt("Editar rol (user/admin):", role);
  
    if (newName && newEmail && newRole) {
      updateUser(id, newName, newEmail, newPassword, newRole);
    }
  }
  
  /**
   * Actualiza los datos de un usuario.
   * Realiza una petición PUT al endpoint correspondiente.
   * @param {number} id - ID del usuario.
   * @param {string} name - Nuevo nombre.
   * @param {string} email - Nuevo correo.
   * @param {string} password - Nueva contraseña (opcional).
   * @param {string} role - Nuevo rol.
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
  
  /**
   * Elimina un usuario.
   * Realiza una petición DELETE al endpoint correspondiente.
   * @param {number} id - ID del usuario a eliminar.
   */
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