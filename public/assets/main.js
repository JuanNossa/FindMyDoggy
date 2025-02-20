/**
 * main.js
 * Archivo JavaScript con funciones globales para FindMyDoggy.
 * Aquí puedes colocar utilidades compartidas en todas las páginas.
 */

/**
 * Muestra una alerta con un mensaje.
 * @param {string} message - Mensaje a mostrar en la alerta.
 */
function showAlert(message) {
  alert(message);
}

/**
 * Obtiene el token JWT almacenado en localStorage.
 * @returns {string|null} El token o null si no existe.
 */
function getToken() {
  return localStorage.getItem('token');
}

/**
 * Obtiene el rol del usuario (admin o user) desde localStorage.
 * @returns {string|null} El rol o null si no existe.
 */
function getUserRole() {
  return localStorage.getItem('role');
}

/**
 * Obtiene el ID del usuario logueado desde localStorage.
 * @returns {string|null} El ID del usuario o null si no existe.
 */
function getUserId() {
  return localStorage.getItem('userId');
}

/**
 * Redirige al login si no hay token JWT.
 */
function requireAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = 'index.html';
  }
}

/**
 * Cierra sesión del usuario y limpia localStorage.
 */
function logout() {
  localStorage.clear();
  window.location.href = 'index.html';
}