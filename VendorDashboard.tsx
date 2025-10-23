import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { MetricCard } from '@/components/MetricCard';
import { Package, ShoppingBag, DollarSign, MessageCircle, Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

export const VendorDashboard = () => {
  const navigate = useNavigate();
  const { user, products, orders, messages, addProduct, updateProduct, deleteProduct } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    image: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'vendor') {
      navigate('/signin');
    }
  }, [user, navigate]);

  if (!user) return null;

  const vendorProducts = products.filter(p => p.vendorId === user.id);
  const vendorOrders = orders.filter(o => o.vendorId === user.id);
  const vendorMessages = messages.filter(m => m.to === user.id);
  const totalRevenue = vendorOrders.reduce((sum, order) => sum + order.total, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.price || !formData.quantity) {
      toast.error('Please fill in all fields');
      return;
    }

    const productData = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      vendorId: user.id,
      image: formData.image || '/src/assets/product-vegetables.jpg'
    };

    if (editingProduct) {
      updateProduct(editingProduct, productData);
      toast.success('Product updated successfully!');
    } else {
      addProduct(productData);
      toast.success('Product added successfully!');
    }

    setFormData({ name: '', category: '', price: '', quantity: '', image: '' });
    setEditingProduct(null);
    setDialogOpen(false);
  };

  const handleEdit = (product: typeof products[0]) => {
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      image: product.image
    });
    setEditingProduct(product.id);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    toast.success('Product deleted successfully!');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Catalog Products"
            value={vendorProducts.length}
            icon={Package}
            variant="primary"
          />
          <MetricCard
            title="Total Orders"
            value={vendorOrders.length}
            icon={ShoppingBag}
            variant="default"
          />
          <MetricCard
            title="Total Revenue"
            value={`$${totalRevenue.toFixed(2)}`}
            icon={DollarSign}
            variant="success"
          />
          <MetricCard
            title="Messages"
            value={vendorMessages.length}
            icon={MessageCircle}
            variant="default"
          />
        </div>

        {/* Product Catalog */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Product Catalog</CardTitle>
                <CardDescription>Manage your product inventory</CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setFormData({ name: '', category: '', price: '', quantity: '', image: '' });
                    setEditingProduct(null);
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                    <DialogDescription>
                      {editingProduct ? 'Update product details' : 'Add a new product to your catalog'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Fresh Organic Vegetables"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Vegetables, Dairy, Bakery, Fruits"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="24.99"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          placeholder="50"
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {vendorProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No products yet</h3>
                <p className="text-muted-foreground mb-4">Start by adding your first product</p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{product.category}</Badge>
                      </TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={product.quantity < 10 ? 'text-destructive font-medium' : ''}>
                          {product.quantity}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Track and manage your orders</CardDescription>
          </CardHeader>
          <CardContent>
            {vendorOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {vendorOrders.map((order) => (
                  <div key={order.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Order #{order.id.slice(0, 8)}</span>
                      <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} items • ${order.total.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Messages */}
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>Communication with shop owners</CardDescription>
          </CardHeader>
          <CardContent>
            {vendorMessages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {vendorMessages.map((message) => (
                  <div key={message.id} className="p-4 border rounded-lg">
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(message.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorDashboard;
