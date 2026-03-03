import axios from 'axios';

const whatsappClient = axios.create({
    baseURL: import.meta.env.VITE_WHATSAPP_API_URL || 'https://boot.miracode.tech',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Initialize token from localStorage on every request (not just at module load)
whatsappClient.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('whatsapp_token') : null;
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// ─── Auto-refresh on 401 ───────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: any) => void; reject: (e: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((p) => {
        if (error) {
            p.reject(error);
        } else {
            p.resolve(token);
        }
    });
    failedQueue = [];
};

whatsappClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Si no es 401 o ya reintentamos esta request, rechazar directamente
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        // Si ya se está refrescando, encolar la request
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                return whatsappClient(originalRequest);
            }).catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            // Re-autenticar con las credenciales almacenadas en .env
            const response = await axios.post(
                `${import.meta.env.VITE_WHATSAPP_API_URL || 'https://boot.miracode.tech'}/auth/login`,
                {
                    email: import.meta.env.VITE_WHATSAPP_TEST_EMAIL,
                    password: import.meta.env.VITE_WHATSAPP_TEST_PASSWORD,
                }
            );

            const newToken = response.data.access_token;
            localStorage.setItem('whatsapp_token', newToken);
            whatsappClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            processQueue(null, newToken);

            // Reintentar la request original con el nuevo token
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return whatsappClient(originalRequest);
        } catch (refreshError) {
            // Si el re-login falla (credenciales incorrectas, servidor caído), limpiar token
            localStorage.removeItem('whatsapp_token');
            delete whatsappClient.defaults.headers.common['Authorization'];
            processQueue(refreshError, null);
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default whatsappClient;
