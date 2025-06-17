"use client"; 

import React from 'react';
import { Attraction } from '@/types'; 

interface AttractionCardProps {
    attraction: Attraction;
    onJoinQueue?: (attractionId: string) => void;
    visitorId?: string; 
}

const AttractionCard: React.FC<AttractionCardProps> = ({
    attraction,
    onJoinQueue,
    visitorId
}) => {
    const handleJoinQueue = () => {
        if (onJoinQueue && visitorId) {
            onJoinQueue(attraction.id);
        } else if (!visitorId) {
            alert("Você precisa estar logado como visitante para entrar na fila!");
        }
    };

    return (
        <div className="border border-gray-300 p-4 m-2 rounded-lg shadow-md bg-white">
            <h3 className="text-xl font-bold mb-2">{attraction.nome} ({attraction.tipo})</h3>
            <p className="text-gray-700">Capacidade/Horário: {attraction.capacidadePorHorario}</p>
            <p className="text-gray-700">Horários: {attraction.horariosDisponiveis.join(', ')}</p>
            <p className="text-gray-700">Idade Mínima: {attraction.faixaEtariaMinima} anos</p>
            {attraction.possuiPrioridade && (
                <p className="text-gray-700">
                    Prioridade para: {attraction.tiposPassePrioritarios?.join(', ') || 'N/A'}
                </p>
            )}
            {onJoinQueue && (
                <button
                    onClick={handleJoinQueue}
                    disabled={!visitorId}
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
                >
                    {visitorId ? 'Entrar na Fila' : 'Login para Fila'}
                </button>
            )}
        </div>
    );
};

export default AttractionCard;