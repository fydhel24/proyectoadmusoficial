import axios from 'axios';

const whatsappClient = axios.create({
    baseURL: import.meta.env.VITE_WHATSAPP_API_URL || 'https://boot.miracode.tech',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Initialize token from localStorage
const token = typeof window !== 'undefined' ? localStorage.getItem('whatsapp_token') : null;
if (token) {
    whatsappClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default whatsappClient;
