"use client";

import React, { useEffect, useState } from 'react';
import {
    getAttractions,
    getAttractionQueueStatus,
    getTotalReservationsToday,
    getMostPopularAttraction,
    getTopVisitor
} from '@/services/api';
import { Attraction, QueueStatusResponse, AnalyticsMostPopularAttraction, AnalyticsTopVisitor } from '@/types';

const AdminDashboardPage: React.FC = () => {
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [selectedAttractionId, setSelectedAttractionId] = useState<string | null>(null);
    const [queueStatus, setQueueStatus] = useState<QueueStatusResponse | null>(null);
    const [totalReservationsToday, setTotalReservationsToday] = useState<number | null>(null);
    const [mostPopularAttraction, setMostPopularAttraction] = useState<AnalyticsMostPopularAttraction | null>(null);
    const [topVisitor, setTopVisitor] = useState<AnalyticsTopVisitor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAttractions = async () => {
            try {
                const data = await getAttractions();
                setAttractions(data);
                if (data.length > 0) {
                    setSelectedAttractionId(data[0].id);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao carregar atrações.');
            } finally {
                setLoading(false);
            }
        };
        fetchAttractions();
    }, []);

    useEffect(() => {
        if (selectedAttractionId) {
            const fetchQueueStatus = async () => {
                try {
                    const data = await getAttractionQueueStatus(selectedAttractionId);
                    setQueueStatus(data);
                } catch (err) {
                    setQueueStatus(null); 
                    console.error(`Erro ao carregar status da fila para ${selectedAttractionId}:`, err);
                }
            };
            fetchQueueStatus();
            const interval = setInterval(fetchQueueStatus, 5000); 
            return () => clearInterval(interval); 
        }
    }, [selectedAttractionId]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const totalRes = await getTotalReservationsToday();
                setTotalReservationsToday(totalRes.totalReservations);

                const popularAttraction = await getMostPopularAttraction();
                setMostPopularAttraction(popularAttraction);

                const topV = await getTopVisitor();
                setTopVisitor(topV);

            } catch (err) {
                console.error("Erro ao carregar analytics:", err);
            }
        };
        fetchAnalytics();
    }, []);


    if (loading) return <div className="text-center py-8">Carregando painel de controle...</div>;
    if (error) return <div className="text-center py-8 text-red-600">Erro: {error}</div>;

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Painel de Controle do Parque</h1>

            <section className="mb-8 p-4 border border-gray-200 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">Situação das Filas por Atração</h2>
                {attractions.length > 0 ? (
                    <label className="block mb-4">
                        <span className="text-gray-700">Selecione a Atração:</span>
                        <select
                            onChange={(e) => setSelectedAttractionId(e.target.value)}
                            value={selectedAttractionId || ''}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                        >
                            {attractions.map(attr => (
                                <option key={attr.id} value={attr.id}>{attr.nome}</option>
                            ))}
                        </select>
                    </label>
                ) : (
                    <p className="text-gray-600">Nenhuma atração cadastrada para monitorar.</p>
                )}

                {selectedAttractionId && queueStatus ? (
                    <div className="mt-4">
                        <h3 className="text-xl font-bold mb-2">Fila da {queueStatus.attractionName}</h3>
                        <p className="mb-2">Tamanho da Fila: <strong className="text-blue-600">{queueStatus.queueSize}</strong> pessoas</p>
                        <h4 className="text-lg font-semibold mb-2">Próximos a Entrar:</h4>
                        {queueStatus.nextVisitors.length > 0 ? (
                            <ul className="list-disc pl-5">
                                {queueStatus.nextVisitors.map((v, idx) => (
                                    <li key={v.queueEntryId || idx} className="text-gray-700">
                                        {idx + 1}. {v.visitorName} (Prioridade: {v.prioridade === 0 ? 'VIP' : 'Normal'})
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600">Fila vazia ou nenhum próximo a ser exibido.</p>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-600">Selecione uma atração para ver o status da fila.</p>
                )}
            </section>

            <section className="p-4 border border-gray-200 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">Estatísticas e Métricas</h2>
                <p className="mb-2">Reservas Totais Hoje: <strong className="text-blue-600">{totalReservationsToday !== null ? totalReservationsToday : 'Carregando...'}</strong></p>
                <p className="mb-2">Atração Mais Disputada: <strong className="text-blue-600">{mostPopularAttraction?.mostPopularAttraction || 'Carregando...'}</strong> (<span className="text-gray-600">{mostPopularAttraction?.reservationCount || 0} reservas</span>)</p>
                <p className="mb-2">Visitante que Mais Usou o Sistema: <strong className="text-blue-600">{topVisitor?.topVisitor || 'Carregando...'}</strong> (<span className="text-gray-600">{topVisitor?.interactionCount || 0} interações</span>)</p>
            </section>
        </div>
    );
};

export default AdminDashboardPage;