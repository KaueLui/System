"use client";

import React, { useEffect, useState } from 'react';
import { getVisitorQueues, getVisitorReservations, getVisitors } from '@/services/api';
import { QueueEntry, Reservation, Visitor } from '@/types';

const VisitorPortalPage: React.FC = () => {
    const [visitorId, setVisitorId] = useState<string | null>(null);
    const [visitor, setVisitor] = useState<Visitor | null>(null);
    const [queues, setQueues] = useState<QueueEntry[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'queues' | 'reservations'>('queues');

    const fetchVisitorData = async (id: string) => {
        try {
            setLoading(true);
            
            // Buscar dados do visitante
            const visitorsData = await getVisitors();
            const visitorData = visitorsData.find(v => v.id === id);
            setVisitor(visitorData || null);

            const queuesData = await getVisitorQueues(id);
            setQueues(queuesData);

            const reservationsData = await getVisitorReservations(id);
            setReservations(reservationsData);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido ao carregar dados do visitante.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedVisitorId = localStorage.getItem('visitorId');
        if (storedVisitorId) {
            setVisitorId(storedVisitorId);
            fetchVisitorData(storedVisitorId);
        } else {
            setError("Nenhum ID de visitante encontrado. Por favor, cadastre-se ou defina um ID na página de Atrações/Cadastro de Visitantes.");
            setLoading(false);
        }
    }, []);

    const getPriorityBadge = (prioridade: number) => {
        return prioridade === 0 ? (
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                <span>⭐</span> VIP
            </span>
        ) : (
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                <span>🎫</span> Normal
            </span>
        );
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            'ativa': { color: 'from-green-400 to-green-500', icon: '✅', label: 'Ativa' },
            'concluida': { color: 'from-gray-400 to-gray-500', icon: '✔️', label: 'Concluída' },
            'cancelada': { color: 'from-red-400 to-red-500', icon: '❌', label: 'Cancelada' }
        };
        
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ativa;
        
        return (
            <span className={`inline-flex items-center gap-1 bg-gradient-to-r ${config.color} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                <span>{config.icon}</span> {config.label}
            </span>
        );
    };

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-xl text-gray-600 font-medium">Carregando seu portal...</p>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
            <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md mx-4">
                <div className="text-red-500 text-6xl mb-4">🚫</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Acesso Negado</h2>
                <p className="text-red-600 mb-6">{error}</p>
                <a 
                    href="/visitors" 
                    className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
                >
                    <span>👤</span>
                    Fazer Cadastro
                </a>
            </div>
        </div>
    );
    
    if (!visitorId) return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
            <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md mx-4">
                <div className="text-orange-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Necessário</h2>
                <p className="text-orange-600 mb-6">Por favor, cadastre um visitante ou insira um ID de visitante para acessar o portal.</p>
                <a 
                    href="/visitors" 
                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
                >
                    <span>🎫</span>
                    Ir para Cadastro
                </a>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">
                        Portal do Visitante
                    </h1>
                    
                    {/* Card do Visitante */}
                    <div className="max-w-2xl mx-auto bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <span className="text-3xl">👤</span>
                            <span className="text-xl font-bold">Bem-vindo!</span>
                        </div>
                        
                        {visitor ? (
                            <div className="space-y-3 mb-6">
                                <p className="text-indigo-100 text-2xl font-bold">
                                    {visitor.nome}
                                </p>
                                <p className="text-indigo-200 text-lg">
                                    📧 {visitor.email}
                                </p>
                                <p className="text-indigo-200 text-lg font-bold">
                                    🆔 ID: <span className="font-mono bg-white/20 px-3 py-1 rounded-full">{visitorId}</span>
                                </p>
                                <div className="flex items-center justify-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                        visitor.tipoIngresso === 'VIP' 
                                            ? 'bg-yellow-400 text-yellow-900' 
                                            : visitor.tipoIngresso === 'passe-anual'
                                            ? 'bg-purple-400 text-purple-900'
                                            : 'bg-blue-400 text-blue-900'
                                    }`}>
                                        {visitor.tipoIngresso === 'VIP' && '⭐ '}
                                        {visitor.tipoIngresso}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="mb-6">
                                <p className="text-indigo-100 text-lg">
                                    <span className="font-medium">ID do Visitante:</span> 
                                    <span className="font-mono font-bold ml-2">{visitorId}</span>
                                </p>
                                <p className="text-indigo-200 text-sm mt-2">
                                    (Carregando informações...)
                                </p>
                            </div>
                        )}
                        
                        <div className="flex items-center justify-center gap-6 text-sm opacity-90">
                            <span className="flex items-center gap-1">
                                <span>🎯</span> {queues.length} filas ativas
                            </span>
                            <span className="flex items-center gap-1">
                                <span>📅</span> {reservations.length} reservas
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Tabs de Navegação */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('queues')}
                            className={`flex-1 py-4 px-6 font-semibold text-lg transition-all duration-300 ${
                                activeTab === 'queues'
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <span className="flex items-center justify-center gap-2">
                                <span>🎯</span>
                                Minhas Filas ({queues.length})
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('reservations')}
                            className={`flex-1 py-4 px-6 font-semibold text-lg transition-all duration-300 ${
                                activeTab === 'reservations'
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <span className="flex items-center justify-center gap-2">
                                <span>📅</span>
                                Minhas Reservas ({reservations.length})
                            </span>
                        </button>
                    </div>

                    {/* Conteúdo das Tabs */}
                    <div className="p-6">
                        {activeTab === 'queues' ? (
                            // Tab de Filas
                            <div>
                                {queues.length === 0 ? (
                                    <div className="text-center py-16">
                                        <div className="text-8xl mb-6">🎢</div>
                                        <h3 className="text-2xl font-bold text-gray-700 mb-4">Nenhuma fila ativa</h3>
                                        <p className="text-gray-500 mb-8">Você não está em nenhuma fila no momento. Que tal explorar as atrações?</p>
                                        <a 
                                            href="/" 
                                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg hover:shadow-xl"
                                        >
                                            <span>🎡</span>
                                            Ver Atrações
                                        </a>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                            <span>🎯</span>
                                            Suas Filas Ativas
                                        </h3>
                                        {queues.map((queue, index) => (
                                            <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <h4 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                                            <span className="text-2xl">🎢</span>
                                                            {queue.attractionName}
                                                        </h4>
                                                        <p className="text-gray-600 text-sm">
                                                            Entrada na fila: {new Date(queue.horaEntrada).toLocaleString('pt-BR')}
                                                        </p>
                                                    </div>
                                                    {getPriorityBadge(queue.prioridade)}
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="bg-white rounded-xl p-4 text-center">
                                                        <div className="text-3xl font-bold text-blue-600 mb-1">
                                                            #{queue.posicaoNaFila}
                                                        </div>
                                                        <div className="text-sm text-blue-500">Posição na Fila</div>
                                                    </div>
                                                    
                                                    <div className="bg-white rounded-xl p-4 text-center">
                                                        <div className="text-2xl font-bold text-green-600 mb-1">
                                                            ~{Math.max(1, queue.posicaoNaFila * 5)} min
                                                        </div>
                                                        <div className="text-sm text-green-500">Tempo Estimado</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Tab de Reservas
                            <div>
                                {reservations.length === 0 ? (
                                    <div className="text-center py-16">
                                        <div className="text-8xl mb-6">📅</div>
                                        <h3 className="text-2xl font-bold text-gray-700 mb-4">Nenhuma reserva encontrada</h3>
                                        <p className="text-gray-500 mb-8">Suas reservas aparecerão aqui quando você entrar em filas.</p>
                                        <a 
                                            href="/" 
                                            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg hover:shadow-xl"
                                        >
                                            <span>🎫</span>
                                            Explorar Atrações
                                        </a>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                            <span>📅</span>
                                            Histórico de Reservas
                                        </h3>
                                        {reservations.map((reservation, index) => (
                                            <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <h4 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                                            <span className="text-2xl">🎡</span>
                                                            {reservation.attractionName}
                                                        </h4>
                                                        <p className="text-gray-600 text-sm mb-1">
                                                            <span className="font-medium">Horário:</span> {reservation.horarioReserva}
                                                        </p>
                                                        <p className="text-gray-600 text-sm">
                                                            <span className="font-medium">Data:</span> {new Date(reservation.dataReserva).toLocaleDateString('pt-BR')}
                                                        </p>
                                                    </div>
                                                    {getStatusBadge(reservation.status)}
                                                </div>
                                                
                                                <div className="bg-white rounded-xl p-4">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-500">ID da Reserva:</span>
                                                        <span className="font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                                            {reservation.id.slice(-12)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Ações Rápidas */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                        🚀 Ações Rápidas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <a 
                            href="/" 
                            className="group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-6 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            <div className="text-center">
                                <div className="text-3xl mb-2">🎢</div>
                                <div className="font-bold">Ver Atrações</div>
                                <div className="text-sm opacity-80 mt-1">Explorar o parque</div>
                            </div>
                        </a>
                        
                        <button 
                            onClick={() => window.location.reload()} 
                            className="group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-6 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            <div className="text-center">
                                <div className="text-3xl mb-2">🔄</div>
                                <div className="font-bold">Atualizar</div>
                                <div className="text-sm opacity-80 mt-1">Dados em tempo real</div>
                            </div>
                        </button>
                        
                        <button 
                            onClick={() => {
                                localStorage.removeItem('visitorId');
                                window.location.href = '/visitors';
                            }} 
                            className="group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-6 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            <div className="text-center">
                                <div className="text-3xl mb-2">🚪</div>
                                <div className="font-bold">Sair</div>
                                <div className="text-sm opacity-80 mt-1">Trocar de conta</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisitorPortalPage;