"use client"; 

import Link from 'next/link';
import React from 'react';

const Navbar: React.FC = () => {
    return (
        <nav className="p-4 bg-gray-100 border-b border-gray-300 mb-6 shadow-sm">
            <ul className="flex justify-center space-x-8 list-none p-0 m-0">
                <li>
                    <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium px-3 py-2 rounded-md hover:bg-gray-200 transition-colors">
                        Atrações
                    </Link>
                </li>
                <li>
                    <Link href="/visitors" className="text-blue-600 hover:text-blue-800 font-medium px-3 py-2 rounded-md hover:bg-gray-200 transition-colors">
                        Cadastro de Visitantes
                    </Link>
                </li>
                <li>
                    <Link href="/portal" className="text-blue-600 hover:text-blue-800 font-medium px-3 py-2 rounded-md hover:bg-gray-200 transition-colors">
                        Portal do Visitante
                    </Link>
                </li>
                <li>
                    <Link href="/admin" className="text-blue-600 hover:text-blue-800 font-medium px-3 py-2 rounded-md hover:bg-gray-200 transition-colors">
                        Painel de Controle (Admin)
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;