# FindMyDoggy

Proyecto para facilitar la búsqueda y recuperación de mascotas extraviadas.  
Implementado en Node.js con TypeScript, utilizando MySQL (XAMPP/phpMyAdmin), JWT, Socket.IO y Bootstrap para el front‑end.

---

## Requisitos Previos

- **XAMPP** (para MySQL y phpMyAdmin)  
- **Node.js** (v14+ o v16+)  
- **Postman** (opcional, para probar la API)  

---

## Instalación

1. **Instalar XAMPP**  
   Descarga e instala XAMPP desde su sitio oficial. Asegúrate de habilitar el servicio de MySQL y, opcionalmente, Apache si deseas un servidor local adicional.

2. **Clonar o copiar el proyecto**  
   Copia todos los archivos del proyecto "FindMyDoggy" en una carpeta local. Por ejemplo: C:\proyectos\FindMyDoggy 


3. **Instalar dependencias**  
    Abre una terminal en la carpeta del proyecto y ejecuta:
    ```bash
    npm install
    
    Esto descargará todos los módulos requeridos.

4. **Configurar variables de entorno (.env)**
    Crea un archivo .env en la raíz del proyecto con el siguiente contenido (puedes ajustar las variables según tu entorno):
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=findmydoggy_db
    JWT_SECRET=secretKey
    PORT=3000

    DB_HOST, DB_USER, DB_PASSWORD y DB_NAME se refieren a tu instalación de MySQL.
    JWT_SECRET es la clave para firmar los tokens JWT.
    PORT es el puerto en el que correrá la aplicación.

5. **Crear la base de datos y tablas**
    Abre phpMyAdmin (generalmente en http://localhost/phpmyadmin) y ejecuta el siguiente script SQL:
    
    CREATE DATABASE IF NOT EXISTS findmydoggy_db;
    USE findmydoggy_db;

    CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user'
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    description VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS publications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    reward DECIMAL(10,2) DEFAULT 0.00,
    user_id INT NOT NULL,
    location_id INT,
    image_path VARCHAR(255) NULL,
    latitude DECIMAL(10,8) NULL,
    longitude DECIMAL(11,8) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS wallets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    balance DECIMAL(10,2) DEFAULT 0.00,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    publication_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (publication_id) REFERENCES publications(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wallet_id INT NOT NULL,
    type ENUM('credit', 'debit') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room VARCHAR(100) NOT NULL,
    sender VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;


6. **Compilar y arrancar el servidor**
    En la terminal, ejecuta:
    npx tsc
    node dist/server.js

7. **Acceder al Front-end**
    Abre tu navegador y visita http://localhost:3000/index.html para ver la página de Login.

    Como el proyecto sirve la carpeta public estáticamente, puedes navegar a http://localhost:3000/user-dashboard.html, http://localhost:3000/admin-dashboard.html, etc., según tus archivos HTML.


