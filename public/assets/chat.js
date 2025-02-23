/**
 * chat.js
 * Maneja la lógica del chat en tiempo real con Socket.IO.
 * - Carga los chats del usuario (GET /api/chats?userId=..)
 * - Se une a la sala seleccionada
 * - Muestra el historial y mensajes entrantes
 * - Botón "Volver al Dashboard" redirige según rol
 */

document.addEventListener('DOMContentLoaded', () => {
  const socket = io('http://localhost:3000', { auth: { token: getToken() } });
  const chatList = document.getElementById('chatList');
  const chatConversation = document.getElementById('chatConversation');
  const btnSendChat = document.getElementById('btnSendChat');
  const chatMessageInput = document.getElementById('chatMessageInput');
  const btnStartChat = document.getElementById('btnStartChat');
  const btnBackDashboard = document.getElementById('btnBackDashboard');

  let activeRoom = null; // ✅ Control global de la sala activa

  // 🚀 Cargar los chats al iniciar
  loadUserChats();

// 🖱️ Selección de sala desde la lista
chatList.addEventListener('click', (e) => {
  if (e.target.matches('li.list-group-item')) {
    activeRoom = e.target.dataset.room;
    const [fromId, toId] = activeRoom.split('_');
    socket.emit('joinRoom', { fromId: Number(fromId), toId: Number(toId) });

    document.querySelectorAll('li.list-group-item').forEach(li => li.classList.remove('active'));
    e.target.classList.add('active');
  }
});

// 🆕 Iniciar nuevo chat ingresando ID
btnStartChat.addEventListener('click', () => {
  const toId = document.getElementById('newChatId').value.trim();
  if (!toId || isNaN(toId)) return alert('Ingrese un ID válido.');

  const fromId = getUserId();
  activeRoom = `${Math.min(fromId, toId)}_${Math.max(fromId, toId)}`;

  socket.emit('joinRoom', { fromId, toId });

  const newChatItem = document.createElement('li');
  newChatItem.classList.add('list-group-item', 'active');
  newChatItem.setAttribute('data-room', activeRoom);
  newChatItem.textContent = `Sala: ${activeRoom}`;

  document.querySelectorAll('li.list-group-item').forEach(li => li.classList.remove('active'));
  chatList.appendChild(newChatItem);
});

// 📤 Enviar mensaje
btnSendChat.addEventListener('click', () => {
  if (!activeRoom) return alert('⚠️ Seleccione un chat primero.');

  const message = chatMessageInput.value.trim();
  if (!message) return;

  const [fromId, toId] = activeRoom.split('_');
  socket.emit('chatMessage', { fromId: Number(fromId), toId: Number(toId), message });
  chatMessageInput.value = '';
});

// 📝 Renderizar historial de mensajes
socket.on('chatHistory', (history) => {
  chatConversation.innerHTML = history.map(msg => `<div><b>${msg.sender}:</b> ${msg.message}</div>`).join('');
});

// 🛬 Recibir nuevo mensaje en tiempo real
socket.on('chatMessage', ({ sender, message }) => {
  const div = document.createElement('div');
  div.innerHTML = `<b>${sender}:</b> ${message}`;
  chatConversation.appendChild(div);
});

// 📥 Cargar lista de chats desde la API
async function loadUserChats() {
  try {
    const response = await fetch(`http://localhost:3000/api/chats?userId=${getUserId()}`, {
      headers: { 'Authorization': 'Bearer ' + getToken() },
    });
    const { chats } = await response.json();
    renderChatList(chats);
  } catch (err) {
    console.error('❌ Error al cargar chats:', err);
  }
}

// 🗂️ Renderizar lista de chats
function renderChatList(chats) {
  chatList.innerHTML = chats.map(chat => `
    <li class="list-group-item" data-room="${chat.room}">
      Sala: ${chat.room}
    </li>
  `).join('');
}

// 🔙 Redirigir al dashboard según rol
btnBackDashboard.addEventListener('click', () => {
  const role = localStorage.getItem('role');
  window.location.href = role === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
});
});