// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css'; // Importa os estilos globais e Tailwind CSS
import Navbar from '@/components/Navbar'; // Importa a Navbar

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Parque Temático',
  description: 'Sistema de Reservas e Filas Virtuais para Parque Temático',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Navbar /> 
        <main className="container mx-auto p-4 bg-white shadow-lg rounded-lg">
          {children} 
        </main>
      </body>
    </html>
  );
}