import { FormEvent, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    if (redirect) return <Navigate to={redirect} replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/account" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedIn =
        mode === 'login'
          ? await login(email, password)
          : await register(name, email, password);

      if (redirect) {
        navigate(redirect);
      } else if (loggedIn.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 pt-24">
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="card p-8 space-y-5">
          <div>
            <h1 className="font-heading text-2xl font-semibold mb-1">
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </h1>
            <p className="text-sm text-text-muted">
              {mode === 'login'
                ? 'Sign in to track orders or manage the store.'
                : 'Register to track your orders and get email updates.'}
            </p>
          </div>

          <div className="flex gap-2 p-1 bg-surface-muted rounded-lg">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-sm font-medium rounded-md ${
                mode === 'login' ? 'bg-surface shadow-sm' : 'text-text-muted'
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-sm font-medium rounded-md ${
                mode === 'register' ? 'bg-surface shadow-sm' : 'text-text-muted'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          {mode === 'register' && (
            <label className="block text-sm">
              <span className="text-text-muted mb-1 block">Full name</span>
              <input
                className="input-field"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          )}

          <label className="block text-sm">
            <span className="text-text-muted mb-1 block">Email</span>
            <input
              type="email"
              className="input-field"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>

          <label className="block text-sm">
            <span className="text-text-muted mb-1 block">Password</span>
            <input
              type="password"
              className="input-field"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </label>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          <Link to="/" className="text-accent hover:underline">
            ← Back to store
          </Link>
        </p>
      </div>
    </div>
  );
}
