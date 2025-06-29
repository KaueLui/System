import { initializeDatabaseSchema, loadDataFromDatabase } from '../data-store';
import { seedDatabase } from '../seeders';

async function runSeed() {
    try {
        console.log('🚀 Iniciando processo de seed...\n');
        
        // Inicializar esquema do banco
        await initializeDatabaseSchema();
        
        // Carregar dados existentes (se houver)
        await loadDataFromDatabase();
        
        // Executar seed
        await seedDatabase();
        
        console.log('\n✨ Processo de seed finalizado com sucesso!');
        console.log('🎯 Sua aplicação agora possui dados de exemplo para desenvolvimento.');
        
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Erro durante o processo de seed:', error);
        process.exit(1);
    }
}

// Executar apenas se este arquivo for chamado diretamente
if (require.main === module) {
    runSeed();
}