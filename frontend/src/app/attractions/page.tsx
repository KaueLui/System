"use client"; 

import React, { useEffect, useState } from 'react';
import AttractionCard from '@/components/AttractionCard';
import { getAttractions, joinQueue } from '@/services/api';
import { Attraction } from '@/types';

const AttractionsPage: React.FC = () => {
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loggedInVisitorId, setLoggedInVisitorId] = useState<string | null>(null); 

    useEffect(() => {
        const fetchAttractions = async () => {
            try {
                const data = await getAttractions();
                setAttractions(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro desconhecido ao carregar atrações.');
            } finally {
                setLoading(false);
            }
        };

        fetchAttractions();

        const storedVisitorId = localStorage.getItem('visitorId');
        if (storedVisitorId) {
            setLoggedInVisitorId(storedVisitorId);
        } else {
            console.log("Nenhum ID de visitante salvo. Vá para 'Cadastro de Visitantes' para obter um ID.");
        }

    }, []);

    const handleJoinQueue = async (attractionId: string) => {
        if (!loggedInVisitorId) {
            alert("Erro: Visitante não logado. Por favor, cadastre-se ou defina seu ID de visitante.");
            return;
        }
        try {
            await joinQueue({ attractionId, visitorId: loggedInVisitorId });
            alert('Você entrou na fila com sucesso!');
        } catch (err) {
            alert(`Falha ao entrar na fila: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        }
    };

    if (loading) return <div className="text-center py-8">Carregando atrações...</div>;
    if (error) return <div className="text-center py-8 text-red-600">Erro: {error}</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-center">Atrações do Parque</h1>
            {loggedInVisitorId ? (
                <p className="text-center mb-4">Logado como Visitante ID: <strong className="text-blue-600">{loggedInVisitorId}</strong> <br/><span className="text-sm text-gray-600"> (Você pode ir ao "Portal do Visitante" para ver suas filas/reservas)</span></p>
            ) : (
                <p className="text-center mb-4 text-orange-600">Não logado como visitante. Faça o cadastro e anote um ID para entrar nas filas.</p>
            )}

            <div className="flex flex-wrap justify-center">
                {attractions.length === 0 ? (
                    <p className="text-center text-gray-600">Nenhuma atração cadastrada ainda.</p>
                ) : (
                    attractions.map((attraction) => (
                        <AttractionCard
                            key={attraction.id}
                            attraction={attraction}
                            onJoinQueue={handleJoinQueue}
                            visitorId={loggedInVisitorId || undefined}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default AttractionsPage;