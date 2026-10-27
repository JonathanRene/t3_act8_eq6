import { getEvents, addEvent, updateEvent, deleteEvent } from './api.js';

// 1. Protección de ruta y pintado de usuario
const session = localStorage.getItem('authUser');
if (!session) {
    window.location.href = 'index.html';
} else {
    const user = JSON.parse(session);
    document.getElementById('userNameDisplay').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('userImageDisplay').src = user.image;
}

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('authUser');
    window.location.href = 'index.html';
});

// 2. Variables de Estado para la Tabla
let currentPage = 1;
let currentLimit = 10;
let totalItems = 0;
let searchQuery = '';
let eventsData = [];

const tableBody = document.getElementById('tableBody');
const pageInfo = document.getElementById('pageInfo');

// 3. Función para cargar datos
async function loadData() {
    tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Cargando...</td></tr>';
    try {
        const skip = (currentPage - 1) * currentLimit;
        const data = await getEvents(currentLimit, skip, searchQuery);
        eventsData = data.products;
        totalItems = data.total;
        renderTable();
        updatePagination();
        updateURL(); // Reflejar en la URL de la barra de navegación
    } catch (error) {
        tableBody.innerHTML = `<tr><td colspan="4" style="color:red; text-align:center;">${error.message}</td></tr>`;
    }
}

// 4. Renderizar Tabla
function renderTable() {
    tableBody.innerHTML = '';
    if (eventsData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay resultados</td></tr>';
        return;
    }
    
    eventsData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.title}</td>
            <td>${item.category || 'N/A'}</td>
            <td>
                <button class="btn-edit" data-id="${item.id}">Editar</button>
                <button class="btn-delete" data-id="${item.id}">Borrar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Eventos de botones Editar y Borrar
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => openModal(e.target.dataset.id));
    });
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => handleDelete(e.target.dataset.id));
    });
}

// 5. Paginación y Búsqueda
function updatePagination() {
    pageInfo.textContent = `Página ${currentPage}`;
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = (currentPage * currentLimit) >= totalItems;
}

document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; loadData(); }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if ((currentPage * currentLimit) < totalItems) { currentPage++; loadData(); }
});

document.getElementById('limitSelect').addEventListener('change', (e) => {
    currentLimit = parseInt(e.target.value);
    currentPage = 1;
    loadData();
});

document.getElementById('searchBtn').addEventListener('click', () => {
    searchQuery = document.getElementById('searchInput').value;
    currentPage = 1;
    loadData();
});

function updateURL() {
    const newUrl = `${window.location.pathname}?page=${currentPage}&limit=${currentLimit}&search=${searchQuery}`;
    window.history.pushState({}, '', newUrl);
}

// Leer parámetros de la URL al cargar
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('page')) currentPage = parseInt(params.get('page'));
    if (params.has('limit')) {
        currentLimit = parseInt(params.get('limit'));
        document.getElementById('limitSelect').value = currentLimit;
    }
    if (params.has('search')) {
        searchQuery = params.get('search');
        document.getElementById('searchInput').value = searchQuery;
    }
    loadData();
});

// 6. Modal y CRUD
const modal = document.getElementById('eventModal');
const eventForm = document.getElementById('eventForm');
const eventTitle = document.getElementById('eventTitle');
const eventCategory = document.getElementById('eventCategory');
const eventId = document.getElementById('eventId');

document.getElementById('addEventBtn').addEventListener('click', () => openModal());
document.getElementById('closeModalBtn').addEventListener('click', () => modal.style.display = 'none');

function openModal(id = null) {
    modal.style.display = 'flex';
    if (id) {
        document.getElementById('modalTitle').textContent = 'Editar Evento';
        const event = eventsData.find(e => e.id == id);
        eventId.value = event.id;
        eventTitle.value = event.title;
        eventCategory.value = event.category || '';
    } else {
        document.getElementById('modalTitle').textContent = 'Publicar Evento';
        eventForm.reset();
        eventId.value = '';
    }
}

eventForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = { title: eventTitle.value, category: eventCategory.value };
    
    try {
        if (eventId.value) {
            // Actualizar
            const updated = await updateEvent(eventId.value, data);
            eventsData = eventsData.map(ev => ev.id == eventId.value ? updated : ev);
            alert('Editado exitosamente (Simulación)');
        } else {
            // Crear
            const newEvent = await addEvent(data);
            eventsData.unshift(newEvent);
            alert('Agregado exitosamente (Simulación)');
        }
        modal.style.display = 'none';
        renderTable();
    } catch (error) {
        alert('Error al guardar el evento');
    }
});

async function handleDelete(id) {
    if (!confirm('¿Estás seguro de eliminar este evento?')) return;
    try {
        await deleteEvent(id);
        eventsData = eventsData.filter(ev => ev.id != id);
        renderTable();
        alert('Evento eliminado (Simulación)');
    } catch (error) {
        alert('Error al eliminar');
    }
}