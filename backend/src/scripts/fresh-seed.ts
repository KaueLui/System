import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import { initializeDatabaseSchema, loadDataFromDatabase } from '../data-store';
import { seedDatabase } from '../seeders';

dotenv.config();

async function resetAndSeed() {
    let connection: mysql.Connection | undefined;
    
    try {
        console.log('🔄 Iniciando reset completo + seed...\n');
        
        // Conectar ao banco
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'parque_tematico_mysql'
        });

        console.log('🗑️ Limpando banco de dados...');
        
        // Desabilitar verificação de chaves estrangeiras temporariamente
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        
        // Dropar todas as tabelas
        await connection.query('DROP TABLE IF EXISTS reservations');
        await connection.query('DROP TABLE IF EXISTS virtual_queues');
        await connection.query('DROP TABLE IF EXISTS visitors');
        await connection.query('DROP TABLE IF EXISTS attractions');
        
        // Reabilitar verificação de chaves estrangeiras
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        
        console.log('✅ Banco de dados limpo!');
        
        // Fechar conexão
        await connection.end();
        
        // Recriar esquema
        await initializeDatabaseSchema();
        
        // Carregar dados (que estarão vazios)
        await loadDataFromDatabase();
        
        // Executar seed
        await seedDatabase();
        
        console.log('\n🎉 Reset + Seed completado com sucesso!');
        console.log('💫 Banco de dados totalmente renovado com dados frescos!');
        
        process.exit(0);
    } catch (error) {
        console.error('\n💥 Erro durante reset + seed:', error);
        if (connection) {
            await connection.end();
        }
        process.exit(1);
    }
}

// Executar apenas se este arquivo for chamado diretamente
if (require.main === module) {
    resetAndSeed();
}