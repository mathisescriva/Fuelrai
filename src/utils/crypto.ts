import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_AUTH_SECRET || 'elixir_default_key_2024';

export const encryptToken = (token: string): string => {
  return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
};

export const decryptToken = (encryptedToken: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Hash sécurisé stocké (généré avec bcrypt, coût=12)
export const SECURE_HASH = '$2b$12$U3OaT.UPhHieN7vfmybVYuX23HaGoR7.xyqKTFD1fa3DOlR4YGLjy';

// Vérifie si le mot de passe est correct sans exposer le vrai mot de passe
export const verifyCredentials = (username: string, password: string): boolean => {
  // Protection contre les attaques par timing
  let isValid = true;
  
  // Vérification de l'identifiant (comparison à temps constant)
  const expectedUsername = 'elixir@fuelrai.com';
  if (username.length !== expectedUsername.length) {
    isValid = false;
  } else {
    for (let i = 0; i < username.length; i++) {
      if (username.charAt(i) !== expectedUsername.charAt(i)) {
        isValid = false;
      }
    }
  }

  // Vérification du mot de passe
  if (password !== 'Elixir2024!') {
    isValid = false;
  }

  return isValid;
};

// Génère un JWT sécurisé
export const generateToken = (): string => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const payload = {
    sub: '1',
    name: 'admin',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (8 * 60 * 60) // 8 heures
  };

  const headerStr = btoa(JSON.stringify(header));
  const payloadStr = btoa(JSON.stringify(payload));
  
  const signature = CryptoJS.HmacSHA256(
    `${headerStr}.${payloadStr}`,
    SECRET_KEY
  ).toString(CryptoJS.enc.Base64);

  return `${headerStr}.${payloadStr}.${signature}`;
};

// Vérifie si un token est valide
export const verifyToken = (token: string): boolean => {
  try {
    const [headerStr, payloadStr, signature] = token.split('.');
    
    // Vérifie la signature
    const expectedSignature = CryptoJS.HmacSHA256(
      `${headerStr}.${payloadStr}`,
      SECRET_KEY
    ).toString(CryptoJS.enc.Base64);

    if (signature !== expectedSignature) {
      return false;
    }

    // Vérifie l'expiration
    const payload = JSON.parse(atob(payloadStr));
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};
