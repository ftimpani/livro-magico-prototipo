import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Livro Mágico (protótipo)",
  description: "Transforme a foto da criança em um livro de colorir e atividades.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
