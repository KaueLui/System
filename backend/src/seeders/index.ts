import { v4 as uuidv4 } from 'uuid';
import { attractionsStore, visitorsStore, virtualQueuesStore, reservationsStore } from '../data-store';
import { Attraction } from '../entities/Attraction';
import { Visitor } from '../entities/Visitor';
import { VirtualQueue } from '../entities/VirtualQueue';
import { Reservation } from '../entities/Reservation';
import { saveDataToDatabase } from '../data-store';

export async function seedDatabase(): Promise<void> {
    try {
        console.log('🌱 Iniciando seed do banco de dados...');

        // Limpar dados existentes
        attractionsStore.clear();
        visitorsStore.clear();
        virtualQueuesStore.clear();
        reservationsStore.clear();

        // Seed das Atrações
        await seedAttractions();
        console.log('✅ Atrações criadas com sucesso!');

        // Seed dos Visitantes
        await seedVisitors();
        console.log('✅ Visitantes criados com sucesso!');

        // Seed das Filas Virtuais
        await seedVirtualQueues();
        console.log('✅ Filas virtuais criadas com sucesso!');

        // Seed das Reservas
        await seedReservations();
        console.log('✅ Reservas criadas com sucesso!');

        // Salvar no banco de dados
        await saveDataToDatabase();
        console.log('💾 Dados salvos no banco de dados!');

        // Mostrar ID de um visitante para teste rápido
        showVisitorTestInfo();

        console.log('🎉 Seed completado com sucesso!');
        
        // Estatísticas
        console.log('\n📊 Estatísticas dos dados criados:');
        console.log(`   🎢 Atrações: ${attractionsStore.toArray().length}`);
        console.log(`   👥 Visitantes: ${visitorsStore.toArray().length}`);
        console.log(`   🎯 Filas ativas: ${virtualQueuesStore.toArray().length}`);
        console.log(`   📅 Reservas: ${reservationsStore.toArray().length}`);
        console.log(`   🎪 Histórico de atrações visitadas: ${reservationsStore.toArray().filter(r => r.status === 'concluida').length}`);

    } catch (error) {
        console.error('❌ Erro durante o seed:', error);
        throw error;
    }
}

