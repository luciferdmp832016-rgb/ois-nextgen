import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "OIMA",
  description: "OIMA - Organizational Intelligence Meeting Agent, powered by OIS"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
