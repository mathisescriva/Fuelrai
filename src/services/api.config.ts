export const API_CONFIG = {
    API_KEY: import.meta.env.VITE_API_KEY,
    BASE_URL: import.meta.env.VITE_API_URL,
    ENDPOINTS: {
        ANALYZE_PDF: '/analyze',
        CHECK_STATUS: '/status',  // Nouvel endpoint pour vérifier le statut
        GET_KID_JSON: '/kid-json'
    }
};
