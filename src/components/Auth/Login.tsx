import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Erreur de connexion. Vérifiez vos identifiants.');
    }
  };

  return (
    <div className="flex-1 w-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="w-[95%] h-[95vh] max-w-7xl bg-white rounded-2xl shadow-xl overflow-hidden flex">
        <div className="flex-1 flex flex-col md:flex-row h-full">
          {/* Section gauche - Image/Logo */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col items-center justify-center text-white p-12">
            <div className="flex flex-col items-center max-w-lg">
              <h1 className="text-4xl font-bold mb-6">Elixir.ai</h1>
              <p className="text-lg text-center text-blue-100 mb-8">
                Analysez et comparez vos KIDs en toute simplicité
              </p>
              <div className="w-full">
                <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                  <p className="text-sm text-blue-100">
                    Plateforme sécurisée pour l'analyse et la comparaison de vos documents KID.
                    Accédez à des analyses détaillées et des visualisations interactives.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section droite - Formulaire de connexion */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-12">
            <div className="w-full max-w-md space-y-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Connexion
              </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Se connecter
              </button>
            </div>
          </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
