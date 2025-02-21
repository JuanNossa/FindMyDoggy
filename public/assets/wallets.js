/**
 * wallets.js
 * 
 * Este archivo maneja la lógica para el módulo de Wallets en el dashboard de administrador.
 * Permite cargar todas las wallets, mostrar su información en una tabla y actualizar el saldo.
 *
 * Se asume que el back‑end dispone de los siguientes endpoints:
 * - GET /api/wallets  -> Retorna todas las wallets.
 * - PUT /api/wallets/:walletId  -> Actualiza el saldo de una wallet.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Cargar la lista de wallets al cargar la página
    loadWallets();
  
    // Configurar el botón de logout para cerrar sesión
    const btnLogoutWallets = document.getElementById('btnLogoutWallets');
    if (btnLogoutWallets) {
      btnLogoutWallets.addEventListener('click', () => {
        logout();
      });
    }
  });
  
  /**
   * Carga todas las wallets del sistema.
   * Se realiza una petición GET al endpoint de wallets y se renderiza una tabla.
   */
  async function loadWallets() {
    const token = getToken();
    try {
      const response = await fetch('http://localhost:3000/api/wallets', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await response.json();
      if (data.wallets) {
        renderWalletsTable(data.wallets);
      } else {
        console.error('No se recibió la lista de wallets.');
      }
    } catch (error) {
      console.error('Error al cargar wallets:', error);
    }
  }
  
  /**
   * Renderiza una tabla HTML con la lista de wallets.
   * @param {Array} wallets - Arreglo de objetos wallet.
   */
  function renderWalletsTable(wallets) {
    const walletsTableDiv = document.getElementById('walletsTable');
    if (!walletsTableDiv) return;
  
    // Construir la tabla con encabezados
    let tableHtml = '<table class="table table-striped">';
    tableHtml += '<thead><tr><th>ID</th><th>User ID</th><th>Balance</th><th>Acciones</th></tr></thead>';
    tableHtml += '<tbody>';
  
    // Recorrer cada wallet y agregar una fila
    wallets.forEach(wallet => {
      tableHtml += `<tr>
        <td>${wallet.id}</td>
        <td>${wallet.user_id}</td>
        <td>${wallet.balance}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="openEditWalletModal(${wallet.id}, ${wallet.balance}, ${wallet.user_id})">Editar</button>
        </td>
      </tr>`;
    });
  
    tableHtml += '</tbody></table>';
    walletsTableDiv.innerHTML = tableHtml;
  }
  
  /**
   * Abre un prompt para editar el saldo de una wallet.
   * @param {number} walletId - ID de la wallet.
   * @param {number} currentBalance - Saldo actual de la wallet.
   * @param {number} userId - ID del usuario propietario de la wallet.
   */
  function openEditWalletModal(walletId, currentBalance, userId) {
    // Se utiliza prompt para simplificar; en una versión real se usaría un modal
    const newBalance = prompt(`Editar saldo para la wallet del usuario ${userId}:`, currentBalance);
    if (newBalance !== null) {
      updateWallet(walletId, userId, parseFloat(newBalance));
    }
  }
  
  /**
   * Actualiza el saldo de una wallet.
   * Realiza una petición PUT al endpoint correspondiente.
   * @param {number} walletId - ID de la wallet a actualizar.
   * @param {number} userId - ID del usuario propietario de la wallet.
   * @param {number} newBalance - Nuevo saldo.
   */
  async function updateWallet(walletId, userId, newBalance) {
    const token = getToken();
    try {
      const response = await fetch(`http://localhost:3000/api/wallets/${walletId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ balance: newBalance })
      });
      const data = await response.json();
      alert(data.message || 'Wallet actualizada');
      // Recargar la lista de wallets después de la actualización
      loadWallets();
    } catch (error) {
      console.error('Error al actualizar la wallet:', error);
    }
  }  