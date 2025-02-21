/**
 * publications.js
 * Maneja la lógica de la página de publicaciones:
 * - Listar publicaciones
 * - Crear nueva publicación (con imagen y ubicación)
 * - Editar / Eliminar (solo si es autor o admin)
 * - Comentar (implementado)
 */

let map, marker;

document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  initMap();

  const btnLogout = document.getElementById('btnLogoutPublications');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      logout();
    });
  }

  const publicationForm = document.getElementById('publicationForm');
  if (publicationForm) {
    publicationForm.addEventListener('submit', createPublication);
  }

  loadPublications();
});

function initMap() {
  map = L.map('map').setView([4.60971, -74.08175], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

  map.on('click', function(e) {
    const { lat, lng } = e.latlng;
    document.getElementById('pubLatitude').value = lat;
    document.getElementById('pubLongitude').value = lng;
    if (marker) {
      marker.setLatLng(e.latlng);
    } else {
      marker = L.marker(e.latlng).addTo(map);
    }
  });
}

async function loadPublications() {
  const publicationsList = document.getElementById('publicationsList');
  if (!publicationsList) return;
  const token = getToken();
  try {
    const response = await fetch('http://localhost:3000/api/publications', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await response.json();
    publicationsList.innerHTML = '';
    if (data.publications) {
      data.publications.forEach(pub => {
        let pubContent = `<div class="card mb-3 p-3">
          <h5>${pub.title}</h5>
          <p>${pub.description}</p>
          <p>Recompensa: $${pub.reward}</p>
          <p>Creada: ${pub.created_at}</p>`;
        
        // Mostrar imagen si existe
        if (pub.image_path) {
          pubContent += `<img src="../uploads/${pub.image_path}" alt="Imagen" width="150" class="mb-2 d-block">`;
        }
        
        // Mostrar mapa si existen coordenadas
        if (pub.latitude && pub.longitude) {
          pubContent += `<div id="map-${pub.id}" style="height:200px;"></div>`;
        }
        
        // Botones de editar/eliminar si es autor o admin
        const loggedUserId = getUserId();
        const role = getUserRole();
        if (role === 'admin' || pub.user_id == loggedUserId) {
          pubContent += `<button class="btn btn-sm btn-warning me-2" onclick="editPublication(${pub.id})">Editar</button>
                         <button class="btn btn-sm btn-danger" onclick="deletePublication(${pub.id})">Eliminar</button>`;
        }
        
        // Botón para comentar
        pubContent += `<button class="btn btn-sm btn-secondary ms-2" onclick="openCommentModal(${pub.id})">Comentar</button>`;
        
        pubContent += `</div>`;
        publicationsList.innerHTML += pubContent;
        
        // Inicializar mapa para cada publicación con coordenadas
        if (pub.latitude && pub.longitude) {
          setTimeout(() => {
            const mapDiv = document.getElementById(`map-${pub.id}`);
            if (mapDiv) {
              const pubMap = L.map(mapDiv).setView([pub.latitude, pub.longitude], 13);
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(pubMap);
              L.marker([pub.latitude, pub.longitude]).addTo(pubMap);
            }
          }, 100);
        }
      });
    }
  } catch (err) {
    console.error('Error al cargar publicaciones:', err);
  }
}

async function createPublication(e) {
  e.preventDefault();
  const token = getToken();
  const user_id = getUserId();
  const title = document.getElementById('pubTitle').value;
  const description = document.getElementById('pubDescription').value;
  const reward = document.getElementById('pubReward').value;
  const latitude = document.getElementById('pubLatitude').value;
  const longitude = document.getElementById('pubLongitude').value;
  const imageInput = document.getElementById('pubImage');
  
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('reward', reward);
  formData.append('user_id', user_id);
  formData.append('latitude', latitude);
  formData.append('longitude', longitude);
  if (imageInput.files[0]) {
    formData.append('image', imageInput.files[0]);
  }
  
  try {
    const response = await fetch('http://localhost:3000/api/publications', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token },
      body: formData
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.message || 'Error al crear publicación');
      return;
    }
    alert('Publicación creada exitosamente');
    // Cerrar modal y recargar publicaciones
    const modalEl = document.getElementById('newPublicationModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
    loadPublications();
  } catch (err) {
    console.error('Error al crear publicación:', err);
  }
}

function openCommentModal(pubId) {
  const content = prompt('Ingresa tu comentario:');
  if (!content) return;
  createComment(pubId, content);
}

async function createComment(pubId, content) {
  const token = getToken();
  const userId = getUserId();
  try {
    const response = await fetch('http://localhost:3000/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ publication_id: pubId, user_id: userId, content })
    });
    const data = await response.json();
    alert(data.message || 'Comentario creado');
    // Podrías recargar la lista de comentarios si implementas un modal para ello
  } catch (err) {
    console.error('Error al crear comentario:', err);
  }
}

function openComments(pubId) {
  // Llamar GET /api/comments/publication/pubId y mostrar en un modal o en un div
  fetch(`http://localhost:3000/api/comments/publication/${pubId}`, {
    headers: { 'Authorization': 'Bearer ' + getToken() }
  })
  .then(r => r.json())
  .then(data => {
    console.log(data.comments);
    // Renderizar
    alert('Comentarios:\n' + data.comments.map(c => c.content).join('\n'));
  });
}

function editPublication(pubId) {
  const newTitle = prompt('Nuevo título:');
  const newDesc = prompt('Nueva descripción:');
  const newReward = prompt('Nueva recompensa (COP):');
  if (!newTitle || !newDesc || !newReward) return;
  updatePublication(pubId, newTitle, newDesc, Number(newReward));
}

async function updatePublication(pubId, title, description, reward) {
  const token = getToken();
  try {
    const response = await fetch(`http://localhost:3000/api/publications/${pubId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ title, description, reward })
    });
    const data = await response.json();
    alert(data.message || 'Publicación actualizada');
    loadPublications();
  } catch (err) {
    console.error('Error al actualizar publicación:', err);
  }
}

async function deletePublication(pubId) {
  const confirmDelete = confirm('¿Estás seguro de eliminar esta publicación?');
  if (!confirmDelete) return;
  const token = getToken();
  try {
    const response = await fetch(`http://localhost:3000/api/publications/${pubId}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await response.json();
    alert(data.message || 'Publicación eliminada');
    loadPublications();
  } catch (err) {
    console.error('Error al eliminar publicación:', err);
  }
}