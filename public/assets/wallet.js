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
  loadWallet();

  document.getElementById('buyCoinsForm').addEventListener('submit', buyCoins);
  document.getElementById('transferCoinsForm').addEventListener('submit', transferCoins);
});

/**
 * Carga la wallet del usuario y muestra el saldo.
 */
async function loadWallet() {
  const userId = localStorage.getItem('userId');
  if (!userId || isNaN(Number(userId))) {
    alert('Error: ID de usuario inválido.');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/wallet/${userId}`, {
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    const data = await response.json();
    document.getElementById('displayUserId').innerText = userId;
    document.getElementById('displayBalance').innerText = data.wallet ? data.wallet.balance : '0';
  } catch (err) {
    console.error('Error al cargar wallet:', err);
  }
}

/**
 * Maneja la compra de coins.
 */
async function buyCoins(e) {
  e.preventDefault();
  const user_id = Number(localStorage.getItem('userId'));
fetch('http://localhost:3000/api/wallet/buy', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + getToken(),
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ user_id, amountCOP })
});
  const amountCOP = Number(document.getElementById('amountCOP').value);

  if (!user_id || isNaN(user_id)) {
    alert(`ID de usuario inválido. user_id: ${user_id}`);
    return;
  }

  if (!amountCOP || amountCOP <= 0) {
    alert(`Monto inválido. amountCOP: ${amountCOP}`);
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/wallet/buy', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + getToken(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_id, amountCOP })
    });

    const data = await response.json();
    alert(data.message || 'Compra realizada');
    loadWallet();
  } catch (err) {
    console.error('Error al comprar coins:', err);
  }
}

/**
 * Maneja la transferencia de coins.
 */
async function transferCoins(e) {
  e.preventDefault();
  const from_user_id = Number(localStorage.getItem('userId'));
  const to_user_id = Number(document.getElementById('recipientId').value);
  const amount = Number(document.getElementById('transferAmount').value);

  if ([from_user_id, to_user_id, amount].some(val => !val || isNaN(val))) {
    alert('Datos inválidos para la transferencia.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/wallet/transfer', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + getToken(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ from_user_id, to_user_id, amount })
    });
    const data = await response.json();
    alert(data.message);
    loadWallet();
  } catch (err) {
    console.error('Error al transferir coins:', err);
  }
}