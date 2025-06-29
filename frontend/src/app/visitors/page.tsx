"use client";

import React, { useState, useEffect } from 'react';
import VisitorForm from '@/components/VisitorForm';
import { createVisitor, getVisitors } from '@/services/api';
import { Visitor } from '@/types';

const VisitorsPage: React.FC = () => {
    const [message, setMessage] = useState<string | null>(null);
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

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
            setShowForm(false);
        } catch (err) {
            setMessage(`Falha ao cadastrar visitante: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        }
    };

    const getTicketIcon = (tipoIngresso: string) => {
        const icons: { [key: string]: string } = {
            'normal': '🎫',
            'VIP': '⭐',
            'passe-anual': '🎟️'
        };
        return icons[tipoIngresso] || '🎫';
    };

    const getTicketColor = (tipoIngresso: string) => {
        const colors: { [key: string]: string } = {
            'normal': 'from-blue-500 to-blue-600',
            'VIP': 'from-yellow-500 to-orange-600',
            'passe-anual': 'from-purple-500 to-purple-600'
        };
        return colors[tipoIngresso] || 'from-gray-500 to-gray-600';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                        Cadastro de Visitantes
                    </h1>
                    
                    {!showForm ? (
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center gap-3 bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-purple-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                        >
                            <span className="text-2xl">➕</span>
                            Cadastrar Novo Visitante
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
                            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white text-center">
                                <h2 className="text-2xl font-bold">Novo Cadastro</h2>
                                <p className="opacity-90 mt-2">Preencha seus dados para começar a diversão!</p>
                            </div>
                            <div className="p-8">
                                <VisitorForm onSubmit={handleCreateVisitor} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Lista de Visitantes */}
                <div className="bg-white rounded-3xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
                            <span>👥</span>
                            Visitantes Cadastrados ({visitors.length})
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"></div>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                            <p className="text-xl text-gray-600 font-medium">Carregando visitantes...</p>
                        </div>
                    ) : visitors.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-8xl mb-6">👤</div>
                            <h3 className="text-2xl font-bold text-gray-700 mb-4">Nenhum visitante cadastrado ainda</h3>
                            <p className="text-gray-500 mb-8">Seja o primeiro a se cadastrar e aproveitar as atrações!</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg hover:shadow-xl"
                            >
                                <span>➕</span>
                                Fazer Cadastro
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {visitors.map(visitor => (
                                <div key={visitor.id} className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200 transform hover:-translate-y-1">
                                    {/* Header do Card */}
                                    <div className={`bg-gradient-to-r ${getTicketColor(visitor.tipoIngresso)} p-6 text-white relative`}>
                                        <div className="absolute top-3 right-3 text-2xl">
                                            {getTicketIcon(visitor.tipoIngresso)}
                                        </div>
                                        <div className="text-center">
                                            <div className="text-4xl mb-2">👤</div>
                                            <h3 className="text-xl font-bold truncate">{visitor.nome}</h3>
                                            <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium mt-2">
                                                {visitor.tipoIngresso}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Conteúdo do Card */}
                                    <div className="p-6 space-y-4">
                                        <div className="space-y-3 text-sm">
                                            <div className="flex items-center gap-3">
                                                <span className="text-blue-500 text-lg">📄</span>
                                                <div>
                                                    <p className="text-gray-500 text-xs">CPF</p>
                                                    <p className="font-medium text-gray-700">{visitor.cpf}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-3">
                                                <span className="text-green-500 text-lg">📧</span>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-gray-500 text-xs">E-mail</p>
                                                    <p className="font-medium text-gray-700 truncate">{visitor.email}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-3">
                                                <span className="text-purple-500 text-lg">🎫</span>
                                                <div>
                                                    <p className="text-gray-500 text-xs">ID do Visitante</p>
                                                    <p className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{visitor.id}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Botão de Ação */}
                                        <div className="pt-4 border-t border-gray-100">
                                            <button
                                                onClick={() => {
                                                    localStorage.setItem('visitorId', visitor.id);
                                                    setMessage(`Você está agora logado como ${visitor.nome}!`);
                                                }}
                                                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-3 px-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                            >
                                                <span className="flex items-center justify-center gap-2">
                                                    <span>🔑</span>
                                                    Usar Este Perfil
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisitorsPage;