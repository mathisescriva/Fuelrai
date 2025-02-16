import { verifyCredentials, generateToken, verifyToken, encryptToken, decryptToken } from '../utils/crypto';

// Nombre maximum de tentatives de connexion
const MAX_LOGIN_ATTEMPTS = 5;
// Durée du blocage en millisecondes (15 minutes)
const BLOCK_DURATION = 15 * 60 * 1000;

// Stockage des tentatives de connexion
const loginAttempts: { [ip: string]: { count: number; lastAttempt: number } } = {};

export const authService = {
  async login(username: string, password: string) {
    // Vérification du blocage
    const clientIp = 'client-ip'; // En production, utiliser l'IP réelle du client
    const now = Date.now();
    
    if (loginAttempts[clientIp]) {
      const attempt = loginAttempts[clientIp];
      
      // Si bloqué, vérifie si le blocage est terminé
      if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
        const timeElapsed = now - attempt.lastAttempt;
        if (timeElapsed < BLOCK_DURATION) {
          const remainingTime = Math.ceil((BLOCK_DURATION - timeElapsed) / 60000);
          throw new Error(`Trop de tentatives. Réessayez dans ${remainingTime} minutes.`);
        } else {
          // Réinitialise le compteur après la période de blocage
          delete loginAttempts[clientIp];
        }
      }
    }

    // Vérifie les identifiants
    if (!verifyCredentials(username, password)) {
      // Incrémente le compteur de tentatives
      if (!loginAttempts[clientIp]) {
        loginAttempts[clientIp] = { count: 0, lastAttempt: now };
      }
      loginAttempts[clientIp].count++;
      loginAttempts[clientIp].lastAttempt = now;

      const remainingAttempts = MAX_LOGIN_ATTEMPTS - loginAttempts[clientIp].count;
      throw new Error(`Identifiants invalides. ${remainingAttempts} tentatives restantes.`);
    }

    // Réinitialise le compteur de tentatives en cas de succès
    delete loginAttempts[clientIp];

    // Génère et chiffre le token
    const token = generateToken();
    const encryptedToken = encryptToken(token);
    
    // Stocke le token chiffré
    localStorage.setItem('auth_token', encryptedToken);

    return { user: username };
  },

  logout() {
    localStorage.removeItem('auth_token');
  },

  isAuthenticated(): boolean {
    try {
      const encryptedToken = localStorage.getItem('auth_token');
      if (!encryptedToken) return false;

      const token = decryptToken(encryptedToken);
      return verifyToken(token);
    } catch (error) {
      return false;
    }
  }
};
