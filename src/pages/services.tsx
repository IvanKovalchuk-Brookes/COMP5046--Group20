import Link from 'next/link';
import { Containers } from '@/components';
import { BarChart3, Bell, CreditCard, Leaf } from 'lucide-react';

export default function Services() {
  const services = [
    {
      title: 'Subscription Tracking',
      description:
        'Track all subscriptions in one place with pricing, renewal date, and category.',
      icon: CreditCard,
    },
    {
      title: 'Usage Analytics',
      description:
        'See where your monthly budget goes and which services are underused.',
      icon: BarChart3,
    },
    {
      title: 'Renewal Reminders',
      description:
        'Stay ahead of renewals to avoid surprise charges and recurring waste.',
      icon: Bell,
    },
    {
      title: 'Sustainability Insights',
      description:
        'Reduce digital overconsumption and align your choices with SDG 12.',
      icon: Leaf,
    },
  ];

  return (
    <Containers.Layout>
      <Containers.Section
        el={
          <div className="min-h-screen pt-32 pb-24">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                  What <span className="gradient-text">SubWise</span> helps you do
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  A focused toolkit for students to control subscription costs and
                  cut digital waste.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {services.map((service) => (
                  <article key={service.title} className="glass-card">
                    <service.icon className="w-8 h-8 text-primary mb-4" />
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      {service.title}
                    </h2>
                    <p className="text-muted-foreground">{service.description}</p>
                  </article>
                ))}
              </div>

              <div className="glass-card text-center">
                <h2 className="text-2xl font-semibold text-foreground mb-3">
                  Ready to get started?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Create your account and get your first subscription overview in
                  minutes.
                </p>
                <Link
                  href="/signup"
                  className="inline-flex px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all"
                >
                  Try SubWise free
                </Link>
              </div>
            </div>
          </div>
        }
      />
    </Containers.Layout>
  );
}
