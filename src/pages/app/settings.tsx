'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/containers/Layout/AppLayout';
import { useAuth } from '@/lib/auth-context';
import { supabaseBrowserClient } from '@/utils/supabase/client';

type SettingsPreferences = {
  currency: 'GBP' | 'USD' | 'EUR';
  reminderWindowDays: 3 | 7 | 14;
  emailReminders: boolean;
};

const SETTINGS_KEY = 'subwise.settings.v1';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [preferences, setPreferences] = useState<SettingsPreferences>({
    currency: 'GBP',
    reminderWindowDays: 7,
    emailReminders: true,
  });
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({ type: null, text: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name ?? '');
      setUniversity(user.university ?? '');
    }
  }, [user]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<SettingsPreferences>;
      setPreferences((current) => ({
        currency:
          parsed.currency === 'USD' || parsed.currency === 'EUR'
            ? parsed.currency
            : current.currency,
        reminderWindowDays:
          parsed.reminderWindowDays === 3 ||
          parsed.reminderWindowDays === 14 ||
          parsed.reminderWindowDays === 7
            ? parsed.reminderWindowDays
            : current.reminderWindowDays,
        emailReminders:
          typeof parsed.emailReminders === 'boolean'
            ? parsed.emailReminders
            : current.emailReminders,
      }));
    } catch {
      // Ignore malformed local settings and keep defaults.
    }
  }, []);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: null, text: '' });
    setIsSaving(true);

    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(preferences));

      if (user) {
        updateUser({ name: name.trim(), university: university.trim() });
        await supabaseBrowserClient.auth.updateUser({
          data: {
            full_name: name.trim(),
            university: university.trim(),
          },
        });
      }

      setStatus({ type: 'success', text: 'Settings saved successfully.' });
    } catch {
      setStatus({
        type: 'error',
        text: 'Unable to save settings right now. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-3xl">
        <section>
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account details and app preferences.
          </p>
        </section>

        <form className="space-y-6" onSubmit={handleSave}>
          <section className="glass-card space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Profile</h2>
            <div>
              <label htmlFor="name" className="block text-sm mb-2 text-foreground">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-white/10 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="university"
                className="block text-sm mb-2 text-foreground"
              >
                University
              </label>
              <input
                id="university"
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-white/10 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., UTS"
              />
            </div>
          </section>

          <section className="glass-card space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Preferences</h2>
            <div>
              <label
                htmlFor="currency"
                className="block text-sm mb-2 text-foreground"
              >
                Preferred currency
              </label>
              <select
                id="currency"
                value={preferences.currency}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    currency: e.target.value as SettingsPreferences['currency'],
                  }))
                }
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-white/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="GBP">GBP</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="reminderWindowDays"
                className="block text-sm mb-2 text-foreground"
              >
                Renewal reminder window
              </label>
              <select
                id="reminderWindowDays"
                value={preferences.reminderWindowDays}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    reminderWindowDays: Number(e.target.value) as 3 | 7 | 14,
                  }))
                }
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-white/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={3}>3 days before</option>
                <option value={7}>7 days before</option>
                <option value={14}>14 days before</option>
              </select>
            </div>

            <label className="flex items-center gap-3 text-foreground">
              <input
                type="checkbox"
                checked={preferences.emailReminders}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    emailReminders: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-white/20 bg-secondary"
              />
              <span className="text-sm">Enable renewal reminder emails</span>
            </label>
          </section>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save settings'}
            </button>
            {status.type && (
              <p
                className={`text-sm ${
                  status.type === 'success' ? 'text-emerald-400' : 'text-destructive'
                }`}
              >
                {status.text}
              </p>
            )}
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

