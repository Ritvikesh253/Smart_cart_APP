import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp, UserRole } from '@/contexts/AppContext';
import { UserPlus, AlertCircle, Store, Package } from 'lucide-react';
import { toast } from 'sonner';

export const SignUp = () => {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (!name || !email || !password || !role) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (!email.includes('@')) {
        setError('Please enter a valid email');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      // Mock user creation
      const newUser = {
        id: Math.random().toString(),
        name,
        email,
        role
      };

      setUser(newUser);
      toast.success('Account created successfully!');
      setLoading(false);
      
      // Navigate based on role
      if (role === 'shop-owner') {
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
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Sign up to get started with Smart Cart</CardDescription>
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
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>

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

            <div className="space-y-2">
              <Label>I am a...</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('shop-owner')}
                  disabled={loading}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    role === 'shop-owner'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Store className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Shop Owner</p>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('vendor')}
                  disabled={loading}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    role === 'vendor'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Package className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Vendor</p>
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              <UserPlus className="mr-2 h-4 w-4" />
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => navigate('/signin')}
              >
                Sign In
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
