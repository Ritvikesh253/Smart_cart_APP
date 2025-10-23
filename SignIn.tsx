import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { LogIn, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const SignIn = () => {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (!email || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (!email.includes('@')) {
        setError('Please enter a valid email');
        setLoading(false);
        return;
      }

      // Mock authentication
      const mockUser = {
        id: Math.random().toString(),
        name: email.split('@')[0],
        email,
        role: email.includes('vendor') ? ('vendor' as const) : ('shop-owner' as const)
      };

      setUser(mockUser);
      toast.success('Welcome back!');
      setLoading(false);
      
      // Navigate based on role
      if (mockUser.role === 'shop-owner') {
        navigate('/shop-dashboard');
      } else {
        navigate('/vendor-dashboard');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              <LogIn className="mr-2 h-4 w-4" />
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </Button>
            </div>

            <div className="pt-4 space-y-2 text-xs text-muted-foreground border-t">
              <p className="font-medium">Test Accounts:</p>
              <p>• Email with "vendor" → Vendor Dashboard</p>
              <p>• Other emails → Shop Owner Dashboard</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
