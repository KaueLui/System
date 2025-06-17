export interface Attraction {
    id: string;
    nome: string;
    tipo: string;
    capacidadePorHorario: number;
    horariosDisponiveis: string[];
    faixaEtariaMinima: number;
    possuiPrioridade: boolean;
    tiposPassePrioritarios?: string[];
}

export interface Visitor {
    id: string;
    nome: string;
    cpf: string;
    dataNascimento: string; 
    email: string;
    tipoIngresso: string;
    dadosCartaoCredito?: { token: string; bandeira: string; ultimosDigitos: string };
}

export interface QueueEntry {
    attractionName: string;
    attractionId: string;
    horaEntrada: string; 
    prioridade: number;
    posicaoNaFila: number;
}

export interface Reservation {
    id: string;
    visitorId: string;
    attractionId: string;
    attractionName: string;
    horarioReserva: string;
    dataReserva: string;
    status: string;
}

export interface QueueStatusResponse {
    attractionName: string;
    queueSize: number;
    nextVisitors: Array<{
        visitorName: string;
        prioridade: number;
        horaEntrada: string;
        queueEntryId: string;
    }>;
}

export interface AnalyticsTotalReservationsToday {
    date: string;
    totalReservations: number;
}

export interface AnalyticsMostPopularAttraction {
    mostPopularAttraction: string;
    reservationCount: number;
}

export interface AnalyticsTopVisitor {
    topVisitor: string;
    interactionCount: number;
}