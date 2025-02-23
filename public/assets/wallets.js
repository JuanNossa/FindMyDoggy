document.addEventListener('DOMContentLoaded', () => {
  loadWallets();

  const btnLogoutWallets = document.getElementById('btnLogoutWallets');
  if (btnLogoutWallets) {
    btnLogoutWallets.addEventListener('click', logout);
  }
});

/**
 * Carga todas las wallets y muestra la tabla.
 */
async function loadWallets() {
  const token = getToken();
  try {
    const response = await fetch('http://localhost:3000/api/wallets', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const { wallets } = await response.json();
    renderWalletsTable(wallets || []);
  } catch (error) {
    console.error('Error al cargar wallets:', error);
  }
}

/**
 * Renderiza la tabla de wallets.
 */
function renderWalletsTable(wallets) {
  const walletsTableDiv = document.getElementById('walletsTable');
  if (!walletsTableDiv) return;

  let tableHtml = `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th><th>Usuario</th><th>Correo</th><th>Saldo (Coins)</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
  `;

  wallets.forEach(wallet => {
    const balance = parseFloat(wallet.balance);
    const formattedBalance = isNaN(balance) ? '0.00' : balance.toFixed(2);

    tableHtml += `
      <tr>
        <td>${wallet.id}</td>
        <td>${wallet.name}</td>
        <td>${wallet.email}</td>
        <td>${formattedBalance}</td>
        <td>
          <button class="btn btn-warning" onclick="openEditWalletModal(${wallet.user_id}, ${formattedBalance})">
            Cambiar saldo
          </button>
        </td>
      </tr>`;
  });

  tableHtml += '</tbody></table>';
  walletsTableDiv.innerHTML = tableHtml;
}

/**
 * Abre un prompt para editar el saldo.
 */
function openEditWalletModal(userId, currentBalance) {
  const newBalanceInput = prompt(`Editar saldo para el usuario ${userId}:`, currentBalance);

  if (newBalanceInput === null) return;  // Cancelado

  const cleanedInput = newBalanceInput.trim().replace(/[^0-9.]/g, '');
  const newBalance = parseFloat(cleanedInput);

  if (cleanedInput === '' || isNaN(newBalance) || newBalance < 0) {
    alert('⚠️ Ingrese un saldo válido. Debe ser un número mayor o igual a 0.');
    return;
  }

  updateWallet(userId, newBalance);
}

/**
 * Actualiza el saldo de la wallet.
 */
async function updateWallet(userId, newBalance) {
  const token = getToken();

  try {
    const response = await fetch(`http://localhost:3000/api/wallets/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ balance: newBalance })
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message || 'Saldo actualizado');
      loadWallets(); // Refresca la tabla
    } else {
      console.error('Error en la respuesta del servidor:', data.message);
      alert(data.message || 'No se pudo actualizar el saldo.');
    }
  } catch (error) {
    console.error('Error al actualizar la wallet:', error);
  }
}
