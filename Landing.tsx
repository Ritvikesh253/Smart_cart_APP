import { Store, Package, BarChart3, Bell, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import heroDashboard from '@/assets/hero-dashboard.jpg';

export const Landing = () => {
  const navigate = useNavigate();

  const roles = [
    {
      title: 'Shop Owner',
      icon: Store,
      description: 'Manage your inventory, connect with vendors, and track your cart in real-time',
      features: [
        'Browse products from multiple vendors',
        'Smart cart management',
        'Real-time inventory tracking',
        'Direct vendor messaging'
      ],
      action: () => navigate('/signup')
    },
    {
      title: 'Vendor',
      icon: Package,
      description: 'List your products, manage orders, and grow your business',
      features: [
        'Product catalog management',
        'Order tracking & fulfillment',
        'Revenue analytics',
        'Customer communication'
      ],
      action: () => navigate('/signup')
    }
  ];

  const features = [
    {
      title: 'Real-time Analytics',
      description: 'Track your inventory, sales, and performance with live dashboards',
      icon: BarChart3,
      color: 'primary'
    },
    {
      title: 'Smart Alerts',
      description: 'Get notified about low stock, new orders, and important updates',
      icon: Bell,
      color: 'success'
    },
    {
      title: 'Direct Messaging',
      description: 'Communicate directly with vendors or shop owners instantly',
      icon: MessageCircle,
      color: 'primary'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Smart Inventory
                <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Management
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Connect shop owners with vendors through an intelligent platform that simplifies inventory management and ordering
              </p>
              <div className="flex gap-4">
                <Button size="lg" onClick={() => navigate('/signup')}>
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/signin')}>
                  Sign In
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-2xl transform rotate-3" />
              <img
                src={heroDashboard}
                alt="Dashboard Preview"
                className="relative rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Role</h2>
          <p className="text-lg text-muted-foreground">
            Get started with the platform that fits your needs
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {roles.map((role) => (
            <Card key={role.title} className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <role.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">{role.title}</CardTitle>
                <CardDescription className="text-base">{role.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {role.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" onClick={role.action}>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to manage your inventory efficiently
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-6 space-y-4">
                  <div className={`mx-auto p-4 rounded-full w-fit ${
                    feature.color === 'success' ? 'bg-accent/10' : 'bg-primary/10'
                  }`}>
                    <feature.icon className={`h-8 w-8 ${
                      feature.color === 'success' ? 'text-accent' : 'text-primary'
                    }`} />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Transform Your Inventory Management?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Join thousands of shop owners and vendors using Smart Cart to streamline their operations
            </p>
            <Button size="lg" variant="secondary" onClick={() => navigate('/signup')}>
              Start Free Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Landing;
