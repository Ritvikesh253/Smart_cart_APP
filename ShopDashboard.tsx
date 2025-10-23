import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { MetricCard } from '@/components/MetricCard';
import { Package, ShoppingCart, DollarSign, Grid3x3, Plus, Minus, Trash2, MapPin, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import productVegetables from '@/assets/product-vegetables.jpg';
import productDairy from '@/assets/product-dairy.jpg';
import productBakery from '@/assets/product-bakery.jpg';
import productFruits from '@/assets/product-fruits.jpg';

const productImages: Record<string, string> = {
  'Vegetables': productVegetables,
  'Dairy': productDairy,
  'Bakery': productBakery,
  'Fruits': productFruits
};

export const ShopDashboard = () => {
  const navigate = useNavigate();
  const { user, products, vendors, cart, addToCart, removeFromCart, placeOrder } = useApp();
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'shop-owner') {
      navigate('/signin');
    }
  }, [user, navigate]);

  if (!user) return null;

  const categories = [...new Set(products.map(p => p.category))];
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleAddToCart = (product: typeof products[0]) => {
    setLoading(product.id);
    setTimeout(() => {
      addToCart(product, 1);
      toast.success(`Added ${product.name} to cart`);
      setLoading(null);
    }, 300);
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    placeOrder();
    toast.success('Order placed successfully!');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Available Products"
            value={products.length}
            icon={Package}
            variant="primary"
          />
          <MetricCard
            title="Cart Items"
            value={cart.length}
            icon={ShoppingCart}
            variant="default"
          />
          <MetricCard
            title="Cart Value"
            value={`$${cartTotal.toFixed(2)}`}
            icon={DollarSign}
            variant="success"
          />
          <MetricCard
            title="Categories"
            value={categories.length}
            icon={Grid3x3}
            variant="default"
          />
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Shopping Cart</span>
                <Badge variant="secondary">{cart.length} items</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center justify-between p-4 bg-card rounded-lg">
                  <div className="flex items-center gap-4">
                    <img
                      src={productImages[item.product.category] || productVegetables}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.product.price} × {item.quantity} = ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      removeFromCart(item.productId);
                      toast.success('Removed from cart');
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-1">
                  <p className="text-2xl font-bold">${cartTotal.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                </div>
                <Button size="lg" variant="success" onClick={handlePlaceOrder}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Place Order
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Local Vendors */}
        <Card>
          <CardHeader>
            <CardTitle>Local Vendors</CardTitle>
            <CardDescription>Connect with trusted suppliers in your area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {vendors.map((vendor) => {
                const vendorProducts = products.filter(p => p.vendorId === vendor.id);
                return (
                  <Card key={vendor.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{vendor.name}</CardTitle>
                      <CardDescription>{vendor.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {vendor.location}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {vendor.email}
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-sm font-medium mb-2">{vendorProducts.length} Products Available</p>
                        <div className="flex flex-wrap gap-1">
                          {[...new Set(vendorProducts.map(p => p.category))].map(cat => (
                            <Badge key={cat} variant="secondary" className="text-xs">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Available Products */}
        <Card>
          <CardHeader>
            <CardTitle>Available Products</CardTitle>
            <CardDescription>Browse and add items to your cart</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const vendor = vendors.find(v => v.id === product.vendorId);
                const inCart = cart.find(item => item.productId === product.id);
                
                return (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="aspect-square overflow-hidden bg-secondary">
                      <img
                        src={productImages[product.category] || productVegetables}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">by {vendor?.name}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{product.category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {product.quantity} in stock
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-2xl font-bold text-primary">
                          ${product.price}
                        </span>
                        <Button
                          onClick={() => handleAddToCart(product)}
                          disabled={loading === product.id || product.quantity === 0}
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          {inCart ? `In Cart (${inCart.quantity})` : 'Add to Cart'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShopDashboard;
