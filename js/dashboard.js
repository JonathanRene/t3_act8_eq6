<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OaxacaVive - Sistema</title>
    <link rel="stylesheet" href="./css/dashboard.css">
</head>
<body>
    <div class="layout">
        <!-- Sidebar -->
        <aside class="sidebar">
            <h2 class="sidebar-logo"><span>Oaxaca</span><span class="highlight">Vive</span></h2>
            <nav class="sidebar-nav">
                <ul>
                    <li><a href="#">Inicio</a></li>
                    <li><a href="#">Eventos</a></li>
                    <li><a href="#">Mapa</a></li>
                    <li><a href="#">Favoritos</a></li>
                </ul>
            </nav>
            <button id="logoutBtn" class="logout-btn">Cerrar sesión</button>
        </aside>

        <!-- Main Content -->
        <div class="main-content">
            <!-- Navbar -->
            <header class="navbar">
                <div class="search-bar">
                    <input type="text" id="searchInput" placeholder="Buscar eventos...">
                    <!-- NUEVO: Filtro por categoría -->
                    <select id="categoryFilter" style="padding: 0.6rem; border-radius: 20px; border: 1px solid #ccc; margin-left: 5px; outline: none;">
                        <option value="">Todas las categorías</option>
                        <option value="beauty">Belleza</option>
                        <option value="fragrances">Fragancias</option>
                        <option value="furniture">Muebles</option>
                        <option value="groceries">Despensa</option>
                    </select>
                    <button id="searchBtn">Buscar</button>
                </div>
                <div class="user-profile">
                    <div class="user-info">
                        <strong id="userNameDisplay">Cargando...</strong>
                        <span>Administrador</span>
                    </div>
                    <img id="userImageDisplay" src="" alt="Perfil" class="user-avatar">
                </div>
            </header>

            <main class="dashboard-body">
                <!-- Hero Banner -->
                <div class="hero-banner">
                    <div class="hero-text">
                        <h1>Descubre<br><span>la cultura de Oaxaca</span></h1>
                        <p>Encuentra calendas, conciertos, eventos culturales y mucho más...</p>
                        <button class="explore-btn">Explorar eventos</button>
                    </div>
                    <div class="hero-image">
                        <img src="./assets/img/oaxaca-templo.png" alt="Oaxaca" class="banner-img">
                    </div>
                </div>

                <!-- Controles de tabla -->
                <div class="table-controls">
                    <h3>Listado de Eventos</h3>
                    <button id="addEventBtn" class="add-btn">+ Publicar evento</button>
                </div>

                <!-- Tabla de datos -->
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título del Evento</th>
                            <th>Categoría</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tableBody">
                        <tr><td colspan="4" style="text-align:center;">Cargando datos...</td></tr>
                    </tbody>
                </table>

                <!-- Paginación -->
                <div class="pagination">
                    <button id="prevBtn">Anterior</button>
                    <span id="pageInfo">Página 1</span>
                    <button id="nextBtn">Siguiente</button>
                    <!-- NUEVO: Opción de 40 agregada -->
                    <select id="limitSelect">
                        <option value="10">10 por pág.</option>
                        <option value="20">20 por pág.</option>
                        <option value="40">40 por pág.</option>
                        <option value="50">50 por pág.</option>
                    </select>
                </div>
            </main>
        </div>
    </div>

    <!-- MODAL 1: Formulario CRUD -->
    <div id="eventModal" class="modal">
        <div class="modal-content">
            <h2 id="modalTitle">Publicar Evento</h2>
            <form id="eventForm">
                <input type="hidden" id="eventId">
                <label>Nombre del Evento</label>
                <input type="text" id="eventTitle" required>
                <label>Categoría (beauty, fragrances, etc.)</label>
                <input type="text" id="eventCategory" required>
                <div class="modal-actions">
                    <button type="button" id="closeModalBtn" class="cancel-btn">Cancelar</button>
                    <button type="submit" class="save-btn">Guardar</button>
                </div>
            </form>
        </div>
    </div>

    <!-- MODAL 2: Confirmación Visual (Reemplaza window.confirm) -->
    <div id="confirmModal" class="modal" style="z-index: 1000;">
        <div class="modal-content" style="width: 350px; text-align: center;">
            <h3 id="confirmMessage" style="margin-bottom: 1.5rem; color: #6A4A3C;">¿Estás seguro?</h3>
            <div class="modal-actions" style="justify-content: center;">
                <button type="button" id="cancelConfirmBtn" class="cancel-btn">Cancelar</button>
                <button type="button" id="acceptConfirmBtn" class="save-btn" style="background: #ffcccc; color: #cc0000;">Eliminar</button>
            </div>
        </div>
    </div>

    <!-- MODAL 3: Alerta Visual (Reemplaza alert()) -->
    <div id="alertModal" class="modal" style="z-index: 2000;">
        <div class="modal-content" style="width: 300px; text-align: center;">
            <h3 id="alertMessage" style="margin-bottom: 1.5rem; color: #6A4A3C;">Mensaje</h3>
            <button type="button" id="closeAlertBtn" class="save-btn">Aceptar</button>
        </div>
    </div>

    <script type="module" src="./js/dashboard.js"></script>
</body>
</html>