const API_URL = 'http://localhost:8081/api';

export const login = async (data: any) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al iniciar sesión. Verifica tus credenciales.');
    return res.json();
};

export const register = async (data: any) => {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al registrar. El correo ya podría estar en uso.');
    return res.json();
};

export const getConvocatorias = async () => {
    const res = await fetch(`${API_URL}/convocatorias`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error('Error obteniendo convocatorias');
    return res.json();
};

export const createConvocatoria = async (data: any) => {
    const res = await fetch(`${API_URL}/convocatorias`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error creando convocatoria');
    return res.json();
};

export const extraerCV = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await fetch(`${API_URL}/postulaciones/extraer-cv`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
    });
    if (!res.ok) throw new Error('Error extrayendo datos del CV');
    // El backend retorna un String que representa un JSON
    const text = await res.text();
    return text;
};

export const crearPostulacion = async (data: any) => {
    const res = await fetch(`${API_URL}/postulaciones`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error enviando la postulación');
    return res.json();
};

export const getRanking = async (convocatoriaId: number) => {
    const res = await fetch(`${API_URL}/postulaciones/convocatoria/${convocatoriaId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error('Error obteniendo el ranking de postulantes');
    return res.json();
};
