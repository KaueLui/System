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
    const [filter, setFilter] = useState<'all' | 'vip' | 'family' | 'extreme'>('all');

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

    const getFilteredAttractions = () => {
        switch (filter) {
            case 'vip':
                return attractions.filter(a => a.possuiPrioridade);
            case 'family':
                return attractions.filter(a => a.faixaEtariaMinima <= 6);
            case 'extreme':
                return attractions.filter(a => a.faixaEtariaMinima >= 12);
            default:
                return attractions;
        }
    };

    const filteredAttractions = getFilteredAttractions();

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-xl text-gray-600 font-medium">Carregando atrações...</p>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
            <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md mx-4">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Ops! Algo deu errado</h2>
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition-colors"
                >
                    Tentar Novamente
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                        🎢 Atrações do Parque
                    </h1>
                    <p className="text-xl md:text-2xl opacity-90 mb-8">
                        Descubra aventuras incríveis e momentos inesquecíveis
                    </p>

                    {/* Status do Visitante */}
                    <div className="max-w-2xl mx-auto">
                        {loggedInVisitorId ? (
                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                                <div className="flex items-center justify-center gap-3 mb-2">
                                    <span className="text-2xl">🎟️</span>
                                    <span className="text-lg font-medium">Pronto para a diversão!</span>
                                </div>
                                <p className="text-blue-100 text-lg font-bold mb-3">
                                    ID: <span className="font-mono bg-white/20 px-2 py-1 rounded">{loggedInVisitorId}</span>
                                </p>
                                <div className="flex flex-col md:flex-row gap-3 justify-center">
                                    <a 
                                        href="/portal" 
                                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span>🎪</span> Meu Portal
                                    </a>
                                    <button 
                                        onClick={() => {
                                            localStorage.removeItem('visitorId');
                                            setLoggedInVisitorId(null);
                                        }}
                                        className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-xl font-medium transition-colors border border-white/30 flex items-center justify-center gap-2"
                                    >
                                        <span>🚪</span> Trocar Conta
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-orange-500/90 backdrop-blur-sm rounded-2xl p-6 border border-orange-300">
                                <div className="flex items-center justify-center gap-3 mb-2">
                                    <span className="text-2xl">⚠️</span>
                                    <span className="text-lg font-medium">Visitante não identificado</span>
                                </div>
                                <p className="text-sm mb-4">
                                    Faça seu cadastro para entrar nas filas das atrações!
                                </p>
                                <a 
                                    href="/visitors" 
                                    className="bg-white text-orange-600 hover:bg-orange-50 px-6 py-2 rounded-xl font-medium transition-colors inline-flex items-center gap-2"
                                >
                                    <span>🎫</span> Fazer Cadastro
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Atrações Grid */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                {attractions.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-8xl mb-6 animate-bounce">🎠</div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-4">Nenhuma atração cadastrada ainda</h3>
                        <p className="text-gray-500 mb-8">Que tal começar adicionando algumas atrações incríveis?</p>
                        <a 
                            href="/manage-attractions" 
                            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg hover:shadow-xl"
                        >
                            <span>➕</span>
                            Gerenciar Atrações
                        </a>
                    </div>
                ) : (
                    <>
                        {/* Filtros e Estatísticas */}
                        <div className="mb-12">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                    Explore nossas {attractions.length} atrações
                                </h2>
                                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                            </div>

                            {/* Filtros */}
                            <div className="flex flex-wrap justify-center gap-4 mb-8">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 ${
                                        filter === 'all'
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                    }`}
                                >
                                    <span>🎪</span>
                                    Todas ({attractions.length})
                                </button>
                                <button
                                    onClick={() => setFilter('vip')}
                                    className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 ${
                                        filter === 'vip'
                                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg transform scale-105'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                    }`}
                                >
                                    <span>⭐</span>
                                    VIP ({attractions.filter(a => a.possuiPrioridade).length})
                                </button>
                                <button
                                    onClick={() => setFilter('family')}
                                    className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 ${
                                        filter === 'family'
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                    }`}
                                >
                                    <span>👨‍👩‍👧‍👦</span>
                                    Família ({attractions.filter(a => a.faixaEtariaMinima <= 6).length})
                                </button>
                                <button
                                    onClick={() => setFilter('extreme')}
                                    className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 ${
                                        filter === 'extreme'
                                            ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg transform scale-105'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                    }`}
                                >
                                    <span>⚡</span>
                                    Radical ({attractions.filter(a => a.faixaEtariaMinima >= 12).length})
                                </button>
                            </div>

                            {/* Estatísticas Rápidas */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
                                    <div className="text-2xl mb-2">🎢</div>
                                    <div className="text-xl font-bold text-blue-600">{filteredAttractions.length}</div>
                                    <div className="text-sm text-gray-500">
                                        {filter === 'all' ? 'Total' : 
                                         filter === 'vip' ? 'VIP' :
                                         filter === 'family' ? 'Família' : 'Radical'}
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
                                    <div className="text-2xl mb-2">⭐</div>
                                    <div className="text-xl font-bold text-yellow-600">
                                        {filteredAttractions.filter(a => a.possuiPrioridade).length}
                                    </div>
                                    <div className="text-sm text-gray-500">Com VIP</div>
                                </div>
                                <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
                                    <div className="text-2xl mb-2">👥</div>
                                    <div className="text-xl font-bold text-green-600">
                                        {filteredAttractions.length > 0 
                                            ? Math.round(filteredAttractions.reduce((acc, a) => acc + a.capacidadePorHorario, 0) / filteredAttractions.length)
                                            : 0
                                        }
                                    </div>
                                    <div className="text-sm text-gray-500">Cap. Média</div>
                                </div>
                                <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
                                    <div className="text-2xl mb-2">🎯</div>
                                    <div className="text-xl font-bold text-purple-600">
                                        {filteredAttractions.length > 0 
                                            ? Math.min(...filteredAttractions.map(a => a.faixaEtariaMinima))
                                            : 0
                                        }+
                                    </div>
                                    <div className="text-sm text-gray-500">Idade Min.</div>
                                </div>
                            </div>
                        </div>

                        {/* Grid de Atrações */}
                        {filteredAttractions.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhuma atração encontrada</h3>
                                <p className="text-gray-500 mb-6">
                                    Não encontramos atrações que correspondam ao filtro selecionado.
                                </p>
                                <button
                                    onClick={() => setFilter('all')}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
                                >
                                    Ver Todas as Atrações
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {filteredAttractions.map((attraction) => (
                                    <AttractionCard
                                        key={attraction.id}
                                        attraction={attraction}
                                        onJoinQueue={handleJoinQueue}
                                        visitorId={loggedInVisitorId}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Call to Action */}
                        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white text-center shadow-2xl">
                            <h3 className="text-3xl font-bold mb-6">🎉 Pronto para começar?</h3>
                            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                                {loggedInVisitorId 
                                    ? 'Escolha suas atrações favoritas e entre nas filas agora mesmo!'
                                    : 'Faça seu cadastro para começar a diversão e entrar nas filas!'
                                }
                            </p>
                            <div className="flex flex-col md:flex-row gap-4 justify-center">
                                {!loggedInVisitorId ? (
                                    <>
                                        <a 
                                            href="/visitors" 
                                            className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center gap-3"
                                        >
                                            <span>🎫</span>
                                            Fazer Cadastro
                                        </a>
                                        <a 
                                            href="/portal" 
                                            className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-3"
                                        >
                                            <span>🎪</span>
                                            Portal do Visitante
                                        </a>
                                    </>
                                ) : (
                                    <>
                                        <a 
                                            href="/portal" 
                                            className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center gap-3"
                                        >
                                            <span>🎪</span>
                                            Ver Minhas Filas
                                        </a>
                                        <a 
                                            href="/" 
                                            className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-3"
                                        >
                                            <span>🏠</span>
                                            Voltar ao Início
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AttractionsPage;