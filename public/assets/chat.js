/**
 * chat.js
 * Maneja la lógica del chat en tiempo real con Socket.IO.
 * - Carga los chats del usuario (GET /api/chats?userId=..)
 * - Se une a la sala seleccionada
 * - Muestra el historial y mensajes entrantes
 * - Botón "Volver al Dashboard" redirige según rol
 */

document.addEventListener('DOMContentLoaded', () => {
  const token = getToken();
  if (!token) return;

  const socket = io('http://localhost:3000', { auth: { token } });

  // Botón para volver al dashboard
  const btnBackDashboard = document.getElementById('btnBackDashboard');
  if (btnBackDashboard) {
    btnBackDashboard.addEventListener('click', () => {
      const role = localStorage.getItem('role');
      if (role === 'admin') {
        window.location.href = 'admin-dashboard.html';
      } else {
        window.location.href = 'user-dashboard.html';
      }
    });
  }

  // Cargar lista de chats
  loadUserChats();

  // Renderizar la lista de chats y manejar el click
  const chatList = document.getElementById('chatList');
  if (chatList) {
    chatList.addEventListener('click', function(e) {
      if (e.target && e.target.matches("li.list-group-item")) {
        const room = e.target.getAttribute('data-room');
        socket.emit('joinRoom', room);
        // Marcar activo
        document.querySelectorAll('li.list-group-item').forEach(li => li.classList.remove('active'));
        e.target.classList.add('active');
      }
    });
  }

  // Manejo de envío de mensajes
  const chatMessageInput = document.getElementById('chatMessageInput');
  const btnSendChat = document.getElementById('btnSendChat');
  if (btnSendChat) {
    btnSendChat.addEventListener('click', () => {
      const activeItem = document.querySelector('li.list-group-item.active');
      const room = activeItem ? activeItem.getAttribute('data-room') : 'defaultRoom';
      const sender = getUserId() || 'Desconocido';
      const message = chatMessageInput.value;
      socket.emit('chatMessage', { room, sender, message });
      chatMessageInput.value = '';
    });
  }

  // Recibir historial
  socket.on('chatHistory', (history) => {
    const chatConversation = document.getElementById('chatConversation');
    if (!chatConversation) return;
    chatConversation.innerHTML = '';
    history.forEach(msg => {
      const div = document.createElement('div');
      div.textContent = `${msg.sender}: ${msg.message}`;
      chatConversation.appendChild(div);
    });
  });

  // Recibir mensaje en tiempo real
  socket.on('chatMessage', (data) => {
    const chatConversation = document.getElementById('chatConversation');
    if (!chatConversation) return;
    const div = document.createElement('div');
    div.textContent = `${data.sender}: ${data.message}`;
    chatConversation.appendChild(div);
  });
});

/**
 * Carga la lista de chats (salas) del usuario.
 */
async function loadUserChats() {
  const token = getToken();
  const userId = getUserId();
  if (!userId) return;

  try {
    const response = await fetch(`http://localhost:3000/api/chats?userId=${userId}`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await response.json();
    if (data.chats) {
      renderChatList(data.chats);
    }
  } catch (err) {
    console.error('Error al cargar chats:', err);
  }
}

function renderChatList(chats) {
  const chatList = document.getElementById('chatList');
  if (!chatList) return;
  chatList.innerHTML = '';
  chats.forEach(chat => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.textContent = `Sala: ${chat.room}`;
    li.setAttribute('data-room', chat.room);
    chatList.appendChild(li);
  });
}