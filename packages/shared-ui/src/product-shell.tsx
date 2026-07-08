"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { LanguageSelector, LocalizationProvider, useLocalization } from "./localization-context";
import { localizeNavLabel } from "./localization";

export type ProductShellNavItem = {
  id: string;
  href: string;
  label: string;
  shortLabel?: string | undefined;
};

export type ProductShellProps = {
  active: string;
  productName: string;
  productCode: string;
  productContext: string;
  navAriaLabel: string;
  navItems: ProductShellNavItem[];
  demoBanner: string;
  coreApiUrl: string;
  healthOk: boolean;
  healthLabel: string;
  children: ReactNode;
};

export function ModernProductShell(props: ProductShellProps) {
  return (
    <LocalizationProvider>
      <ModernProductShellFrame {...props} />
    </LocalizationProvider>
  );
}

function ModernProductShellFrame({
  active,
  productName,
  productCode,
  productContext,
  navAriaLabel,
  navItems,
  demoBanner,
  coreApiUrl,
  healthOk,
  healthLabel,
  children
}: ProductShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { locale, t } = useLocalization();
  const navOpen = drawerOpen || !collapsed;
  const shellClassName = [
    "modern-shell",
    collapsed ? "shell-collapsed" : "",
    drawerOpen ? "shell-drawer-open" : ""
  ]
    .filter(Boolean)
    .join(" ");
  const localizedProductContext =
    productContext === "Product Administration"
      ? t("shell.productAdministration")
      : productContext === "Product Runtime"
        ? t("shell.productRuntime")
        : productContext;
  const localizedHealthLabel =
    healthLabel === "Core API healthy"
      ? t("shell.coreApiHealthy")
      : healthLabel === "Needs owner review"
        ? t("shell.needsOwnerReview")
        : healthLabel;

  return (
    <main
      className={shellClassName}
      data-shell-standard="Modern Shell Layout"
      data-shell-navigation="Fixed Navigation Shell"
      data-shell-responsive="Responsive Product Shell"
      data-localization-foundation="Localization Foundation"
    >
      <aside className="shell-sidebar" aria-label={navAriaLabel}>
        <div className="shell-brand">
          <span className="eyebrow">{localizedProductContext}</span>
          <h1>{productName}</h1>
          <p>{productCode}</p>
        </div>
        <nav className="shell-nav" aria-label={navAriaLabel}>
          {navItems.map((item) => {
            const localizedLabel = localizeNavLabel(item.id, item.label, locale);

            return (
              <a
                aria-current={active === item.id ? "page" : undefined}
                aria-label={localizedLabel}
                className={active === item.id ? "active" : ""}
                href={item.href}
                key={item.id}
              >
                <span className="nav-label">{localizedLabel}</span>
                <span aria-hidden="true" className="nav-short">
                  {item.shortLabel ?? localizedLabel.slice(0, 2)}
                </span>
              </a>
            );
          })}
        </nav>
        <div className="shell-sidebar-actions">
          <button
            aria-controls="product-shell-content"
            aria-expanded={navOpen}
            className="shell-toggle-button"
            data-shell-toggle="Shell Navigation Toggle"
            onClick={() => setCollapsed((current) => !current)}
            type="button"
          >
            <span className="toggle-label">{collapsed ? t("shell.showNav") : t("shell.hideNav")}</span>
            <span aria-hidden="true" className="toggle-short">
              Nav
            </span>
          </button>
        </div>
      </aside>

      <button aria-label="Close navigation" className="shell-backdrop" onClick={() => setDrawerOpen(false)} type="button" />

      <section className="shell-main" id="product-shell-content">
        <header className="shell-topbar">
          <div className="shell-topbar-primary">
            <button
              aria-controls="product-shell-content"
              aria-expanded={drawerOpen}
              className="shell-menu-button"
              onClick={() => setDrawerOpen((current) => !current)}
              type="button"
            >
              {t("shell.menu")}
            </button>
            <div>
              <div className="demo">{demoBanner}</div>
              <p className="source-line">
                {t("shell.coreApiSource")}: {coreApiUrl}
              </p>
            </div>
          </div>
          <div className="shell-topbar-status">
            <LanguageSelector />
            <span className={healthOk ? "status status-ok" : "status status-warn"}>{localizedHealthLabel}</span>
            <span className="shell-context">{productCode}</span>
          </div>
        </header>
        <section className="shell-content" aria-label={`${productName} content`}>
          <div className="shell-content-inner">{children}</div>
        </section>
        <footer className="shell-bottom-bar" aria-label="Product shell standard">
          <span>Modern Shell Layout</span>
          <span>Shell Navigation Toggle</span>
          <span>Fixed Navigation Shell</span>
          <span>Responsive Product Shell</span>
          <span>Owner-first Design System</span>
          <span>Visual Hierarchy Standard</span>
          <span>Owner-friendly Status Badges</span>
          <span>Localization Foundation</span>
          <span>Language Settings</span>
          <span>English</span>
          <span>Tiếng Việt</span>
        </footer>
      </section>
    </main>
  );
}
