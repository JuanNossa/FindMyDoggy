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
  requireAuth();
  // Cargar la lista de wallets al cargar la página
  loadWallets();
  const buyCoinsForm = document.getElementById('buyCoinsForm');
  if (buyCoinsForm) {
    buyCoinsForm.addEventListener('submit', buyCoins);
  }

  const transferCoinsForm = document.getElementById('transferCoinsForm');
  if (transferCoinsForm) {
    transferCoinsForm.addEventListener('submit', transferCoins);
  }

  // Configurar el botón de logout para cerrar sesión
  const btnLogoutWallet = document.getElementById('btnLogoutWallet');
  if (btnLogoutWallet) {
    btnLogoutWallet.addEventListener('click', () => {
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
    // Se asume que el endpoint de wallets para admin es: /api/wallets
    const response = await fetch('http://localhost:3000/api/wallets', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
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
//comprar coins
async function buyCoins(e) {
  e.preventDefault();
  const userId = getUserId();
  const token = getToken();
  const amountCOP = document.getElementById('amountCOP').value;

  try {
    const response = await fetch('http://localhost:3000/api/wallet/buy', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_id: userId, amountCOP })
    });
    const data = await response.json();
    alert(data.message || 'Compra realizada');
    
    // Cerrar modal
    const buyModalEl = document.getElementById('buyCoinsModal');
    const buyModal = bootstrap.Modal.getInstance(buyModalEl);
    if (buyModal) buyModal.hide();
    
    // Limpiar campos
    document.getElementById('amountCOP').value = '';
    loadWallet();
  } catch (err) {
    console.error('Error al comprar coins:', err);
  }
}
//transferir coins
async function transferCoins(e) {
  e.preventDefault();
  const token = getToken();
  const from_user_id = getUserId();
  const to_user_id = document.getElementById('recipientId').value;
  const amount = document.getElementById('transferAmount').value;

  try {
    const response = await fetch('http://localhost:3000/api/wallet/transfer', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ from_user_id, to_user_id, amount })
    });
    const data = await response.json();
    alert(data.message || 'Transferencia realizada');
    
    // Cerrar modal
    const transferModalEl = document.getElementById('transferCoinsModal');
    const transferModal = bootstrap.Modal.getInstance(transferModalEl);
    if (transferModal) transferModal.hide();
    
    // Limpiar campos
    document.getElementById('transferAmount').value = '';
    document.getElementById('recipientId').value = '';
    loadWallet();
  } catch (err) {
    console.error('Error al transferir coins:', err);
  }
}