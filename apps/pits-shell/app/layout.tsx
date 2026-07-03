import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "PITS Shell",
  description: "PITS NextGen Product Shell"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
