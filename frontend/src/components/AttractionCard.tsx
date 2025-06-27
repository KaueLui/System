"use client";

import React from 'react';
import { Attraction } from '@/types';

interface AttractionCardProps {
    attraction: Attraction;
    onJoinQueue: (attractionId: string) => void;
    visitorId: string | null;
}

const AttractionCard: React.FC<AttractionCardProps> = ({ attraction, onJoinQueue, visitorId }) => {
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

    const getThemeColor = (tipo: string) => {
        const colors: { [key: string]: string } = {
            'montanha-russa': 'from-red-500 to-orange-500',
            'roda-gigante': 'from-blue-500 to-cyan-500',
            'carrossel': 'from-pink-500 to-purple-500',
            'casa-assombrada': 'from-gray-700 to-black',
            'aquático': 'from-blue-400 to-teal-500',
            'infantil': 'from-yellow-400 to-orange-400',
            'radical': 'from-red-600 to-pink-600',
            'default': 'from-purple-500 to-blue-500'
        };
        return colors[tipo.toLowerCase()] || colors.default;
    };

    const getIntensityLevel = (faixaEtaria: number, tipo: string) => {
        if (faixaEtaria <= 6) return { level: 'Família', color: 'text-green-600', icon: '👨‍👩‍👧‍👦' };
        if (faixaEtaria <= 10) return { level: 'Moderado', color: 'text-yellow-600', icon: '⚡' };
        if (faixaEtaria <= 16 || tipo.includes('radical')) return { level: 'Radical', color: 'text-red-600', icon: '🔥' };
        return { level: 'Extremo', color: 'text-purple-600', icon: '💀' };
    };

    const intensity = getIntensityLevel(attraction.faixaEtariaMinima, attraction.tipo);

    return (
        <div className="group bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 hover:scale-105">
            {/* Header com gradiente */}
            <div className={`bg-gradient-to-r ${getThemeColor(attraction.tipo)} p-6 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
                
                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                        <span className="text-4xl filter drop-shadow-lg">
                            {getAttractionIcon(attraction.tipo)}
                        </span>
                        {attraction.possuiPrioridade && (
                            <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                                <span>⭐</span>
                                VIP
                            </div>
                        )}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 leading-tight">
                        {attraction.nome}
                    </h3>
                    
                    <div className="flex items-center gap-2">
                        <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium capitalize">
                            {attraction.tipo.replace('-', ' ')}
                        </span>
                        <span className={`${intensity.color} bg-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                            <span>{intensity.icon}</span>
                            {intensity.level}
                        </span>
                    </div>
                </div>
            </div>

            {/* Conteúdo do Card */}
            <div className="p-6 space-y-4">
                {/* Estatísticas */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-blue-600">{attraction.capacidadePorHorario}</div>
                        <div className="text-xs text-blue-500">pessoas/hora</div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-purple-600">{attraction.faixaEtariaMinima}+</div>
                        <div className="text-xs text-purple-500">anos</div>
                    </div>
                </div>

                {/* Horários Disponíveis */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span>🕐</span>
                        Horários ({attraction.horariosDisponiveis.length})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                        {attraction.horariosDisponiveis.slice(0, 4).map((horario, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs font-medium">
                                {horario}
                            </span>
                        ))}
                        {attraction.horariosDisponiveis.length > 4 && (
                            <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-lg text-xs font-medium">
                                +{attraction.horariosDisponiveis.length - 4}
                            </span>
                        )}
                    </div>
                </div>

                {/* Tipos de Passe Prioritário */}
                {attraction.possuiPrioridade && attraction.tiposPassePrioritarios && (
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <span>⭐</span>
                            Acesso VIP
                        </h4>
                        <div className="flex flex-wrap gap-1">
                            {attraction.tiposPassePrioritarios.map((tipo, index) => (
                                <span key={index} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-lg text-xs font-medium">
                                    {tipo}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Botão de Ação */}
                <div className="pt-2">
                    {visitorId ? (
                        <button
                            onClick={() => onJoinQueue(attraction.id)}
                            className={`w-full bg-gradient-to-r ${getThemeColor(attraction.tipo)} hover:shadow-lg text-white py-3 px-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group-hover:shadow-2xl`}
                        >
                            <span className="text-lg">🎫</span>
                            Entrar na Fila
                        </button>
                    ) : (
                        <div className="space-y-2">
                            <div className="bg-orange-100 border border-orange-200 rounded-xl p-3 text-center">
                                <div className="flex items-center justify-center gap-2 text-orange-700 text-sm font-medium mb-2">
                                    <span>⚠️</span>
                                    Cadastro necessário
                                </div>
                                <a 
                                    href="/visitors"
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-2"
                                >
                                    <span>🎟️</span>
                                    Fazer Cadastro
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ID da Atração (para debug) */}
            <div className="px-6 pb-3">
                <div className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded text-center">
                    ID: {attraction.id.slice(-8)}
                </div>
            </div>
        </div>
    );
};

export default AttractionCard;