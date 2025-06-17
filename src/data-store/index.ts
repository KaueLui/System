import { Attraction } from '../entities/Attraction';
import { Visitor } from '../entities/Visitor';
import { VirtualQueue } from '../entities/VirtualQueue';
import { Reservation } from '../entities/Reservation';
import { LinkedList } from '../data-structures/LinkedList';
import mysql from 'mysql2/promise'; 
import * as dotenv from 'dotenv'; 

dotenv.config(); 

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT || '3306'), 
    waitForConnections: true, 
    connectionLimit: 10,      
    queueLimit: 0             
});

export const attractionsStore = new LinkedList<Attraction>();
export const visitorsStore = new LinkedList<Visitor>();
export const virtualQueuesStore = new LinkedList<VirtualQueue>();
export const reservationsStore = new LinkedList<Reservation>();

export async function initializeDatabaseSchema(): Promise<void> {
    try {
        console.log("Verificando/Criando esquema do banco de dados (MySQL)...");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS attractions (
                id VARCHAR(36) PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                tipo VARCHAR(100) NOT NULL,
                capacidade_por_horario INT NOT NULL,
                horarios_disponiveis JSON NOT NULL, -- Armazenar arrays como JSON
                faixa_etaria_minima INT NOT NULL,
                possui_prioridade BOOLEAN DEFAULT FALSE,
                tipos_passe_prioritarios JSON -- Armazenar arrays como JSON
            );
        `);
        console.log("Tabela 'attractions' verificada/criada.");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS visitors (
                id VARCHAR(36) PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                cpf VARCHAR(14) UNIQUE NOT NULL,
                data_nascimento DATE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                tipo_ingresso VARCHAR(50) NOT NULL,
                dados_cartao_credito JSON -- Armazenar objeto JSON
            );
        `);
        console.log("Tabela 'visitors' verificada/criada.");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS virtual_queues (
                id VARCHAR(36) PRIMARY KEY,
                attraction_id VARCHAR(36) NOT NULL,
                visitor_id VARCHAR(36) NOT NULL,
                hora_entrada DATETIME NOT NULL,
                prioridade INT NOT NULL,
                UNIQUE(attraction_id, visitor_id), -- Garante que um visitante esteja em uma fila por atração
                FOREIGN KEY (attraction_id) REFERENCES attractions(id) ON DELETE CASCADE,
                FOREIGN KEY (visitor_id) REFERENCES visitors(id) ON DELETE CASCADE
            );
        `);
        console.log("Tabela 'virtual_queues' verificada/criada.");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS reservations (
                id VARCHAR(36) PRIMARY KEY,
                visitor_id VARCHAR(36) NOT NULL,
                attraction_id VARCHAR(36) NOT NULL,
                horario_reserva VARCHAR(5) NOT NULL,
                data_reserva DATE NOT NULL,
                status VARCHAR(50) NOT NULL,
                FOREIGN KEY (visitor_id) REFERENCES visitors(id) ON DELETE CASCADE,
                FOREIGN KEY (attraction_id) REFERENCES attractions(id) ON DELETE CASCADE
            );
        `);
        console.log("Tabela 'reservations' verificada/criada.");

        console.log("Esquema do banco de dados verificado/criado com sucesso.");
    } catch (error) {
        console.error("Erro ao inicializar esquema do banco de dados:", error);
        process.exit(1); 
    }
}

