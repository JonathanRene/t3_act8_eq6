<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OaxacaVive - Panel de Eventos</title>
    <!-- Ruta relativa limpia -->
    <link rel="stylesheet" href="./css/dashboard.css">
</head>
<body>
    <div class="dashboard-layout">
        <!-- Sidebar -->
        <aside class="sidebar">
            <h2>OaxacaVive</h2>
            <nav>
                <ul>
                    <li><a href="#" class="active">Inicio</a></li>
                    <li><a href="#">Eventos</a></li>
                    <li><a href="#">Mapa</a></li>
                    <li><a href="#">Favoritos</a></li>
                </ul>
            </nav>
            <div class="user-profile">
                <img id="userImageDisplay" src="" alt="Avatar" style="width: 40px; border-radius: 50%;">
                <span id="userNameDisplay">Cargando...</span>
                <button id="logoutBtn" class="btn-logout">Salir</button>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <header class="top-bar">
                <h1>Listado de Eventos</h1>
                <button id="addEventBtn" class="btn-primary">+ Publicar evento</button>
            </header>

            <!-- Filtros y Búsqueda -->
            <section class="filters-section">
                <input type="text" id="searchInput" placeholder="Buscar por título...">
                <select id="categoryFilter">
                    <option value="">Todas las categorías</option>
                    <option value="beauty">Beauty</option>
                    <option value="fragrances">Fragrances</option>
                    <option value="furniture">Furniture</option>
                    <option value="groceries">Groceries</option>
                </select>
                <button id="searchBtn" class="btn-secondary">Filtrar</button>
            </section>

            <!-- Tabla de Datos -->
            <section class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título del Evento</th>
                            <th>Categoría</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tableBody">
                        <!-- Dinámico -->
                    </tbody>
                </table>
            </section>

            <!-- Paginación -->
            <footer class="pagination-footer">
                <button id="prevBtn" class="btn-page">Anterior</button>
                <span id="pageInfo">Página 1</span>
                <button id="nextBtn" class="btn-page">Siguiente</button>
                <select id="limitSelect">
                    <option value="5">5 por página</option>
                    <option value="10" selected>10 por página</option>
                    <option value="20">20 por página</option>
                </select>
            </footer>
        </main>
    </div>

    <!-- Modal CRUD -->
    <div id="eventModal" class="modal" style="display: none;">
        <div class="modal-content">
            <h3 id="modalTitle">Publicar Evento</h3>
            <form id="eventForm">
                <input type="hidden" id="eventId">
                <label>Título:</label>
                <input type="text" id="eventTitle" required>
                <label>Categoría:</label>
                <input type="text" id="eventCategory" required placeholder="Ej. beauty">
                <div class="modal-buttons">
                    <button type="submit" class="btn-save">Guardar</button>
                    <button type="button" id="closeModalBtn" class="btn-cancel">Cancelar</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal Alerta -->
    <div id="alertModal" class="modal" style="display: none;">
        <div class="modal-content text-center">
            <p id="alertMessage">Mensaje</p>
            <button id="closeAlertBtn" class="btn-primary">Aceptar</button>
        </div>
    </div>

    <!-- Modal Confirmación -->
    <div id="confirmModal" class="modal" style="display: none;">
        <div class="modal-content text-center">
            <p id="confirmMessage">¿Estás seguro?</p>
            <div class="modal-buttons">
                <button id="acceptConfirmBtn" class="btn-save">Sí</button>
                <button id="cancelConfirmBtn" class="btn-cancel">No</button>
            </div>
        </div>
    </div>

    <script type="module" src="./js/dashboard.js"></script>
</body>
</html>