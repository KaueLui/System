"use client";

import React, { useState, useEffect } from 'react';
import AttractionForm from '@/components/AttractionForm';
import { createAttraction, getAttractions } from '@/services/api';
import { Attraction } from '@/types'; 

const ManageAttractionsPage: React.FC = () => {
    const [message, setMessage] = useState<string | null>(null);
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAttractions = async () => {
        try {
            setLoading(true);
            const data = await getAttractions();
            setAttractions(data);
        } catch (err) {
            setMessage(`Erro ao carregar atrações: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttractions();
    }, []);

    const handleCreateAttraction = async (formData: Omit<Attraction, 'id'>) => {
        try {
            const newAttraction = await createAttraction(formData);
            setMessage(`Atração "${newAttraction.nome}" cadastrada com sucesso!`);
            fetchAttractions(); 
        } catch (err) {
            setMessage(`Falha ao cadastrar atração: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Gerenciar Atrações</h1>
            {message && <p className={`text-center mb-4 ${message.startsWith('Erro') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}

            <AttractionForm onSubmit={handleCreateAttraction} />

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-center">Atrações Cadastradas</h2>
            {loading ? (
                <p className="text-center text-gray-600">Carregando atrações...</p>
            ) : attractions.length === 0 ? (
                <p className="text-center text-gray-600">Nenhuma atração cadastrada ainda.</p>
            ) : (
                <ul className="list-none p-0 max-w-2xl mx-auto">
                    {attractions.map(attraction => (
                        <li key={attraction.id} className="border border-gray-200 bg-white p-3 mb-2 rounded-md shadow-sm">
                            <strong className="text-lg">{attraction.nome}</strong> ({attraction.tipo})<br />
                            <span className="text-sm text-gray-600">
                                Capacidade: {attraction.capacidadePorHorario} | Idade Mín.: {attraction.faixaEtariaMinima} | Prioridade: {attraction.possuiPrioridade ? 'Sim' : 'Não'}
                                {attraction.possuiPrioridade && ` (${attraction.tiposPassePrioritarios?.join(', ')})`}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ManageAttractionsPage;