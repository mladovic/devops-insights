import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/layout/NavBar";
import { SettingsProvider } from "@/context/SettingsContext";

export const metadata: Metadata = {
  title: "DevOps Insights",
  description: "Review your DevOps metrics and insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <SettingsProvider>
          <NavBar />
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
