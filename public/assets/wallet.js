/**
 * wallet.js
 * Maneja la lógica de la página de Wallet (comprar y transferir coins).
 */

document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  
  const userIdSpan = document.getElementById('displayUserId');
  const balanceSpan = document.getElementById('displayBalance');
  const btnLogoutWallet = document.getElementById('btnLogoutWallet');

  if (btnLogoutWallet) {
    btnLogoutWallet.addEventListener('click', () => {
      logout();
    });
  }

  loadWallet();

  // Manejo del formulario de compra de coins
  const buyCoinsForm = document.getElementById('buyCoinsForm');
  if (buyCoinsForm) {
    buyCoinsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const token = getToken();
      const user_id = Number(getUserId());
      const amountCOP = Number(document.getElementById('amountCOP').value.trim());

      console.log("Compra - user_id:", user_id, "amountCOP:", amountCOP);

      // Validaciones para la compra
      if (isNaN(user_id) || user_id <= 0) {
        alert("Error: ID de usuario no válido.");
        return;
      }
      if (isNaN(amountCOP) || amountCOP < 20000) {
        alert("El monto mínimo de compra es $20.000 COP.");
        return;
      }
      if (amountCOP > 500000) {
        alert("El monto máximo de compra es $500.000 COP.");
        return;
      }
      
      try {
        console.log("Enviando =>", user_id, amountCOP);
        const response = await fetch('http://localhost:3000/api/wallet/buy', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id, amountCOP })
        });
        const data = await response.json();
        alert(data.message || 'Compra realizada');
        // Cerrar modal de compra
        const buyModalEl = document.getElementById('buyCoinsModal');
        const buyModal = bootstrap.Modal.getInstance(buyModalEl);
        if (buyModal) buyModal.hide();
        // Limpiar campo
        document.getElementById('amountCOP').value = '';
        loadWallet();
      } catch (err) {
        console.error('Error al comprar coins:', err);
      }
    });
  }

  // Manejo del formulario de transferencia de coins
  const transferCoinsForm = document.getElementById('transferCoinsForm');
  if (transferCoinsForm) {
    transferCoinsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const token = getToken();
      const from_user_id = Number(getUserId());
      const to_user_id = Number(document.getElementById('recipientId').value.trim());
      const amount = Number(document.getElementById('transferAmount').value.trim());

      console.log("Transferencia - from_user_id:", from_user_id, "to_user_id:", to_user_id, "amount:", amount);

      // Validaciones para la transferencia
      if (isNaN(from_user_id) || from_user_id <= 0) {
        alert("Error: ID de usuario origen no válido.");
        return;
      }
      if (isNaN(to_user_id) || to_user_id <= 0) {
        alert("Ingresa un ID de usuario receptor válido.");
        return;
      }
      if (isNaN(amount) || amount < 1000) {
        alert("El monto a transferir debe ser al menos 1000 coins.");
        return;
      }
      
      try {
        const response = await fetch('http://localhost:3000/api/wallet/transfer', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ from_user_id, to_user_id, amount })
        });
        await response.json();
        alert("Transferencia Realizada");
        // Cerrar modal de transferencia
        const transferModalEl = document.getElementById('transferCoinsModal');
        const transferModal = bootstrap.Modal.getInstance(transferModalEl);
        if (transferModal) transferModal.hide();
        // Limpiar campos
        document.getElementById('recipientId').value = '';
        document.getElementById('transferAmount').value = '';
        loadWallet();
      } catch (err) {
        console.error('Error al transferir coins:', err);
      }
    });
  }
});

async function loadWallet() {
  const userId = getUserId();
  const token = getToken();
  const userIdSpan = document.getElementById('displayUserId');
  const balanceSpan = document.getElementById('displayBalance');
  userIdSpan.innerText = userId || 'Desconocido';
  try {
    const response = await fetch(`http://localhost:3000/api/wallet/${userId}`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await response.json();
    if (data.wallet) {
      balanceSpan.innerText = data.wallet.balance;
    } else {
      balanceSpan.innerText = '0';
    }
  } catch (err) {
    console.error('Error al cargar wallet:', err);
  }
}