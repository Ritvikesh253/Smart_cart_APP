import { ShoppingCart, LogOut, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user, setUser, cart } = useApp();
  const navigate = useNavigate();

  const handleSignOut = () => {
    setUser(null);
    navigate('/');
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <ShoppingCart className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Smart Cart
          </span>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({user.role === 'shop-owner' ? 'Shop Owner' : 'Vendor'})
                </span>
              </div>
              {user.role === 'shop-owner' && cart.length > 0 && (
                <div className="relative">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate('/shop-dashboard')}
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                </div>
              )}
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/signin')}>
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              <Button size="sm" onClick={() => navigate('/signup')}>
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
