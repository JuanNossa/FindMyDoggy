/**
 * chat.js
 * Maneja la lógica del chat en tiempo real con Socket.IO
 */

document.addEventListener('DOMContentLoaded', () => {
    requireAuth();
    const token = getToken();
    if (!token) {
      return;
    }
  
    // Conectar con Socket.IO, enviando el token en el handshake
    const socket = io('http://localhost:3000', { auth: { token } });
  
    const chatList = document.getElementById('chatList');
    const chatConversation = document.getElementById('chatConversation');
    const chatMessageInput = document.getElementById('chatMessageInput');
    const btnSendChat = document.getElementById('btnSendChat');
  
    // Escuchar cuando el usuario seleccione un chat de la lista
    if (chatList) {
      chatList.addEventListener('click', function(e) {
        if (e.target && e.target.matches("li.list-group-item")) {
          const room = e.target.getAttribute('data-room');
          socket.emit('joinRoom', room);
          // Marcar el elemento como activo
          document.querySelectorAll('li.list-group-item').forEach(li => li.classList.remove('active'));
          e.target.classList.add('active');
        }
      });
    }
  
    // Manejar envío de mensajes
    if (btnSendChat) {
      btnSendChat.addEventListener('click', () => {
        const room = document.querySelector('li.list-group-item.active')?.getAttribute('data-room') || 'defaultRoom';
        const sender = getUserId() || 'Desconocido';
        const message = chatMessageInput.value;
        socket.emit('chatMessage', { room, sender, message });
        chatMessageInput.value = '';
      });
    }
  
    // Escuchar mensajes entrantes
    socket.on('chatMessage', (data) => {
      const msgDiv = document.createElement('div');
      msgDiv.textContent = `${data.sender}: ${data.message}`;
      chatConversation.appendChild(msgDiv);
    });
  
    // Historial de chat
    socket.on('chatHistory', (history) => {
      chatConversation.innerHTML = '';
      history.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.textContent = `${msg.sender}: ${msg.message}`;
        chatConversation.appendChild(msgDiv);
      });
    });
  });  