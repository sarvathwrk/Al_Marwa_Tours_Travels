'use client';

import { ChevronDown, ChevronRight, ExternalLink, Globe, House, Inbox, LayoutDashboard, LoaderCircle, LogOut, Menu, Settings, Users, X } from 'lucide-react';
import Link, { useLinkStatus } from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import { logout } from '@/app/admin/actions';
import { breadcrumb, isActive, leafHref, NAV, type IconName, type NavState } from './nav';

/** Spinner shown inside a menu link while the page it points to is loading. */
function LinkSpinner() {
  const { pending } = useLinkStatus();
  return pending ? <LoaderCircle aria-hidden className="ml-auto size-4 shrink-0 animate-spin" /> : null;
}

const ICONS: Record<IconName, typeof Menu> = { dashboard: LayoutDashboard, customers: Users, inbox: Inbox, website: Globe, settings: Settings };

/** CRM frame: sidebar with expandable submenus (drawer on phones), top bar with breadcrumb, footer. */
export default function AdminShell({ state, newCount, username, children }: { state: NavState; newCount: number; username: string; children: ReactNode }) {
  const [drawer, setDrawer] = useState(false);
  const activeParent = NAV.find((i) => i.children?.some((c) => isActive(c, state)))?.label;
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => (activeParent ? { [activeParent]: true } : {}));
  const crumbs = breadcrumb(state);

  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawer(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawer]);

  // Keep the group of the current page open after navigating from a link elsewhere.
  useEffect(() => {
    if (activeParent) setOpenGroups((g) => (g[activeParent] ? g : { ...g, [activeParent]: true }));
  }, [activeParent]);

  const closeDrawer = () => setDrawer(false);
  const newBadge = (
    <span className="ml-auto rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold leading-none text-kiswa" aria-label={`${newCount} new`}>
      {newCount}
    </span>
  );

  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[272px_minmax(0,1fr)]">
      {drawer && <button type="button" aria-label="Close menu" onClick={closeDrawer} className="fixed inset-0 z-40 bg-black/55 lg:hidden" />}

      <aside
        id="admin-sidebar"
        aria-label="Admin menu"
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-kiswa text-white transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-svh lg:w-auto lg:translate-x-0 lg:visible ${
          drawer ? 'visible translate-x-0' : 'invisible -translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-5 pb-4 pt-5">
          <Link href="/admin?tab=dashboard" onClick={closeDrawer} aria-label="Admin dashboard">
            {/* eslint-disable-next-line @next/next/no-img-element -- static SVG */}
            <img src="/brand/header-logo-en-white.svg" alt="Al Marwa Tours & Travels" width={490.55} height={100} className="h-9 w-auto" />
          </Link>
          <button type="button" onClick={closeDrawer} aria-label="Close menu" className="grid size-9 place-items-center rounded-full text-white/70 hover:bg-white/10 lg:hidden">
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <div className="hizam" aria-hidden />

        <nav aria-label="Admin sections" className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
          <ul className="grid gap-1">
            {NAV.map((item) => {
              const Icon = ICONS[item.icon];
              if (!item.children) {
                const on = isActive(item, state);
                return (
                  <li key={item.label}>
                    <Link
                      href={`/admin?tab=${item.tab}`}
                      onClick={closeDrawer}
                      aria-current={on ? 'page' : undefined}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-semibold transition-colors ${on ? 'bg-gold text-kiswa' : 'text-white/85 hover:bg-white/10'}`}
                    >
                      <Icon aria-hidden className="size-[18px] shrink-0" />
                      {item.label}
                      <LinkSpinner />
                    </Link>
                  </li>
                );
              }
              const open = !!openGroups[item.label];
              const hasActive = item.label === activeParent;
              const groupBadge = item.icon === 'inbox' && newCount > 0 && !open;
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`menu-${item.icon}`}
                    onClick={() => setOpenGroups((g) => ({ ...g, [item.label]: !g[item.label] }))}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] font-semibold transition-colors hover:bg-white/10 ${hasActive ? 'text-gold' : 'text-white/85'}`}
                  >
                    <Icon aria-hidden className="size-[18px] shrink-0" />
                    {item.label}
                    {groupBadge && newBadge}
                    <ChevronDown aria-hidden className={`size-4 shrink-0 transition-transform ${groupBadge ? '' : 'ml-auto'} ${open ? 'rotate-180' : ''}`} />
                  </button>
                  {open && (
                    <ul id={`menu-${item.icon}`} className="ml-[22px] mt-1 grid gap-0.5 border-l border-white/15 pl-3">
                      {item.children.map((c) => {
                        const on = isActive(c, state);
                        return (
                          <li key={c.label + (c.type ?? '') + (c.status ?? '')}>
                            <Link
                              href={leafHref(c)}
                              onClick={closeDrawer}
                              aria-current={on ? 'page' : undefined}
                              className={`flex items-center rounded-lg px-3 py-2 text-sm transition-colors ${on ? 'bg-white/12 font-semibold text-gold' : 'text-white/70 hover:bg-white/8 hover:text-white'}`}
                            >
                              {c.label}
                              {c.badge === 'newEnquiries' && newCount > 0 && newBadge}
                              <LinkSpinner />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-gold/20 text-base font-bold uppercase text-gold">
              {username.slice(0, 1)}
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-semibold">{username}</p>
              <p className="text-xs text-white/50">Administrator</p>
            </div>
            <form action={logout}>
              <button type="submit" aria-label="Log out" title="Log out" className="grid size-10 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-gold">
                <LogOut aria-hidden className="size-[18px]" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="flex min-h-svh min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-white/85 px-4 backdrop-blur sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setDrawer(true)}
            aria-label="Open menu"
            aria-expanded={drawer}
            aria-controls="admin-sidebar"
            className="grid size-10 place-items-center rounded-full border border-edge text-haram lg:hidden"
          >
            <Menu aria-hidden className="size-5" />
          </button>
          <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
            <ol className="flex items-center gap-1.5 text-sm">
              {crumbs.map((c, i) => {
                const last = i === crumbs.length - 1;
                return (
                  <li key={c.label} className={`flex min-w-0 items-center gap-1.5 ${i === 0 && !last ? 'max-sm:hidden' : ''} ${i === 1 && crumbs.length === 3 ? 'max-sm:hidden' : ''}`}>
                    {i > 0 && <ChevronRight aria-hidden className="size-3.5 shrink-0 text-muted/60 max-sm:hidden" />}
                    {c.href && !last ? (
                      <Link href={c.href} className="inline-flex items-center gap-1.5 rounded-md py-1 text-muted transition-colors hover:text-haram">
                        {i === 0 && <House aria-hidden className="size-4" />}
                        {c.label}
                      </Link>
                    ) : (
                      <span aria-current={last ? 'page' : undefined} className={`truncate py-1 ${last ? 'font-semibold text-haram' : 'text-muted'}`}>
                        {c.label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
          <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 rounded-full border border-edge px-3.5 py-2 text-sm font-semibold text-haram transition-colors hover:border-haram">
            <span className="hidden sm:inline">View website</span>
            <span className="sm:hidden">Site</span>
            <ExternalLink aria-hidden className="size-3.5" />
          </Link>
        </header>

        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1760px] content-start gap-5">{children}</div>
        </main>

        <footer className="border-t border-line bg-white/70 px-4 py-4 text-sm text-muted sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1760px] flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <p>© {new Date().getFullYear()} Al Marwa Tours &amp; Travels · Website admin</p>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <li>
                <Link href="/en" target="_blank" className="hover:text-haram">
                  English site
                </Link>
              </li>
              <li>
                <Link href="/ta" target="_blank" className="hover:text-haram">
                  Tamil site
                </Link>
              </li>
              <li>
                <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-haram">
                  Back to top ↑
                </button>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </div>
  );
}
