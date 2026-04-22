'use client';

import { AppLayout } from '@/components/containers/Layout/AppLayout';
import { formatGbp } from '@/lib/format-currency';
import { useSubscriptionsQuery } from '@/hooks/useSubscriptionsQuery';
import { Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  const { subscriptions: subs, loading, error, refetch } = useSubscriptionsQuery();

  const costByCategory = subs.reduce<Record<string, number>>((acc, sub) => {
    acc[sub.category] = (acc[sub.category] ?? 0) + sub.monthlyCost;
    return acc;
  }, {});

  const totalMonthly = subs.reduce((sum, s) => sum + s.monthlyCost, 0);
  const totalHours = subs.reduce((sum, s) => sum + s.usageHours, 0);

  const categories = Object.entries(costByCategory).sort((a, b) => b[1] - a[1]);
  const maxCost = Math.max(...categories.map(([, v]) => v), 1);

  return (
    <AppLayout>
      <div className="space-y-8 max-w-4xl">
        <section>
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="text-muted-foreground">
            Monthly spend by category (GBP) and usage overview.
          </p>
        </section>

        {error && (
          <div className="glass-card border-destructive/30 bg-destructive/10 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-destructive">{error}</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-2 text-sm text-primary hover:underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {loading && !error && (
          <div className="flex items-center gap-2 text-muted-foreground py-8">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading analytics…
          </div>
        )}

        {!loading && !error && subs.length === 0 && (
          <p className="text-muted-foreground">
            Add subscriptions to see spend by category.{' '}
            <Link href="/app/subscriptions/" className="text-primary hover:underline">
              Go to Subscriptions
            </Link>
          </p>
        )}

        {!loading && !error && subs.length > 0 && (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-card">
                <p className="text-sm text-muted-foreground">Total monthly (all subs)</p>
                <p className="text-2xl font-bold text-foreground">{formatGbp(totalMonthly)}</p>
              </div>
              <div className="glass-card">
                <p className="text-sm text-muted-foreground">Logged hours / month</p>
                <p className="text-2xl font-bold text-foreground">{totalHours.toFixed(1)}</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Spend by category</h2>
              <div className="space-y-4">
                {categories.map(([category, amount]) => (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize text-foreground">{category}</span>
                      <span className="text-muted-foreground">{formatGbp(amount)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${(amount / maxCost) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </AppLayout>
  );
}
