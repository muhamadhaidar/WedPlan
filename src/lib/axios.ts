import axios from 'axios';

const api = axios.create({
    // Ini URL Backend Laravel lu (pastikan port 8000 benar)
    baseURL: 'http://127.0.0.1:8000/api', 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export default api;