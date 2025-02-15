import { API_CONFIG } from './api.config';

export class KIDService {
    private static headers = {
        'X-API-Key': API_CONFIG.API_KEY
    };

    static async analyzePDF(file: File): Promise<void> {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANALYZE_PDF}`, {
                method: 'POST',
                headers: this.headers,
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Error analyzing PDF: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error analyzing PDF:', error);
            throw error;
        }
    }

    static async getKIDJson(): Promise<any> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_KID_JSON}`, {
                headers: this.headers
            });

            if (!response.ok) {
                throw new Error(`Error fetching KID JSON: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching KID JSON:', error);
            throw error;
        }
    }
}
