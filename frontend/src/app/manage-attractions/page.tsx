"use client";

import React, { useState, useEffect } from 'react';
import AttractionForm from '@/components/AttractionForm';
import { createAttraction, getAttractions, updateAttraction, deleteAttraction } from '@/services/api';
import { Attraction } from '@/types'; 

const ManageAttractionsPage: React.FC = () => {
    const [message, setMessage] = useState<string | null>(null);
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAttraction, setEditingAttraction] = useState<Attraction | null>(null);

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

    const handleFormSubmit = async (formData: Omit<Attraction, 'id'>) => {
        try {
            if (editingAttraction) {
                const updated = await updateAttraction(editingAttraction.id, formData);
                setMessage(`Atração "${updated.nome}" atualizada com sucesso!`);
            } else {
                const newAttraction = await createAttraction(formData);
                setMessage(`Atração "${newAttraction.nome}" cadastrada com sucesso!`);
            }
            fetchAttractions();
            setShowForm(false);
            setEditingAttraction(null);
        } catch (err) {
            setMessage(`Falha ao salvar atração: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        }
    };

    const handleEdit = (attraction: Attraction) => {
        setEditingAttraction(attraction);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir esta atração?")) {
            try {
                await deleteAttraction(id);
                setMessage("Atração excluída com sucesso!");
                fetchAttractions();
            } catch (err) {
                setMessage(`Falha ao excluir atração: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
            }
        }
    };

    const handleCancelEdit = () => {
        setShowForm(false);
        setEditingAttraction(null);
    };

    const getAttractionIcon = (tipo: string) => {
        const icons: { [key: string]: string } = {
            'montanha-russa': '🎢',
            'roda-gigante': '🎡',
            'carrossel': '🎠',
            'casa-assombrada': '👻',
            'aquático': '🌊',
            'infantil': '🧸',
            'radical': '⚡',
            'default': '🎪'
        };
        return icons[tipo.toLowerCase()] || icons.default;
    };

    const getAttractionColor = (tipo: string) => {
        const colors: { [key: string]: string } = {
            'montanha-russa': 'from-red-500 to-red-600',
            'roda-gigante': 'from-blue-500 to-blue-600',
            'carrossel': 'from-pink-500 to-pink-600',
            'casa-assombrada': 'from-purple-500 to-purple-600',
            'aquático': 'from-cyan-500 to-cyan-600',
            'infantil': 'from-green-500 to-green-600',
            'radical': 'from-orange-500 to-orange-600',
            'default': 'from-gray-500 to-gray-600'
        };
        return colors[tipo.toLowerCase()] || colors.default;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                        Gerenciar Atrações
                    </h1>
                    
                    {!showForm ? (
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center gap-3 bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                        >
                            <span className="text-2xl">➕</span>
                            Cadastrar Nova Atração
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowForm(false)}
                            className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium hover:bg-white/30 transition-all duration-300"
                        >
                            <span>✖️</span>
                            Fechar Formulário
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Mensagem de Status */}
                {message && (
                    <div className={`max-w-2xl mx-auto mb-8 p-6 rounded-2xl shadow-lg ${
                        message.includes('sucesso') 
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
                            : 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200'
                    }`}>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">
                                {message.includes('sucesso') ? '✅' : '❌'}
                            </span>
                            <p className={`${
                                message.includes('sucesso') ? 'text-green-700' : 'text-red-700'
                            } font-medium`}>
                                {message}
                            </p>
                        </div>
                    </div>
                )}

                {/* Formulário de Cadastro */}
                {showForm && (
                    <div className="mb-12">
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-2xl mx-auto">
                            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white text-center">
                                <h2 className="text-2xl font-bold">{editingAttraction ? 'Editar Atração' : 'Nova Atração'}</h2>
                                <p className="opacity-90 mt-2">{editingAttraction ? 'Atualize os detalhes da experiência.' : 'Configure uma nova experiência para os visitantes!'}</p>
                            </div>
                            <div className="p-8">
                                <AttractionForm onSubmit={handleFormSubmit} initialData={editingAttraction || undefined} onCancel={handleCancelEdit} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Lista de Atrações */}
                <div className="bg-white rounded-3xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
                            <span>🎠</span>
                            Atrações Cadastradas ({attractions.length})
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
                            <p className="text-xl text-gray-600 font-medium">Carregando atrações...</p>
                        </div>
                    ) : attractions.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-8xl mb-6">🎪</div>
                            <h3 className="text-2xl font-bold text-gray-700 mb-4">Nenhuma atração cadastrada ainda</h3>
                            <p className="text-gray-500 mb-8">Que tal criar a primeira atração do parque?</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg hover:shadow-xl"
                            >
                                <span>➕</span>
                                Criar Primeira Atração
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {attractions.map(attraction => (
                                <div key={attraction.id} className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-200 transform hover:-translate-y-1">
                                    {/* Header do Card */}
                                    <div className={`bg-gradient-to-r ${getAttractionColor(attraction.tipo)} p-6 text-white relative`}>
                                        {attraction.possuiPrioridade && (
                                            <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                                                ⭐ VIP
                                            </div>
                                        )}
                                        <div className="text-center">
                                            <div className="text-4xl mb-2">{getAttractionIcon(attraction.tipo)}</div>
                                            <h3 className="text-xl font-bold truncate">{attraction.nome}</h3>
                                            <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium mt-2 capitalize">
                                                {attraction.tipo}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Conteúdo do Card */}
                                    <div className="p-6 space-y-4">
                                        {/* Informações principais */}
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="bg-blue-50 rounded-xl p-3 text-center">
                                                <div className="text-blue-600 font-bold text-lg">{attraction.capacidadePorHorario}</div>
                                                <div className="text-blue-500 text-xs">pessoas/hora</div>
                                            </div>
                                            <div className="bg-green-50 rounded-xl p-3 text-center">
                                                <div className="text-green-600 font-bold text-lg">{attraction.faixaEtariaMinima}+</div>
                                                <div className="text-green-500 text-xs">anos</div>
                                            </div>
                                        </div>

                                        {/* Horários */}
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                <span>🕐</span> Horários ({attraction.horariosDisponiveis.length})
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {attraction.horariosDisponiveis.map(time => (
                                                    <span key={time} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                                                        {time}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Botões de Ação */}
                                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                            <button 
                                                onClick={() => handleEdit(attraction)}
                                                className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(attraction.id)}
                                                className="bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Estatísticas rápidas */}
                {attractions.length > 0 && (
                    <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">📊 Estatísticas Rápidas</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center bg-blue-50 rounded-xl p-4">
                                <div className="text-2xl font-bold text-blue-600">{attractions.length}</div>
                                <div className="text-sm text-blue-500">Total de Atrações</div>
                            </div>
                            <div className="text-center bg-green-50 rounded-xl p-4">
                                <div className="text-2xl font-bold text-green-600">
                                    {attractions.filter(a => a.possuiPrioridade).length}
                                </div>
                                <div className="text-sm text-green-500">Com Prioridade VIP</div>
                            </div>
                            <div className="text-center bg-purple-50 rounded-xl p-4">
                                <div className="text-2xl font-bold text-purple-600">
                                    {Math.round(attractions.reduce((acc, a) => acc + a.capacidadePorHorario, 0) / attractions.length)}
                                </div>
                                <div className="text-sm text-purple-500">Capacidade Média</div>
                            </div>
                            <div className="text-center bg-orange-50 rounded-xl p-4">
                                <div className="text-2xl font-bold text-orange-600">
                                    {Math.min(...attractions.map(a => a.faixaEtariaMinima))}+
                                </div>
                                <div className="text-sm text-orange-500">Idade Mínima</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageAttractionsPage;