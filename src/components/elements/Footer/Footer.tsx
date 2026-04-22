import Link from 'next/link';
import { BRAND, CONTACT_INFO, SDG_INFO } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-card/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
              <span className="text-xl font-bold gradient-text">{BRAND.name}</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              {BRAND.tagline}
            </p>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="px-2 py-1 rounded bg-primary/20 text-primary font-medium">
                SDG {SDG_INFO.number}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/#features" className="hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/app" className="hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Connect</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-primary transition-colors">
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://twitter.com/${CONTACT_INFO.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {CONTACT_INFO.twitter}
                </a>
              </li>
              <li>
                <a
                  href={`https://instagram.com/${CONTACT_INFO.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {CONTACT_INFO.instagram}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {BRAND.name}. Built with 💚 for sustainable student living.
          </p>
        </div>
      </div>
    </footer>
  );
}

