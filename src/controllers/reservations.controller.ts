// src/controllers/reservations.controller.ts
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
    attractionsStore,
    visitorsStore,
    virtualQueuesStore,
    reservationsStore,
    saveDataToDatabase
} from '../data-store';
import { VirtualQueue } from '../entities/VirtualQueue';
import { Reservation } from '../entities/Reservation';
import { Attraction } from '../entities/Attraction';
import { Visitor } from '../entities/Visitor';

export const joinQueue = async (req: Request, res: Response) => {
    const { attractionId, visitorId } = req.body;

    if (!attractionId || !visitorId) {
        return res.status(400).json({ message: 'attractionId e visitorId são obrigatórios.' });
    }

    try {
        const attraction = attractionsStore.findById(attractionId);
        const visitor = visitorsStore.findById(visitorId);

        if (!attraction || !visitor) {
            return res.status(404).json({ message: 'Atração ou visitante não encontrado.' });
        }

        const existingQueueEntry = virtualQueuesStore.toArray().find(
            (entry) => entry.attractionId === attractionId && entry.visitorId === visitorId
        );
        if (existingQueueEntry) {
            return res.status(409).json({ message: 'Visitante já está na fila desta atração.' });
        }

        let prioridade = 1; 
        if (attraction.possuiPrioridade && attraction.tiposPassePrioritarios?.includes(visitor.tipoIngresso)) {
            prioridade = 0; 
        }

        const newQueueEntry = new VirtualQueue(
            uuidv4(),
            attractionId,
            visitorId,
            new Date(), 
            prioridade
        );

        virtualQueuesStore.insertSorted(newQueueEntry, (a, b) => {
            if (a.prioridade !== b.prioridade) {
                return a.prioridade - b.prioridade; 
            }
            return a.horaEntrada.getTime() - b.horaEntrada.getTime(); 
        });

        await saveDataToDatabase();
        res.status(201).json({ message: 'Entrou na fila com sucesso!', queueEntry: newQueueEntry });

    } catch (error) {
        console.error('Erro ao entrar na fila:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao entrar na fila', error });
    }
};

export const getVisitorQueues = async (req: Request, res: Response) => {
    const { visitorId } = req.params;

    try {
        const visitorQueues = virtualQueuesStore.toArray().filter(entry => entry.visitorId === visitorId);

        if (visitorQueues.length === 0) {
            return res.status(200).json([]); 
        }

        const queuesWithPosition = visitorQueues.map(entry => {
            const allQueueEntriesForAttraction = virtualQueuesStore.toArray()
                .filter(q => q.attractionId === entry.attractionId)
                .sort((a, b) => {
                    if (a.prioridade !== b.prioridade) {
                        return a.prioridade - b.prioridade;
                    }
                    return a.horaEntrada.getTime() - b.horaEntrada.getTime();
                });

            const position = allQueueEntriesForAttraction.findIndex(q => q.id === entry.id) + 1;
            const attraction = attractionsStore.findById(entry.attractionId);

            return {
                attractionName: attraction ? attraction.nome : 'Atração Desconhecida',
                attractionId: entry.attractionId,
                horaEntrada: entry.horaEntrada,
                prioridade: entry.prioridade,
                posicaoNaFila: position,
            };
        });

        res.status(200).json(queuesWithPosition);
    } catch (error) {
        console.error('Erro ao buscar filas do visitante:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar filas do visitante', error });
    }
};

export const getVisitorReservations = async (req: Request, res: Response) => {
    const { visitorId } = req.params;

    try {
        const visitorReservations = reservationsStore.toArray().filter(res => res.visitorId === visitorId)
            .map(res => {
                const attraction = attractionsStore.findById(res.attractionId);
                return {
                    ...res,
                    attractionName: attraction ? attraction.nome : 'Atração Desconhecida'
                };
            });
        res.status(200).json(visitorReservations);
    } catch (error) {
        console.error('Erro ao buscar reservas do visitante:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar reservas do visitante', error });
    }
};

