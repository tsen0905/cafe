const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const api = {
    get: async (endpoint) => {
        try {
            // Clean double slashes just in case
            const url = `${API_BASE}${endpoint}`.replace(/([^:]\/)\/+/g, "$1");
            const res = await fetch(url);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message || res.statusText);
            return data;
        } catch (err) {
            throw err;
        }
    },

    post: async (endpoint, body) => {
        try {
            const url = `${API_BASE}${endpoint}`.replace(/([^:]\/)\/+/g, "$1");
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message || res.statusText);
            return data;
        } catch (err) {
            throw err;
        }
    },

    put: async (endpoint, body) => {
        try {
            const url = `${API_BASE}${endpoint}`.replace(/([^:]\/)\/+/g, "$1");
            const res = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message || res.statusText);
            return data;
        } catch (err) {
            throw err;
        }
    },

    delete: async (endpoint) => {
        try {
            const url = `${API_BASE}${endpoint}`.replace(/([^:]\/)\/+/g, "$1");
            const res = await fetch(url, { method: 'DELETE' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message || res.statusText);
            return data;
        } catch (err) {
            throw err;
        }
    }
};

export default api;
