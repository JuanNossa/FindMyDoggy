/**
 * wallet.js
 * Maneja la lógica de la página de Wallet (comprar y transferir coins).
 */

document.addEventListener('DOMContentLoaded', () => {
    requireAuth();
    const userIdSpan = document.getElementById('displayUserId');
    const balanceSpan = document.getElementById('displayBalance');
    const buyCoinsForm = document.getElementById('buyCoinsForm');
    const transferCoinsForm = document.getElementById('transferCoinsForm');
    const btnLogoutWallet = document.getElementById('btnLogoutWallet');
  
    if (btnLogoutWallet) {
      btnLogoutWallet.addEventListener('click', () => {
        logout();
      });
    }
  
    async function loadWallet() {
      const userId = getUserId();
      if (userIdSpan) userIdSpan.innerText = userId || 'Desconocido';
      const token = getToken();
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
  
    if (buyCoinsForm) {
      buyCoinsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = getToken();
        const user_id = getUserId();
        const amountCOP = document.getElementById('amountCOP').value;
        try {
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
          loadWallet();
        } catch (err) {
          console.error('Error al comprar coins:', err);
        }
      });
    }
  
    if (transferCoinsForm) {
      transferCoinsForm.addEventListener('submit', async (e) => {
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
          loadWallet();
        } catch (err) {
          console.error('Error al transferir coins:', err);
        }
      });
    }
  
    loadWallet();
  });  