export const completeReservation = async (req: Request, res: Response) => {
    const { reservationId } = req.params;

    try {
        const reservation = reservationsStore.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ message: 'Reserva não encontrada.' });
        }

        reservation.status = 'concluida';
        reservationsStore.updateById(reservationId, { status: 'concluida' });

        const queueEntryToRemove = virtualQueuesStore.toArray().find(
            q => q.attractionId === reservation.attractionId && q.visitorId === reservation.visitorId
        );

        if (queueEntryToRemove) {
            virtualQueuesStore.removeById(queueEntryToRemove.id);
        }

        await saveDataToDatabase();
        res.status(200).json({ message: 'Reserva marcada como concluída e visitante removido da fila.', reservation });
    } catch (error) {
        console.error('Erro ao concluir reserva:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao concluir reserva', error });
    }
};

export const getAttractionQueueStatus = async (req: Request, res: Response) => {
    const { attractionId } = req.params;

    try {
        const attraction = attractionsStore.findById(attractionId);
        if (!attraction) {
            return res.status(404).json({ message: 'Atração não encontrada.' });
        }

        const queue = virtualQueuesStore.toArray()
            .filter(entry => entry.attractionId === attractionId)
            .sort((a, b) => {
                if (a.prioridade !== b.prioridade) {
                    return a.prioridade - b.prioridade;
                }
                return a.horaEntrada.getTime() - b.horaEntrada.getTime();
            });

        const nextVisitorsDetails = queue.slice(0, 5).map(entry => { 
            const visitor = visitorsStore.findById(entry.visitorId);
            return {
                visitorName: visitor ? visitor.nome : 'Visitante Desconhecido',
                prioridade: entry.prioridade,
                horaEntrada: entry.horaEntrada,
                queueEntryId: entry.id 
            };
        });

        res.status(200).json({
            attractionName: attraction.nome,
            queueSize: queue.length,
            nextVisitors: nextVisitorsDetails,
        });
    } catch (error) {
        console.error('Erro ao buscar status da fila da atração:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar status da fila da atração', error });
    }
};

export const getTotalReservationsToday = async (req: Request, res: Response) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalReservations = reservationsStore.toArray().filter(res => {
            const resDate = new Date(res.dataReserva);
            resDate.setHours(0, 0, 0, 0);
            return resDate.getTime() === today.getTime();
        }).length;

        res.status(200).json({ date: today.toISOString().split('T')[0], totalReservations });
    } catch (error) {
        console.error('Erro ao obter total de reservas do dia:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao obter total de reservas do dia', error });
    }
};

export const getMostPopularAttraction = async (req: Request, res: Response) => {
    try {
        const attractionCounts: { [key: string]: number } = {};
        reservationsStore.toArray().forEach(res => {
            attractionCounts[res.attractionId] = (attractionCounts[res.attractionId] || 0) + 1;
        });

        let mostPopularId: string | null = null;
        let maxCount = 0;

        for (const id in attractionCounts) {
            if (attractionCounts[id] > maxCount) {
                maxCount = attractionCounts[id];
                mostPopularId = id;
            }
        }

        let mostPopularAttraction: Attraction | null = null;
        if (mostPopularId) {
            mostPopularAttraction = attractionsStore.findById(mostPopularId);
        }

        res.status(200).json({
            mostPopularAttraction: mostPopularAttraction ? mostPopularAttraction.nome : 'Nenhuma atração disputada ainda',
            reservationCount: maxCount
        });
    } catch (error) {
        console.error('Erro ao obter atração mais disputada:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao obter atração mais disputada', error });
    }
};

export const getTopVisitor = async (req: Request, res: Response) => {
    try {
        const visitorCounts: { [key: string]: number } = {};
        reservationsStore.toArray().forEach(res => {
            visitorCounts[res.visitorId] = (visitorCounts[res.visitorId] || 0) + 1;
        });
        virtualQueuesStore.toArray().forEach(q => { 
             visitorCounts[q.visitorId] = (visitorCounts[q.visitorId] || 0) + 1;
        });


        let topVisitorId: string | null = null;
        let maxCount = 0;

        for (const id in visitorCounts) {
            if (visitorCounts[id] > maxCount) {
                maxCount = visitorCounts[id];
                topVisitorId = id;
            }
        }

        let topVisitor: Visitor | null = null;
        if (topVisitorId) {
            topVisitor = visitorsStore.findById(topVisitorId);
        }

        res.status(200).json({
            topVisitor: topVisitor ? topVisitor.nome : 'Nenhum visitante registrou uso ainda',
            interactionCount: maxCount
        });
    } catch (error) {
        console.error('Erro ao obter visitante que mais usou o sistema:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao obter visitante que mais usou o sistema', error });
    }
};