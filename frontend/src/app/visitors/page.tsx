"use client";

import React, { useState, useEffect } from 'react';
import VisitorForm from '@/components/VisitorForm';
import { createVisitor, getVisitors } from '@/services/api';
import { Visitor } from '@/types';

const VisitorsPage: React.FC = () => {
    const [message, setMessage] = useState<string | null>(null);
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchVisitors = async () => {
        try {
            setLoading(true);
            const data = await getVisitors();
            setVisitors(data);
        } catch (err) {
            setMessage(`Erro ao carregar visitantes: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisitors();
    }, []);

    const handleCreateVisitor = async (formData: Omit<Visitor, 'id'>) => {
        try {
            const newVisitor = await createVisitor(formData);
            setMessage(`Visitante "${newVisitor.nome}" cadastrado com sucesso! ID: ${newVisitor.id}`);
            fetchVisitors();
            localStorage.setItem('visitorId', newVisitor.id);
        } catch (err) {
            setMessage(`Falha ao cadastrar visitante: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Cadastro de Visitantes</h1>
            {message && <p className={`text-center mb-4 ${message.startsWith('Erro') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
            <VisitorForm onSubmit={handleCreateVisitor} />

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-center">Visitantes Cadastrados</h2>
            {loading ? (
                <p className="text-center text-gray-600">Carregando visitantes...</p>
            ) : visitors.length === 0 ? (
                <p className="text-center text-gray-600">Nenhum visitante cadastrado ainda.</p>
            ) : (
                <ul className="list-none p-0 max-w-2xl mx-auto">
                    {visitors.map(visitor => (
                        <li key={visitor.id} className="border border-gray-200 bg-white p-3 mb-2 rounded-md shadow-sm">
                            <strong className="text-lg">{visitor.nome}</strong> ({visitor.tipoIngresso})<br />
                            <span className="text-sm text-gray-600">CPF: {visitor.cpf} | E-mail: {visitor.email} | ID: {visitor.id}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default VisitorsPage;