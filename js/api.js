const BASE_AUTH = 'https://dummyjson.com/auth';
const BASE_API = 'https://dummyjson.com/products';

export const loginUser = async (username, password) => {
    const response = await fetch(`${BASE_AUTH}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, expiresInMins: 60 }),
    });
    if (!response.ok) throw new Error('Usuario o contraseña incorrectos');
    return response.json();
};

export const getEvents = async (limit = 10, skip = 0, search = '') => {
    const url = search 
        ? `${BASE_API}/search?q=${search}&limit=${limit}&skip=${skip}`
        : `${BASE_API}?limit=${limit}&skip=${skip}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al cargar datos');
    return response.json();
};

export const addEvent = async (data) => {
    const response = await fetch(`${BASE_API}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const updateEvent = async (id, data) => {
    const response = await fetch(`${BASE_API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const deleteEvent = async (id) => {
    const response = await fetch(`${BASE_API}/${id}`, {
        method: 'DELETE',
    });
    return response.json();
};