import { API_CONFIG } from './api.config';

export class KIDService {
    private static baseHeaders = {
        'X-API-Key': API_CONFIG.API_KEY
    };

    private static async sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private static async checkAnalysisStatus(taskId: string, onProgress?: (progress: number) => void): Promise<boolean> {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHECK_STATUS}/${taskId}`,
                {
                    headers: this.baseHeaders
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erreur lors de la vérification du statut:', errorText);
                return false;
            }

            const responseText = await response.text();
            console.log('Réponse brute du statut:', responseText);

            try {
                const data = JSON.parse(responseText);
                console.log('Statut de l\'analyse:', data);
                
                // Mise à jour de la progression
                if (onProgress && typeof data.progress === 'number') {
                    onProgress(data.progress);
                }

                return data.status === 'completed';
            } catch (e) {
                console.error('Erreur lors du parsing du statut:', e);
                return false;
            }
        } catch (error) {
            console.error('Erreur lors de la vérification du statut:', error);
            return false;
        }
    }

    private static async waitForAnalysisCompletion(taskId: string, onProgress?: (progress: number) => void, maxAttempts: number = 60): Promise<boolean> {
        // Vérification toutes les 15 secondes pendant 15 minutes maximum
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            console.log(`Vérification du statut de l'analyse... (${attempt + 1}/${maxAttempts}, ${Math.round((attempt + 1) * 15 / 60)} minutes)`);
            
            const isCompleted = await this.checkAnalysisStatus(taskId, onProgress);
            if (isCompleted) {
                if (onProgress) onProgress(100);
                return true;
            }

            if (attempt < maxAttempts - 1) {
                console.log('Analyse toujours en cours, nouvelle vérification dans 15 secondes...');
                await this.sleep(15000); // 15 secondes entre chaque vérification
            }
        }

        return false;
    }

    static async analyzePDF(file: File, onProgress?: (progress: number) => void): Promise<void> {
        const formData = new FormData();
        formData.append('file', file);

        try {
            console.log('Envoi du PDF pour analyse...');
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANALYZE_PDF}`,
                {
                    method: 'POST',
                    headers: this.baseHeaders,
                    body: formData
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage: string;

                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorData.error || errorText;
                } catch {
                    errorMessage = errorText;
                }

                throw new Error(`Erreur lors de l'envoi du PDF: ${response.status} - ${errorMessage}`);
            }

            const responseText = await response.text();
            console.log('Réponse brute du serveur:', responseText);
            
            let data;
            try {
                data = JSON.parse(responseText);
                console.log('Réponse du serveur (parsed):', data);
            } catch (e) {
                console.error('Erreur lors du parsing de la réponse:', e);
                throw new Error('Réponse du serveur invalide');
            }

            if (data.task_id) {
                console.log('Analyse démarrée, vérification du statut...');
                const isCompleted = await this.waitForAnalysisCompletion(data.task_id, onProgress);
                
                if (!isCompleted) {
                    throw new Error(
                        'L\'analyse est toujours en cours. ' +
                        'Elle peut prendre jusqu\'à 10 minutes. ' +
                        'Vous pouvez vérifier le résultat plus tard en rechargeant la page.'
                    );
                }

                console.log('Analyse terminée avec succès!');
            } else {
                console.error('Réponse complète du serveur:', data);
                throw new Error('Aucun task_id reçu du serveur');
            }
        } catch (error) {
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet et réessayez.');
            }
            throw error;
        }
    }

    static async getKIDJson(): Promise<any> {
        try {
            console.log('Récupération du JSON KID...');
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_KID_JSON}`,
                {
                    method: 'GET',
                    headers: {
                        ...this.baseHeaders,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erreur de réponse:', errorText);
                throw new Error(`Erreur lors de la récupération du JSON: ${response.status} - ${errorText}`);
            }

            const responseText = await response.text();
            console.log('Réponse brute du JSON:', responseText);

            let data;
            try {
                data = JSON.parse(responseText);
                console.log('KID Data received:', data);
            } catch (e) {
                console.error('Failed to parse JSON response:', responseText);
                throw new Error('Invalid JSON response from server');
            }

            // Transformer les données pour correspondre à notre interface
            return {
                ...data,
                costs: {
                    compositionOfCosts: {
                        entryCosts: data.costs?.entryCosts || 0,
                        exitCosts: data.costs?.exitCosts || 0,
                        ongoingCosts: data.costs?.ongoingCosts?.otherOngoingCosts || 0,
                        transactionCosts: data.costs?.ongoingCosts?.portfolioTransactionCosts || 0,
                        incidentalCosts: data.costs?.ongoingCosts?.performanceFees || 0
                    }
                }
            };
        } catch (error) {
            console.error('Error fetching KID JSON:', error);
            throw error;
        }
    }
}
