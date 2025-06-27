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

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-xl text-gray-600 font-medium">Carregando painel de controle...</p>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
            <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md mx-4">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Erro no Sistema</h2>
                <p className="text-red-600 mb-6">Erro: {error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full transition-colors"
                >
                    Recarregar Painel
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
            {/* Header do Admin */}
            <div className="bg-gradient-to-r from-slate-800 via-gray-800 to-slate-900 text-white py-24 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                        Painel de Controle do Parque
                    </h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                {/* Seção de Monitoramento de Filas */}
                <section className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <span className="text-3xl">🎯</span>
                            Situação das Filas por Atração
                        </h2>
                        <p className="text-blue-100 mt-2">Monitoramento em tempo real das filas</p>
                    </div>
                    
                    <div className="p-6">
                        {attractions.length > 0 ? (
                            <div className="space-y-6">
                                <label className="block">
                                    <span className="text-gray-700 font-semibold text-lg mb-3 block flex items-center gap-2">
                                        <span>🎢</span>
                                        Selecione a Atração:
                                    </span>
                                    <select
                                        onChange={(e) => setSelectedAttractionId(e.target.value)}
                                        value={selectedAttractionId || ''}
                                        className="w-full rounded-xl border-2 border-gray-200 shadow-sm p-4 text-lg font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                                    >
                                        {attractions.map(attr => (
                                            <option key={attr.id} value={attr.id}>{attr.nome}</option>
                                        ))}
                                    </select>
                                </label>

                                {selectedAttractionId && queueStatus ? (
                                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                                        <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-3">
                                            <span className="text-3xl">🎡</span>
                                            Fila da {queueStatus.attractionName}
                                        </h3>
                                        
                                        <div className="bg-white rounded-xl p-4 mb-6 shadow-lg">
                                            <div className="flex items-center justify-center gap-4">
                                                <div className="text-center">
                                                    <div className="text-4xl font-bold text-blue-600">{queueStatus.queueSize}</div>
                                                    <div className="text-sm text-gray-600">pessoas na fila</div>
                                                </div>
                                                <div className="text-4xl">👥</div>
                                            </div>
                                        </div>

                                        <h4 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                                            <span>🎫</span>
                                            Próximos a Entrar:
                                        </h4>
                                        
                                        {queueStatus.nextVisitors.length > 0 ? (
                                            <div className="space-y-3">
                                                {queueStatus.nextVisitors.map((v, idx) => (
                                                    <div key={v.queueEntryId || idx} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                                                                    {idx + 1}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-gray-800">{v.visitorName}</div>
                                                                    <div className="text-sm text-gray-500">Visitante</div>
                                                                </div>
                                                            </div>
                                                            <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                                                                v.prioridade === 0 
                                                                    ? 'bg-yellow-100 text-yellow-800' 
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {v.prioridade === 0 ? '⭐ VIP' : '👤 Normal'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="text-6xl mb-4">🎪</div>
                                                <p className="text-gray-600 text-lg">Fila vazia ou nenhum próximo a ser exibido.</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                                        <div className="text-6xl mb-4">🎢</div>
                                        <p className="text-gray-600 text-lg">Selecione uma atração para ver o status da fila.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-8xl mb-6">🎠</div>
                                <p className="text-gray-600 text-xl">Nenhuma atração cadastrada para monitorar.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Seção de Estatísticas */}
                <section className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <span className="text-3xl">📊</span>
                            Estatísticas e Métricas
                        </h2>
                        <p className="text-emerald-100 mt-2">Dados analíticos do parque</p>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Reservas Hoje */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-blue-800">Reservas Hoje</h3>
                                    <span className="text-3xl">📅</span>
                                </div>
                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                    {totalReservationsToday !== null ? totalReservationsToday : (
                                        <div className="animate-pulse bg-blue-200 rounded h-8 w-16"></div>
                                    )}
                                </div>
                                <p className="text-blue-700 text-sm">Total de reservas realizadas</p>
                            </div>

                            {/* Atração Mais Disputada */}
                            <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl p-6 border border-yellow-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-orange-800">Mais Disputada</h3>
                                    <span className="text-3xl">🏆</span>
                                </div>
                                <div className="mb-2">
                                    <div className="text-xl font-bold text-orange-600 mb-1">
                                        {mostPopularAttraction?.mostPopularAttraction || (
                                            <div className="animate-pulse bg-orange-200 rounded h-6 w-32 mb-1"></div>
                                        )}
                                    </div>
                                    <div className="text-sm text-orange-700">
                                        <span className="font-semibold">{mostPopularAttraction?.reservationCount || 0}</span> reservas
                                    </div>
                                </div>
                            </div>

                            {/* Top Visitante */}
                            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-6 border border-purple-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-purple-800">Top Visitante</h3>
                                    <span className="text-3xl">👑</span>
                                </div>
                                <div className="mb-2">
                                    <div className="text-xl font-bold text-purple-600 mb-1">
                                        {topVisitor?.topVisitor || (
                                            <div className="animate-pulse bg-purple-200 rounded h-6 w-32 mb-1"></div>
                                        )}
                                    </div>
                                    <div className="text-sm text-purple-700">
                                        <span className="font-semibold">{topVisitor?.interactionCount || 0}</span> interações
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboardPage;