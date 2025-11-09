import { useState } from 'react';
import { User } from '../types';
import { Building2, Mail, User as UserIcon, Loader2 } from 'lucide-react';
import { userApi } from '../services/api';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // If using localStorage mode or API fails, create user locally
      if (useLocalStorage) {
        const user: User = {
          id: Date.now().toString(),
          name: name.trim(),
          email: email.trim(),
        };
        onLogin(user);
      } else {
        // Try to find or create user via API
        const user = await userApi.findOrCreate(name.trim(), email.trim());
        onLogin(user);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to server. Using local mode.');
      
      // Fallback to localStorage mode
      setTimeout(() => {
        const user: User = {
          id: Date.now().toString(),
          name: name.trim(),
          email: email.trim(),
        };
        onLogin(user);
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl mb-4">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Treaty Software
          </h1>
          <p className="text-gray-600">Desk Booking & Social Hub</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                placeholder="john@treaty.com"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="mt-4">
            <label className="flex items-center justify-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useLocalStorage}
                onChange={(e) => setUseLocalStorage(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600">Use local storage only (offline mode)</span>
            </label>
          </div>
        </form>

        <div className="mt-8 p-4 bg-primary-50 rounded-lg">
          <p className="text-sm text-primary-900 text-center">
            <strong>Welcome!</strong> Sign in to book your desk and connect with colleagues
          </p>
        </div>
      </div>
    </div>
  );
}