export async function loadDataFromDatabase(): Promise<void> {
    try {
        console.log("Carregando dados do banco de dados (MySQL) para as listas encadeadas...");

        attractionsStore.clear();
        visitorsStore.clear();
        virtualQueuesStore.clear();
        reservationsStore.clear();

        const [attractionRows] = await pool.query<mysql.RowDataPacket[]>('SELECT * FROM attractions');
        attractionRows.forEach(row => {
            const attraction = new Attraction(
                row.id,
                row.nome,
                row.tipo,
                row.capacidade_por_horario,
                JSON.parse(row.horarios_disponiveis), 
                row.faixa_etaria_minima,
                row.possui_prioridade,
                row.tipos_passe_prioritarios ? JSON.parse(row.tipos_passe_prioritarios) : undefined
            );
            attractionsStore.append(attraction);
        });

        const [visitorRows] = await pool.query<mysql.RowDataPacket[]>('SELECT * FROM visitors');
        visitorRows.forEach(row => {
            const visitor = new Visitor(
                row.id,
                row.nome,
                row.cpf,
                new Date(row.data_nascimento), 
                row.email,
                row.tipo_ingresso,
                row.dados_cartao_credito ? JSON.parse(row.dados_cartao_credito) : undefined
            );
            visitorsStore.append(visitor);
        });

        const [queueRows] = await pool.query<mysql.RowDataPacket[]>('SELECT * FROM virtual_queues ORDER BY prioridade ASC, hora_entrada ASC');
        queueRows.forEach(row => {
            const queueEntry = new VirtualQueue(
                row.id,
                row.attraction_id,
                row.visitor_id,
                new Date(row.hora_entrada),
                row.prioridade
            );
            virtualQueuesStore.append(queueEntry);
        });

        const [reservationRows] = await pool.query<mysql.RowDataPacket[]>('SELECT * FROM reservations');
        reservationRows.forEach(row => {
            const reservation = new Reservation(
                row.id,
                row.visitor_id,
                row.attraction_id,
                row.horario_reserva,
                new Date(row.data_reserva),
                row.status
            );
            reservationsStore.append(reservation);
        });

        console.log("Dados carregados com sucesso para as listas encadeadas!");
    } catch (error) {
        console.error("Erro ao carregar dados do banco de dados:", error);
        process.exit(1); 
    }
}

export async function saveDataToDatabase(): Promise<void> {
    let connection: mysql.PoolConnection | undefined;
    try {
        console.log("Salvando dados das listas encadeadas para o banco de dados (MySQL)...");
        connection = await pool.getConnection(); 
        await connection.beginTransaction();     

        await connection.query('DELETE FROM attractions'); 
        for (const attraction of attractionsStore.toArray()) { 
            await connection.query(
                `INSERT INTO attractions (id, nome, tipo, capacidade_por_horario, horarios_disponiveis, faixa_etaria_minima, possui_prioridade, tipos_passe_prioritarios)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
                [
                    attraction.id,
                    attraction.nome,
                    attraction.tipo,
                    attraction.capacidadePorHorario,
                    JSON.stringify(attraction.horariosDisponiveis), 
                    attraction.faixaEtariaMinima,
                    attraction.possuiPrioridade,
                    attraction.tiposPassePrioritarios ? JSON.stringify(attraction.tiposPassePrioritarios) : null
                ]
            );
        }

        await connection.query('DELETE FROM visitors');
        for (const visitor of visitorsStore.toArray()) {
            await connection.query(
                `INSERT INTO visitors (id, nome, cpf, data_nascimento, email, tipo_ingresso, dados_cartao_credito)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    visitor.id,
                    visitor.nome,
                    visitor.cpf,
                    visitor.dataNascimento, 
                    visitor.email,
                    visitor.tipoIngresso,
                    visitor.dadosCartaoCredito ? JSON.stringify(visitor.dadosCartaoCredito) : null
                ]
            );
        }

        await connection.query('DELETE FROM virtual_queues');
        for (const queueEntry of virtualQueuesStore.toArray()) {
            await connection.query(
                `INSERT INTO virtual_queues (id, attraction_id, visitor_id, hora_entrada, prioridade)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    queueEntry.id,
                    queueEntry.attractionId,
                    queueEntry.visitorId,
                    queueEntry.horaEntrada,
                    queueEntry.prioridade
                ]
            );
        }

        await connection.query('DELETE FROM reservations');
        for (const reservation of reservationsStore.toArray()) {
            await connection.query(
                `INSERT INTO reservations (id, visitor_id, attraction_id, horario_reserva, data_reserva, status)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    reservation.id,
                    reservation.visitorId,
                    reservation.attractionId,
                    reservation.horarioReserva,
                    reservation.dataReserva,
                    reservation.status
                ]
            );
        }

        await connection.commit(); 
        console.log("Dados salvos com sucesso no MySQL!");
    } catch (error) {
        if (connection) {
            await connection.rollback(); 
        }
        console.error("Erro ao salvar dados no banco de dados:", error);
        throw error; 
    } finally {
        if (connection) {
            connection.release();
        }
    }
}