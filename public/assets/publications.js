/**
 * publications.js
 * Maneja la lógica de la página de publicaciones:
 * - Listar publicaciones
 * - Crear nueva publicación (con imagen y ubicación)
 * - Editar / Eliminar (solo si es autor o admin)
 * - Comentar (ventana emergente)
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

/**
 * Inicializa el mapa Leaflet para capturar ubicación.
 */
function initMap() {
  map = L.map('map').setView([4.60971, -74.08175], 13); // Ej: Bogotá
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

/**
 * Carga las publicaciones desde el backend.
 */
async function loadPublications() {
  const publicationsList = document.getElementById('publicationsList');
  if (!publicationsList) return;

  try {
    const token = getToken();
    const response = await fetch('http://localhost:3000/api/publications', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await response.json();
    publicationsList.innerHTML = '';
    if (data.publications) {
      data.publications.forEach(pub => {
        const pubDiv = document.createElement('div');
        pubDiv.classList.add('card', 'mb-3', 'p-3');

        let pubContent = `<h5>${pub.title}</h5>
          <p>${pub.description}</p>
          <p>Recompensa: $${pub.reward}</p>
          <p>Creada: ${pub.created_at}</p>`;
        
        // Botones de editar/eliminar si es autor o admin
        const loggedUserId = getUserId();
        const role = getUserRole();
        if (role === 'admin' || pub.user_id == loggedUserId) {
          pubContent += `<button class="btn btn-sm btn-warning me-2" onclick="editPublication(${pub.id})">Editar</button>
                         <button class="btn btn-sm btn-danger" onclick="deletePublication(${pub.id})">Eliminar</button>`;
        }

        // Botón para comentar
        pubContent += `<button class="btn btn-sm btn-secondary ms-2" onclick="openComments(${pub.id})">Comentarios</button>`;

        pubDiv.innerHTML = pubContent;
        publicationsList.appendChild(pubDiv);
      });
    }
  } catch (err) {
    console.error('Error al cargar publicaciones:', err);
  }
}

/**
 * Crea una nueva publicación usando FormData para enviar imagen.
 */
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
    modal.hide();
    loadPublications();
  } catch (err) {
    console.error('Error al crear publicación:', err);
  }
}

/**
 * Edita una publicación (mostrar un modal con datos existentes, no implementado aquí).
 */
function editPublication(pubId) {
  alert(`Editar publicación ID: ${pubId} (Función no implementada)`);
}

/**
 * Elimina una publicación.
 */
async function deletePublication(pubId) {
  const confirmDelete = confirm('¿Estás seguro de eliminar esta publicación?');
  if (!confirmDelete) return;

  try {
    const token = getToken();
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

/**
 * Abre la ventana de comentarios para la publicación dada.
 */
function openComments(pubId) {
  alert(`Abrir comentarios para la publicación ID: ${pubId} (Función no implementada)`);
  // Podrías crear un modal para listar y crear comentarios, similar al de publicación
}