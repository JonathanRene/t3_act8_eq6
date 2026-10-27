import { getEvents, addEvent, updateEvent, deleteEvent } from './api.js';

// 1. Protección de ruta
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

// 2. Variables de Estado
let currentPage = 1;
let currentLimit = 10;
let totalItems = 0;
let searchQuery = '';
let categoryQuery = '';
let eventsData = [];

const tableBody = document.getElementById('tableBody');
const pageInfo = document.getElementById('pageInfo');

// --- SISTEMA DE MODALES PERSONALIZADOS ---
function showAlert(msg) {
    document.getElementById('alertMessage').textContent = msg;
    document.getElementById('alertModal').style.display = 'flex';
}
document.getElementById('closeAlertBtn').addEventListener('click', () => {
    document.getElementById('alertModal').style.display = 'none';
});

let currentConfirmCallback = null;
function showConfirm(msg, callback) {
    document.getElementById('confirmMessage').textContent = msg;
    currentConfirmCallback = callback;
    document.getElementById('confirmModal').style.display = 'flex';
}
document.getElementById('cancelConfirmBtn').addEventListener('click', () => {
    document.getElementById('confirmModal').style.display = 'none';
    currentConfirmCallback = null;
});
document.getElementById('acceptConfirmBtn').addEventListener('click', () => {
    document.getElementById('confirmModal').style.display = 'none';
    if (currentConfirmCallback) currentConfirmCallback();
});
// -----------------------------------------

// 3. Cargar datos
async function loadData() {
    tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Cargando...</td></tr>';
    try {
        const skip = (currentPage - 1) * currentLimit;
        const data = await getEvents(currentLimit, skip, searchQuery);
        eventsData = data.products;
        totalItems = data.total;
        renderTable();
        updatePagination();
        updateURL();
    } catch (error) {
        tableBody.innerHTML = `<tr><td colspan="4" style="color:red; text-align:center;">${error.message}</td></tr>`;
    }
}

// 4. Renderizar Tabla (con filtro de categoría local)
function renderTable() {
    tableBody.innerHTML = '';
    
    const filteredData = categoryQuery 
        ? eventsData.filter(item => item.category === categoryQuery)
        : eventsData;

    if (filteredData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay resultados</td></tr>';
        return;
    }
    
    filteredData.forEach(item => {
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

document.getElementById('prevBtn').addEventListener('click', () => { if (currentPage > 1) { currentPage--; loadData(); } });
document.getElementById('nextBtn').addEventListener('click', () => { if ((currentPage * currentLimit) < totalItems) { currentPage++; loadData(); } });
document.getElementById('limitSelect').addEventListener('change', (e) => { currentLimit = parseInt(e.target.value); currentPage = 1; loadData(); });

document.getElementById('searchBtn').addEventListener('click', () => {
    searchQuery = document.getElementById('searchInput').value.trim();
    categoryQuery = document.getElementById('categoryFilter').value;
    currentPage = 1;
    loadData();
});

function updateURL() {
    const newUrl = `${window.location.pathname}?page=${currentPage}&limit=${currentLimit}&search=${searchQuery}&category=${categoryQuery}`;
    window.history.pushState({}, '', newUrl);
}

// Leer parámetros de URL al cargar
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
    if (params.has('category')) {
        categoryQuery = params.get('category');
        document.getElementById('categoryFilter').value = categoryQuery;
    }
    loadData();
});

// 6. Modal de CRUD con emojis
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
            const updated = await updateEvent(eventId.value, data);
            eventsData = eventsData.map(ev => ev.id == eventId.value ? updated : ev);
            showAlert('Evento editado exitosamente ✅'); 
        } else {
            const newEvent = await addEvent(data);
            eventsData.unshift(newEvent);
            showAlert('Evento publicado exitosamente ✅'); 
        }
        modal.style.display = 'none';
        renderTable();
    } catch (error) {
        showAlert('Error al guardar el evento ❌');
    }
});

function handleDelete(id) {
    showConfirm('¿Estás seguro de eliminar este evento?', async () => {
        try {
            await deleteEvent(id);
            eventsData = eventsData.filter(ev => ev.id != id);
            renderTable();
            showAlert('Evento eliminado 🗑️');
        } catch (error) {
            showAlert('Error al eliminar ❌');
        }
    });
}