import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { LogIn, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiRequest } from '@/lib/queryClient';

type AdminSession = {
  success: boolean;
  configured: boolean;
  mode: 'off' | 'replit' | 'custom';
  authenticated: boolean;
  loginUrl: string | null;
};

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/admin/session', { credentials: 'include' })
      .then(res => res.json())
      .then((data: AdminSession) => {
        setSession(data);
        if (data.authenticated) navigate('/admin/blog', { replace: true });
      })
      .catch(() => setError('Admin session could not be checked.'));
  }, [navigate]);

  const submitCustomLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await apiRequest('POST', '/api/admin/login', { username, password });
      navigate('/admin/blog');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const replitLoginUrl = session?.loginUrl || '/api/login';

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 flex items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-normal">Blog Admin</h1>
            <p className="text-sm text-slate-600">Healing Minds Psychiatry</p>
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {session?.mode === 'custom' ? (
          <form className="mt-6 space-y-4" onSubmit={submitCustomLogin}>
            <div className="space-y-2">
              <Label htmlFor="admin-username">Username</Label>
              <Input
                id="admin-username"
                value={username}
                onChange={event => setUsername(event.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
              {submitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        ) : (
          <div className="mt-6 space-y-4">
            <p className="text-sm leading-6 text-slate-600">
              Use the configured Replit admin authentication to access the editorial panel.
            </p>
            <Button asChild className="w-full">
              <a href={replitLoginUrl}>
                <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
                Sign in with Replit
              </a>
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
