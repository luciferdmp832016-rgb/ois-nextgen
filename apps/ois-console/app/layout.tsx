import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "OIS Console",
  description: "OIS NextGen Control Plane"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
