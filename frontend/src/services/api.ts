import { Attraction, Visitor, QueueEntry, Reservation, QueueStatusResponse, AnalyticsTotalReservationsToday, AnalyticsMostPopularAttraction, AnalyticsTopVisitor } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro na requisição: ${response.status}`);
    }
    return response.json();
}

export const getAttractions = async (): Promise<Attraction[]> => {
    const response = await fetch(`${API_BASE_URL}/attractions`);
    return handleResponse<Attraction[]>(response);
};

export const createAttraction = async (attractionData: Omit<Attraction, 'id'>): Promise<Attraction> => {
    const response = await fetch(`${API_BASE_URL}/attractions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attractionData),
    });
    return handleResponse<Attraction>(response);
};

export const updateAttraction = async (id: string, attractionData: Partial<Omit<Attraction, 'id'>>): Promise<Attraction> => {
    const response = await fetch(`${API_BASE_URL}/attractions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attractionData),
    });
    return handleResponse<Attraction>(response);
};

export const deleteAttraction = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/attractions/${id}`, {
        method: 'DELETE',
    });
    if (response.status !== 204 && !response.ok) { // 204 No Content is a success status
        const errorData = await response.json().catch(() => ({})); // Catch if there's no body
        throw new Error(errorData.message || `Erro na requisição: ${response.status}`);
    }
};

export const createVisitor = async (visitorData: Omit<Visitor, 'id'>): Promise<Visitor> => {
    const response = await fetch(`${API_BASE_URL}/visitors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitorData),
    });
    return handleResponse<Visitor>(response);
};

export const getVisitors = async (): Promise<Visitor[]> => {
    const response = await fetch(`${API_BASE_URL}/visitors`);
    return handleResponse<Visitor[]>(response);
};

export const joinQueue = async (queueData: { attractionId: string, visitorId: string }): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/queue/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(queueData),
    });
    return handleResponse<any>(response);
};

export const getVisitorQueues = async (visitorId: string): Promise<QueueEntry[]> => {
    const response = await fetch(`${API_BASE_URL}/visitors/${visitorId}/queues`);
    return handleResponse<QueueEntry[]>(response);
};

export const getVisitorReservations = async (visitorId: string): Promise<Reservation[]> => {
    const response = await fetch(`${API_BASE_URL}/visitors/${visitorId}/reservations`);
    return handleResponse<Reservation[]>(response);
};

export const getAllReservations = async (): Promise<(Reservation & { visitorName: string })[]> => {
    const response = await fetch(`${API_BASE_URL}/reservations`);
    return handleResponse<(Reservation & { visitorName: string })[]>(response);
};

export const completeReservation = async (reservationId: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse<any>(response);
};

export interface AttractionHistoryEntry {
    attractionId: string;
    nome: string;
    totalVisitas: number;
    visitas: Array<{
        data: string;
        horario: string;
        reservationId: string;
    }>;
}

export const getVisitorAttractionHistory = async (visitorId: string): Promise<AttractionHistoryEntry[]> => {
    const response = await fetch(`${API_BASE_URL}/visitors/${visitorId}/attraction-history`);
    return handleResponse<AttractionHistoryEntry[]>(response);
};

export const createReservation = async (reservationData: { visitorId: string, attractionId: string, horarioReserva: string, dataReserva: string }): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData),
    });
    return handleResponse<any>(response);
};

export const getAttractionQueueStatus = async (attractionId: string): Promise<QueueStatusResponse> => {
    const response = await fetch(`${API_BASE_URL}/attractions/${attractionId}/queue-status`);
    return handleResponse<QueueStatusResponse>(response);
};

export const getTotalReservationsToday = async (): Promise<AnalyticsTotalReservationsToday> => {
    const response = await fetch(`${API_BASE_URL}/analytics/total-reservations-today`);
    return handleResponse<AnalyticsTotalReservationsToday>(response);
};

export const getMostPopularAttraction = async (): Promise<AnalyticsMostPopularAttraction> => {
    const response = await fetch(`${API_BASE_URL}/analytics/most-popular-attraction`);
    return handleResponse<AnalyticsMostPopularAttraction>(response);
};

export const getTopVisitor = async (): Promise<AnalyticsTopVisitor> => {
    const response = await fetch(`${API_BASE_URL}/analytics/top-visitor`);
    return handleResponse<AnalyticsTopVisitor>(response);
};

