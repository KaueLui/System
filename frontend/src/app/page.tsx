"use client";

import React, { useEffect, useState } from 'react';
import AttractionCard from '@/components/AttractionCard';
import { getAttractions, joinQueue, getVisitors } from '@/services/api';
import { Attraction, Visitor } from '@/types';

const HomePage: React.FC = () => {
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loggedInVisitorId, setLoggedInVisitorId] = useState<string | null>(null);
    const [loggedInVisitor, setLoggedInVisitor] = useState<Visitor | null>(null);

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
            fetchVisitorData(storedVisitorId);
        } else {
            console.log("Nenhum ID de visitante salvo. Vá para 'Cadastro de Visitantes' para obter um ID.");
        }

    }, []);

    const fetchVisitorData = async (visitorId: string) => {
        try {
            const visitors = await getVisitors();
            const visitor = visitors.find(v => v.id === visitorId);
            setLoggedInVisitor(visitor || null);
        } catch (err) {
            console.error("Erro ao buscar dados do visitante:", err);
            setLoggedInVisitor(null);
        }
    };

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

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Carregando o Parque</h2>
                <p className="text-gray-500">Preparando as melhores atrações para você...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
            <div className="text-center bg-white p-8 rounded-3xl shadow-2xl max-w-md mx-4">
                <div className="text-red-500 text-8xl mb-4">🚨</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Ops! Algo deu errado</h2>
                <p className="text-red-600 mb-6 text-lg">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold transition-colors shadow-lg hover:shadow-xl"
                >
                    🔄 Tentar Novamente
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            {/* Hero Section Épico */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden relative">
                {/* Efeito de background animado */}
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute top-32 right-20 w-24 h-24 bg-yellow-300/20 rounded-full blur-lg animate-bounce"></div>
                    <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-pink-300/15 rounded-full blur-2xl animate-pulse delay-300"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 py-20">
                    <div className="text-center">
                        <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-white via-yellow-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                            PARQUE
                        </h1>

                        {/* Status do Visitante */}
                        <div className="max-w-2xl mx-auto">
                            {loggedInVisitorId ? (
                                <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-2xl">
                                    <div className="flex items-center justify-center gap-4 mb-4">
                                        <span className="text-4xl">🎟️</span>
                                        <span className="text-2xl font-bold">Bem-vindo de volta!</span>
                                    </div>

                                    {/* Informações do Visitante */}
                                    <div className="mb-4">
                                        {loggedInVisitor ? (
                                            <div className="space-y-3">
                                                <p className="text-blue-100 text-2xl font-bold">
                                                    👤 {loggedInVisitor.nome}
                                                </p>
                                                <p className="text-blue-200 text-lg">
                                                    📧 {loggedInVisitor.email}
                                                </p>
                                                <p className="text-blue-200 text-lg font-bold">
                                                   ID: <span className="font-mono bg-white/20 px-3 py-1 rounded-full">{loggedInVisitorId}</span>
                                                </p>
                                                <div className="flex items-center justify-center gap-2 mt-3">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${loggedInVisitor.tipoIngresso === 'VIP'
                                                            ? 'bg-yellow-400 text-yellow-900'
                                                            : loggedInVisitor.tipoIngresso === 'passe-anual'
                                                                ? 'bg-purple-400 text-purple-900'
                                                                : 'bg-blue-400 text-blue-900'
                                                        }`}>
                                                        {loggedInVisitor.tipoIngresso === 'VIP' && '⭐ '}
                                                        {loggedInVisitor.tipoIngresso}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <p className="text-blue-100 text-xl font-bold">
                                                    🆔 Visitante: <span className="font-mono bg-white/20 px-3 py-1 rounded-full">{loggedInVisitorId}</span>
                                                </p>
                                                <p className="text-blue-200 text-sm">
                                                    (Carregando informações...)
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <a
                                            href="/portal"
                                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                                        >
                                            <span>🎪</span> Meu Portal
                                        </a>
                                        <button
                                            onClick={() => {
                                                localStorage.removeItem('visitorId');
                                                setLoggedInVisitorId(null);
                                                setLoggedInVisitor(null);
                                            }}
                                            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 border border-white/30 flex items-center justify-center gap-2"
                                        >
                                            <span>🚪</span> Sair
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gradient-to-r from-orange-500/90 to-red-500/90 backdrop-blur-md rounded-3xl p-8 border border-orange-300/50 shadow-2xl">
                                    <div className="flex items-center justify-center gap-4 mb-4">
                                        <span className="text-4xl animate-pulse">⚠️</span>
                                        <span className="text-2xl font-bold">Acesso Necessário</span>
                                    </div>
                                    <p className="text-lg mb-6">
                                        Faça seu cadastro para desfrutar de todas as atrações e entrar nas filas!
                                    </p>
                                    <a
                                        href="/visitors"
                                        className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center gap-3"
                                    >
                                        <span className="text-2xl">🎫</span>
                                        Cadastrar Agora
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Seção de Atrações */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                {attractions.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-9xl mb-8 animate-bounce">🎠</div>
                        <h3 className="text-4xl font-bold text-gray-700 mb-6">Parque em Construção</h3>
                        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
                            Estamos preparando atrações incríveis para você! Nossos engenheiros estão trabalhando duro para criar experiências inesquecíveis.
                        </p>
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <a
                                href="/manage-attractions"
                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 inline-flex items-center gap-3"
                            >
                                <span className="text-2xl">🏗️</span>
                                Adicionar Primeira Atração
                            </a>
                            <a
                                href="/visitors"
                                className="bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-3"
                            >
                                <span className="text-2xl">👥</span>
                                Cadastrar Visitantes
                            </a>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Header das Atrações */}
                        <div className="text-center mb-16">
                            <h2 className="text-5xl font-black text-gray-800 mb-6">
                                🎯 {attractions.length} ATRAÇÕES
                            </h2>
                            <div className="w-32 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full"></div>
                        </div>

                        {/* Estatísticas Rápidas */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
                                <div className="text-3xl mb-2">🎢</div>
                                <div className="text-2xl font-bold text-blue-600">{attractions.length}</div>
                                <div className="text-sm text-gray-500">Atrações Totais</div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
                                <div className="text-3xl mb-2">⭐</div>
                                <div className="text-2xl font-bold text-yellow-600">
                                    {attractions.filter(a => a.possuiPrioridade).length}
                                </div>
                                <div className="text-sm text-gray-500">Com Acesso VIP</div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
                                <div className="text-3xl mb-2">👥</div>
                                <div className="text-2xl font-bold text-green-600">
                                    {Math.round(attractions.reduce((acc, a) => acc + a.capacidadePorHorario, 0) / attractions.length)}
                                </div>
                                <div className="text-sm text-gray-500">Capacidade Média</div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
                                <div className="text-3xl mb-2">🎯</div>
                                <div className="text-2xl font-bold text-purple-600">
                                    {Math.min(...attractions.map(a => a.faixaEtariaMinima))}+
                                </div>
                                <div className="text-sm text-gray-500">Idade Mínima</div>
                            </div>
                        </div>

                        {/* Grid de Atrações */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {attractions.map((attraction) => (
                                <AttractionCard
                                    key={attraction.id}
                                    attraction={attraction}
                                    onJoinQueue={handleJoinQueue}
                                    visitorId={loggedInVisitorId}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default HomePage;