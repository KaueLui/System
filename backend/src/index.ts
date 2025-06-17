import express from 'express';
import * as dotenv from 'dotenv';
import { initializeDatabaseSchema, loadDataFromDatabase } from './data-store';
import routes from './routes';
import cors from 'cors'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:3001', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

async function startServer() {
    try {
        await initializeDatabaseSchema();
        await loadDataFromDatabase();

        console.log("Sistema de Reservas Backend iniciado!");

        app.use('/api', routes);

        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Falha crítica ao iniciar o servidor:", error);
        process.exit(1);
    }
}

startServer();