// Função para mostrar informações de um visitante para testes
function showVisitorTestInfo(): void {
    try {
        // Pegamos o primeiro visitante VIP que tem mais atividade no sistema
        const visitor = visitorsStore.toArray().find(v => v.tipoIngresso === 'VIP');
        
        if (visitor) {
            // Contamos quantas reservas concluídas ele possui
            const completedReservations = reservationsStore.toArray().filter(
                r => r.visitorId === visitor.id && r.status === 'concluida'
            ).length;
            
            // Contamos em quantas filas ele está
            const activeQueues = virtualQueuesStore.toArray().filter(
                q => q.visitorId === visitor.id
            ).length;
            
            console.log('\n🧪 INFORMAÇÕES PARA TESTE RÁPIDO:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`📌 Copie este ID para fazer login rapidamente: ${visitor.id}`);
            console.log(`👤 Visitante: ${visitor.nome} (${visitor.tipoIngresso})`);
            console.log(`📧 Email: ${visitor.email}`);
            console.log(`🎯 Filas ativas: ${activeQueues}`);
            console.log(`🎪 Histórico de atrações: ${completedReservations}`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🔍 Navegue para /portal após iniciar o frontend e use o ID acima para testar');
        }
    } catch (error) {
        console.error('Erro ao gerar informações de teste:', error);
    }
}

async function seedAttractions(): Promise<void> {
    const attractions = [
        // Montanhas-Russas
        {
            nome: "Tornado Supremo",
            tipo: "montanha-russa",
            capacidadePorHorario: 480,
            horariosDisponiveis: ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00", "19:30"],
            faixaEtariaMinima: 12,
            possuiPrioridade: true,
            tiposPassePrioritarios: ["VIP", "passe-anual"]
        },
        {
            nome: "Dragão de Fogo",
            tipo: "montanha-russa",
            capacidadePorHorario: 360,
            horariosDisponiveis: ["09:30", "11:00", "12:30", "14:00", "15:30", "17:00", "18:30"],
            faixaEtariaMinima: 14,
            possuiPrioridade: true,
            tiposPassePrioritarios: ["VIP"]
        },
        {
            nome: "Aventura Familiar",
            tipo: "montanha-russa",
            capacidadePorHorario: 320,
            horariosDisponiveis: ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30"],
            faixaEtariaMinima: 6,
            possuiPrioridade: false,
            tiposPassePrioritarios: []
        },

        // Rodas Gigantes
        {
            nome: "Roda Gigante Panorâmica",
            tipo: "roda-gigante",
            capacidadePorHorario: 240,
            horariosDisponiveis: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"],
            faixaEtariaMinima: 0,
            possuiPrioridade: true,
            tiposPassePrioritarios: ["VIP", "passe-anual"]
        },

        // Carrosséis
        {
            nome: "Carrossel Mágico",
            tipo: "carrossel",
            capacidadePorHorario: 180,
            horariosDisponiveis: ["09:15", "10:15", "11:15", "12:15", "13:15", "14:15", "15:15", "16:15", "17:15", "18:15"],
            faixaEtariaMinima: 0,
            possuiPrioridade: false,
            tiposPassePrioritarios: []
        },
        {
            nome: "Cavalinhos Encantados",
            tipo: "carrossel",
            capacidadePorHorario: 160,
            horariosDisponiveis: ["09:45", "11:45", "13:45", "15:45", "17:45"],
            faixaEtariaMinima: 0,
            possuiPrioridade: false,
            tiposPassePrioritarios: []
        },

        // Casas Assombradas
        {
            nome: "Mansão do Terror",
            tipo: "casa-assombrada",
            capacidadePorHorario: 120,
            horariosDisponiveis: ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"],
            faixaEtariaMinima: 16,
            possuiPrioridade: true,
            tiposPassePrioritarios: ["VIP"]
        },
        {
            nome: "Labirinto Sombrio",
            tipo: "casa-assombrada",
            capacidadePorHorario: 90,
            horariosDisponiveis: ["17:30", "18:15", "19:00", "19:45", "20:30"],
            faixaEtariaMinima: 14,
            possuiPrioridade: false,
            tiposPassePrioritarios: []
        },

        // Atrações Aquáticas
        {
            nome: "Splash Mountain",
            tipo: "aquático",
            capacidadePorHorario: 400,
            horariosDisponiveis: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
            faixaEtariaMinima: 8,
            possuiPrioridade: true,
            tiposPassePrioritarios: ["VIP", "passe-anual"]
        },
        {
            nome: "Rio Selvagem",
            tipo: "aquático",
            capacidadePorHorario: 300,
            horariosDisponiveis: ["10:30", "12:30", "14:30", "16:30"],
            faixaEtariaMinima: 10,
            possuiPrioridade: false,
            tiposPassePrioritarios: []
        },

        // Atrações Infantis
        {
            nome: "Trenzinho da Alegria",
            tipo: "infantil",
            capacidadePorHorario: 200,
            horariosDisponiveis: ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"],
            faixaEtariaMinima: 0,
            possuiPrioridade: false,
            tiposPassePrioritarios: []
        },
        {
            nome: "Parquinho dos Sonhos",
            tipo: "infantil",
            capacidadePorHorario: 150,
            horariosDisponiveis: ["09:30", "11:30", "13:30", "15:30", "17:30"],
            faixaEtariaMinima: 0,
            possuiPrioridade: false,
            tiposPassePrioritarios: []
        },

        // Atrações Radicais
        {
            nome: "Torre da Morte",
            tipo: "radical",
            capacidadePorHorario: 280,
            horariosDisponiveis: ["11:00", "13:00", "15:00", "17:00", "19:00"],
            faixaEtariaMinima: 16,
            possuiPrioridade: true,
            tiposPassePrioritarios: ["VIP"]
        },
        {
            nome: "Catapulta Extrema",
            tipo: "radical",
            capacidadePorHorario: 200,
            horariosDisponiveis: ["12:00", "14:00", "16:00", "18:00"],
            faixaEtariaMinima: 18,
            possuiPrioridade: true,
            tiposPassePrioritarios: ["VIP", "passe-anual"]
        }
    ];

    for (const attractionData of attractions) {
        const attraction = new Attraction(
            uuidv4(),
            attractionData.nome,
            attractionData.tipo,
            attractionData.capacidadePorHorario,
            attractionData.horariosDisponiveis,
            attractionData.faixaEtariaMinima,
            attractionData.possuiPrioridade,
            attractionData.tiposPassePrioritarios
        );
        attractionsStore.append(attraction);
    }
}

async function seedVisitors(): Promise<void> {
    const visitors = [
        // Visitantes VIP
        {
            nome: "Ana Silva Santos",
            cpf: "123.456.789-01",
            dataNascimento: "1985-03-15",
            email: "ana.silva@email.com",
            tipoIngresso: "VIP",
            dadosCartaoCredito: {
                token: "tok_1234567890123456",
                bandeira: "Visa",
                ultimosDigitos: "3456"
            }
        },
        {
            nome: "Carlos Eduardo Oliveira",
            cpf: "987.654.321-02",
            dataNascimento: "1978-07-22",
            email: "carlos.eduardo@email.com",
            tipoIngresso: "VIP",
            dadosCartaoCredito: {
                token: "tok_9876543210987654",
                bandeira: "Mastercard",
                ultimosDigitos: "7654"
            }
        },
        {
            nome: "Mariana Costa Lima",
            cpf: "456.789.123-03",
            dataNascimento: "1992-11-08",
            email: "mariana.costa@email.com",
            tipoIngresso: "VIP",
            dadosCartaoCredito: {
                token: "tok_4567891234567890",
                bandeira: "American Express",
                ultimosDigitos: "7890"
            }
        },

        // Visitantes com Passe Anual
        {
            nome: "Roberto Fernandes",
            cpf: "789.123.456-04",
            dataNascimento: "1990-05-12",
            email: "roberto.fernandes@email.com",
            tipoIngresso: "passe-anual",
            dadosCartaoCredito: {
                token: "tok_7891234567890123",
                bandeira: "Visa",
                ultimosDigitos: "0123"
            }
        },
        {
            nome: "Juliana Pereira",
            cpf: "321.654.987-05",
            dataNascimento: "1987-12-03",
            email: "juliana.pereira@email.com",
            tipoIngresso: "passe-anual",
            dadosCartaoCredito: {
                token: "tok_3216549876543210",
                bandeira: "Mastercard",
                ultimosDigitos: "3210"
            }
        },
        {
            nome: "Fernando Almeida",
            cpf: "654.987.321-06",
            dataNascimento: "1995-09-18",
            email: "fernando.almeida@email.com",
            tipoIngresso: "passe-anual",
            dadosCartaoCredito: {
                token: "tok_6549873210123456",
                bandeira: "Visa",
                ultimosDigitos: "3456"
            }
        },

        // Visitantes Normais
        {
            nome: "Sofia Ribeiro",
            cpf: "147.258.369-07",
            dataNascimento: "2000-01-25",
            email: "sofia.ribeiro@email.com",
            tipoIngresso: "normal",
            dadosCartaoCredito: {
                token: "tok_1472583690147258",
                bandeira: "Elo",
                ultimosDigitos: "7258"
            }
        },
        {
            nome: "Miguel Santos",
            cpf: "258.369.147-08",
            dataNascimento: "1983-04-14",
            email: "miguel.santos@email.com",
            tipoIngresso: "normal",
            dadosCartaoCredito: {
                token: "tok_2583691472583691",
                bandeira: "Visa",
                ultimosDigitos: "3691"
            }
        },
        {
            nome: "Larissa Martins",
            cpf: "369.147.258-09",
            dataNascimento: "1998-08-30",
            email: "larissa.martins@email.com",
            tipoIngresso: "normal",
            dadosCartaoCredito: {
                token: "tok_3691472583691472",
                bandeira: "Mastercard",
                ultimosDigitos: "1472"
            }
        },
        {
            nome: "Lucas Moreira",
            cpf: "741.852.963-10",
            dataNascimento: "1976-06-11",
            email: "lucas.moreira@email.com",
            tipoIngresso: "normal",
            dadosCartaoCredito: {
                token: "tok_7418529637418529",
                bandeira: "Elo",
                ultimosDigitos: "8529"
            }
        },
        {
            nome: "Isabella Santos",
            cpf: "852.963.741-11",
            dataNascimento: "2002-10-07",
            email: "isabella.santos@email.com",
            tipoIngresso: "normal",
            dadosCartaoCredito: {
                token: "tok_8529637418529637",
                bandeira: "Visa",
                ultimosDigitos: "9637"
            }
        },
        {
            nome: "Gabriel Costa",
            cpf: "963.741.852-12",
            dataNascimento: "1994-02-19",
            email: "gabriel.costa@email.com",
            tipoIngresso: "normal",
            dadosCartaoCredito: {
                token: "tok_9637418529637418",
                bandeira: "American Express",
                ultimosDigitos: "7418"
            }
        }
    ];

    for (const visitorData of visitors) {
        const visitor = new Visitor(
            uuidv4(),
            visitorData.nome,
            visitorData.cpf,
            new Date(visitorData.dataNascimento),
            visitorData.email,
            visitorData.tipoIngresso,
            visitorData.dadosCartaoCredito
        );
        visitorsStore.append(visitor);
    }
}

async function seedVirtualQueues(): Promise<void> {
    const visitors = visitorsStore.toArray();
    const attractions = attractionsStore.toArray();

    if (visitors.length === 0 || attractions.length === 0) {
        console.warn('⚠️ Não há visitantes ou atrações para criar filas');
        return;
    }

    // Criar algumas filas virtuais realistas
    const queueData = [
        // Tornado Supremo - Atração popular
        { visitorIndex: 0, attractionIndex: 0, minutesAgo: 45 }, // Ana (VIP)
        { visitorIndex: 3, attractionIndex: 0, minutesAgo: 40 }, // Roberto (Passe Anual)
        { visitorIndex: 6, attractionIndex: 0, minutesAgo: 35 }, // Sofia (Normal)
        { visitorIndex: 1, attractionIndex: 0, minutesAgo: 30 }, // Carlos (VIP)
        { visitorIndex: 8, attractionIndex: 0, minutesAgo: 25 }, // Larissa (Normal)

        // Dragão de Fogo
        { visitorIndex: 2, attractionIndex: 1, minutesAgo: 50 }, // Mariana (VIP)
        { visitorIndex: 7, attractionIndex: 1, minutesAgo: 35 }, // Miguel (Normal)
        { visitorIndex: 4, attractionIndex: 1, minutesAgo: 20 }, // Juliana (Passe Anual)

        // Roda Gigante Panorâmica
        { visitorIndex: 9, attractionIndex: 3, minutesAgo: 60 }, // Lucas (Normal)
        { visitorIndex: 5, attractionIndex: 3, minutesAgo: 45 }, // Fernando (Passe Anual)
        { visitorIndex: 10, attractionIndex: 3, minutesAgo: 30 }, // Isabella (Normal)
        { visitorIndex: 11, attractionIndex: 3, minutesAgo: 15 }, // Gabriel (Normal)

        // Splash Mountain
        { visitorIndex: 1, attractionIndex: 8, minutesAgo: 20 }, // Carlos (VIP)
        { visitorIndex: 6, attractionIndex: 8, minutesAgo: 15 }, // Sofia (Normal)

        // Torre da Morte
        { visitorIndex: 0, attractionIndex: 12, minutesAgo: 25 }, // Ana (VIP)
        { visitorIndex: 2, attractionIndex: 12, minutesAgo: 10 }, // Mariana (VIP)
    ];

    for (const queue of queueData) {
        if (queue.visitorIndex < visitors.length && queue.attractionIndex < attractions.length) {
            const visitor = visitors[queue.visitorIndex];
            const attraction = attractions[queue.attractionIndex];
            
            // Verificar se já existe uma entrada na fila para este visitante/atração
            const existingQueue = virtualQueuesStore.toArray().find(
                q => q.visitorId === visitor.id && q.attractionId === attraction.id
            );
            
            if (!existingQueue) {
                let prioridade = 1; // Normal
                if (attraction.possuiPrioridade && attraction.tiposPassePrioritarios?.includes(visitor.tipoIngresso)) {
                    prioridade = 0; // VIP
                }

                const entryTime = new Date();
                entryTime.setMinutes(entryTime.getMinutes() - queue.minutesAgo);

                const queueEntry = new VirtualQueue(
                    uuidv4(),
                    attraction.id,
                    visitor.id,
                    entryTime,
                    prioridade
                );

                virtualQueuesStore.insertSorted(queueEntry, (a, b) => {
                    if (a.prioridade !== b.prioridade) {
                        return a.prioridade - b.prioridade;
                    }
                    return a.horaEntrada.getTime() - b.horaEntrada.getTime();
                });
            }
        }
    }
}

async function seedReservations(): Promise<void> {
    const visitors = visitorsStore.toArray();
    const attractions = attractionsStore.toArray();

    if (visitors.length === 0 || attractions.length === 0) {
        console.warn('⚠️ Não há visitantes ou atrações para criar reservas');
        return;
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Criando datas passadas para histórico
    const daysAgo = (days: number): Date => {
        const date = new Date(today);
        date.setDate(date.getDate() - days);
        return date;
    };

    const reservationData = [
        // Reservas de hoje
        { visitorIndex: 0, attractionIndex: 0, horario: "15:00", status: "ativa", date: today },
        { visitorIndex: 1, attractionIndex: 1, horario: "16:30", status: "ativa", date: today },
        { visitorIndex: 2, attractionIndex: 8, horario: "14:00", status: "ativa", date: today },
        { visitorIndex: 3, attractionIndex: 3, horario: "17:00", status: "ativa", date: today },
        { visitorIndex: 4, attractionIndex: 12, horario: "19:00", status: "ativa", date: today },
        { visitorIndex: 5, attractionIndex: 0, horario: "18:00", status: "ativa", date: today },
        
        // Reservas concluídas (ontem)
        { visitorIndex: 6, attractionIndex: 4, horario: "13:15", status: "concluida", date: yesterday },
        { visitorIndex: 7, attractionIndex: 5, horario: "11:45", status: "concluida", date: yesterday },
        { visitorIndex: 8, attractionIndex: 10, horario: "15:30", status: "concluida", date: yesterday },
        { visitorIndex: 9, attractionIndex: 6, horario: "18:00", status: "concluida", date: yesterday },
        { visitorIndex: 10, attractionIndex: 9, horario: "16:30", status: "concluida", date: yesterday },
        
        // Algumas reservas canceladas
        { visitorIndex: 11, attractionIndex: 7, horario: "20:00", status: "cancelada", date: today },
        { visitorIndex: 0, attractionIndex: 13, horario: "18:00", status: "cancelada", date: yesterday },
        
        // ====== HISTÓRICO DE ATRAÇÕES VISITADAS ======
        
        // Histórico de Ana Silva (VIP) - Visitante frequente
        { visitorIndex: 0, attractionIndex: 0, horario: "10:30", status: "concluida", date: daysAgo(7) }, // Tornado Supremo
        { visitorIndex: 0, attractionIndex: 0, horario: "15:00", status: "concluida", date: daysAgo(14) }, // Tornado Supremo (repetido)
        { visitorIndex: 0, attractionIndex: 8, horario: "13:00", status: "concluida", date: daysAgo(7) }, // Splash Mountain
        { visitorIndex: 0, attractionIndex: 8, horario: "11:00", status: "concluida", date: daysAgo(21) }, // Splash Mountain (repetido)
        { visitorIndex: 0, attractionIndex: 12, horario: "19:00", status: "concluida", date: daysAgo(7) }, // Torre da Morte
        { visitorIndex: 0, attractionIndex: 3, horario: "20:00", status: "concluida", date: daysAgo(14) }, // Roda Gigante
        { visitorIndex: 0, attractionIndex: 1, horario: "14:00", status: "concluida", date: daysAgo(21) }, // Dragão de Fogo
        
        // Histórico de Carlos Eduardo (VIP)
        { visitorIndex: 1, attractionIndex: 0, horario: "09:00", status: "concluida", date: daysAgo(5) }, // Tornado Supremo
        { visitorIndex: 1, attractionIndex: 1, horario: "11:00", status: "concluida", date: daysAgo(5) }, // Dragão de Fogo
        { visitorIndex: 1, attractionIndex: 8, horario: "14:00", status: "concluida", date: daysAgo(5) }, // Splash Mountain
        { visitorIndex: 1, attractionIndex: 12, horario: "17:00", status: "concluida", date: daysAgo(5) }, // Torre da Morte
        { visitorIndex: 1, attractionIndex: 13, horario: "18:00", status: "concluida", date: daysAgo(5) }, // Catapulta Extrema
        { visitorIndex: 1, attractionIndex: 1, horario: "12:30", status: "concluida", date: daysAgo(10) }, // Dragão de Fogo (repetido)
        
        // Histórico de Mariana Costa (VIP)
        { visitorIndex: 2, attractionIndex: 3, horario: "10:00", status: "concluida", date: daysAgo(3) }, // Roda Gigante
        { visitorIndex: 2, attractionIndex: 4, horario: "14:15", status: "concluida", date: daysAgo(3) }, // Carrossel Mágico
        { visitorIndex: 2, attractionIndex: 5, horario: "17:45", status: "concluida", date: daysAgo(3) }, // Cavalinhos Encantados
        { visitorIndex: 2, attractionIndex: 3, horario: "19:00", status: "concluida", date: daysAgo(10) }, // Roda Gigante (repetido)
        
        // Histórico de Roberto Fernandes (Passe Anual)
        { visitorIndex: 3, attractionIndex: 0, horario: "09:00", status: "concluida", date: daysAgo(4) }, // Tornado Supremo
        { visitorIndex: 3, attractionIndex: 8, horario: "13:00", status: "concluida", date: daysAgo(4) }, // Splash Mountain
        { visitorIndex: 3, attractionIndex: 0, horario: "16:30", status: "concluida", date: daysAgo(15) }, // Tornado Supremo (repetido)
        { visitorIndex: 3, attractionIndex: 3, horario: "20:00", status: "concluida", date: daysAgo(15) }, // Roda Gigante
        
        // Histórico de Juliana Pereira (Passe Anual)
        { visitorIndex: 4, attractionIndex: 10, horario: "10:00", status: "concluida", date: daysAgo(6) }, // Trenzinho da Alegria
        { visitorIndex: 4, attractionIndex: 11, horario: "13:30", status: "concluida", date: daysAgo(6) }, // Parquinho dos Sonhos
        { visitorIndex: 4, attractionIndex: 10, horario: "15:00", status: "concluida", date: daysAgo(20) }, // Trenzinho da Alegria (repetido)
        
        // Histórico de Fernando Almeida (Passe Anual)
        { visitorIndex: 5, attractionIndex: 1, horario: "11:00", status: "concluida", date: daysAgo(8) }, // Dragão de Fogo
        { visitorIndex: 5, attractionIndex: 6, horario: "18:00", status: "concluida", date: daysAgo(8) }, // Mansão do Terror
        { visitorIndex: 5, attractionIndex: 7, horario: "20:30", status: "concluida", date: daysAgo(8) }, // Labirinto Sombrio
        
        // Histórico de Sofia Ribeiro (Normal)
        { visitorIndex: 6, attractionIndex: 2, horario: "10:00", status: "concluida", date: daysAgo(2) }, // Aventura Familiar
        { visitorIndex: 6, attractionIndex: 3, horario: "14:00", status: "concluida", date: daysAgo(2) }, // Roda Gigante
        { visitorIndex: 6, attractionIndex: 9, horario: "16:30", status: "concluida", date: daysAgo(2) }, // Rio Selvagem
        
        // Histórico de Miguel Santos (Normal)
        { visitorIndex: 7, attractionIndex: 10, horario: "09:00", status: "concluida", date: daysAgo(9) }, // Trenzinho da Alegria
        { visitorIndex: 7, attractionIndex: 4, horario: "12:15", status: "concluida", date: daysAgo(9) }, // Carrossel Mágico
        { visitorIndex: 7, attractionIndex: 2, horario: "16:00", status: "concluida", date: daysAgo(9) }, // Aventura Familiar
        
        // Histórico de visitantes avulsos
        { visitorIndex: 8, attractionIndex: 3, horario: "11:00", status: "concluida", date: daysAgo(12) }, // Larissa - Roda Gigante
        { visitorIndex: 9, attractionIndex: 0, horario: "18:00", status: "concluida", date: daysAgo(18) }, // Lucas - Tornado Supremo
        { visitorIndex: 10, attractionIndex: 3, horario: "15:00", status: "concluida", date: daysAgo(25) }, // Isabella - Roda Gigante
        { visitorIndex: 11, attractionIndex: 1, horario: "17:00", status: "concluida", date: daysAgo(30) }, // Gabriel - Dragão de Fogo
    ];

    for (const reservation of reservationData) {
        if (reservation.visitorIndex < visitors.length && reservation.attractionIndex < attractions.length) {
            const visitor = visitors[reservation.visitorIndex];
            const attraction = attractions[reservation.attractionIndex];

            const reservationEntry = new Reservation(
                uuidv4(),
                visitor.id,
                attraction.id,
                reservation.horario,
                reservation.date,
                reservation.status
            );

            reservationsStore.append(reservationEntry);
        }
    }
}