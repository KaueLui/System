"use client";

import React, { useEffect, useState } from 'react';
import { getVisitorQueues, getVisitorReservations } from '@/services/api';
import { QueueEntry, Reservation } from '@/types';

const VisitorPortalPage: React.FC = () => {
    const [visitorId, setVisitorId] = useState<string | null>(null);
    const [queues, setQueues] = useState<QueueEntry[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVisitorData = async (id: string) => {
        try {
            setLoading(true);
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

    if (loading) return <div className="text-center py-8">Carregando portal do visitante...</div>;
    if (error) return <div className="text-center py-8 text-red-600">Erro: {error}</div>;
    if (!visitorId) return <div className="text-center py-8 text-orange-600">Por favor, cadastre um visitante ou insira um ID de visitante para acessar o portal.</div>;

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Portal do Visitante</h1>
            <p className="text-center mb-6">Seu ID de Visitante: <strong className="text-blue-600">{visitorId}</strong></p>

            <section className="mb-8 border border-gray-200 bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">Minhas Filas Atuais</h2>
                {queues.length === 0 ? (
                    <p className="text-gray-600">Você não está em nenhuma fila no momento.</p>
                ) : (
                    <ul className="list-none p-0">
                        {queues.map((queue, index) => (
                            <li key={index} className="border-b border-gray-100 last:border-b-0 py-2">
                                <strong className="text-lg">{queue.attractionName}</strong><br />
                                <span className="text-sm text-gray-600">Posição na Fila: <span className="font-bold">{queue.posicaoNaFila}</span> | Entrou em: {new Date(queue.horaEntrada).toLocaleTimeString()} (Prioridade: {queue.prioridade === 0 ? 'VIP' : 'Normal'})</span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section className="border border-gray-200 bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">Histórico de Reservas/Visitas</h2>
                {reservations.length === 0 ? (
                    <p className="text-gray-600">Nenhuma reserva ou visita registrada ainda.</p>
                ) : (
                    <ul className="list-none p-0">
                        {reservations.map((res) => (
                            <li key={res.id} className="border-b border-gray-100 last:border-b-0 py-2">
                                <strong className="text-lg">{res.attractionName}</strong><br />
                                <span className="text-sm text-gray-600">Horário: {res.horarioReserva} | Data: {new Date(res.dataReserva).toLocaleDateString()} | Status: {res.status}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
};

export default VisitorPortalPage;