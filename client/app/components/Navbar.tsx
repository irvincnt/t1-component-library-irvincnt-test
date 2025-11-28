'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useInteractions } from '../context/InteractionContext';
import Button from './Button';
import { Home, FileText, BarChart3, Download, Activity, Component, MousePointerClick, Moon, Sun, X, Menu } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/docs', label: 'Docs', icon: FileText },
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/exports', label: 'Exports', icon: Download },
  { href: '/status', label: 'Status', icon: Activity },
];

export function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { totalInteractions } = useInteractions();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout, isAuthenticated, user } = useAuthStore();


  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-primary hover:text-primary-hover transition-colors"
          >
            <Component className="w-8 h-8" />
            <span className="hidden sm:inline">T1 Component Library</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium flex items-center gap-2
                  transition-colors duration-[var(--transition-fast)]
                  ${
                    pathname === link.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium">
            <MousePointerClick className="w-4 h-4" />
              <span>{totalInteractions}</span>
            </div> 

            <button
              onClick={toggleTheme}
              className="
                p-2 rounded-[var(--radius-md)]
                text-muted-foreground hover:text-foreground
                hover:bg-secondary
                transition-colors duration-[var(--transition-fast)]
              "
              aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
            >
  {resolvedTheme === 'light' ? (
                <Moon size={20} />
              ) : (
                <Sun size={20} />
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{user?.nombre}</span>
                <Button variant="secondary" onClick={logout} size="sm">Logout</Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="secondary" size="sm">Login</Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="
                md:hidden p-2 rounded-[var(--radius-md)]
                text-muted-foreground hover:text-foreground
                hover:bg-secondary
                transition-colors duration-[var(--transition-fast)]
              "
              aria-label="Toggle menu"
            >
  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-down">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium flex items-center gap-2
                    transition-colors duration-[var(--transition-fast)]
                    ${
                      pathname === link.href
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;


