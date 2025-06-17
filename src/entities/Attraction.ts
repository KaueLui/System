export class Attraction {
    id: string; 
    nome: string;
    tipo: string; 
    capacidadePorHorario: number;
    horariosDisponiveis: string[];
    faixaEtariaMinima: number;
    possuiPrioridade: boolean;
    tiposPassePrioritarios?: string[];

    constructor(
        id: string,
        nome: string,
        tipo: string,
        capacidadePorHorario: number,
        horariosDisponiveis: string[],
        faixaEtariaMinima: number,
        possuiPrioridade: boolean = false,
        tiposPassePrioritarios?: string[]
    ) {
        this.id = id;
        this.nome = nome;
        this.tipo = tipo;
        this.capacidadePorHorario = capacidadePorHorario;
        this.horariosDisponiveis = horariosDisponiveis;
        this.faixaEtariaMinima = faixaEtariaMinima;
        this.possuiPrioridade = possuiPrioridade;
        this.tiposPassePrioritarios = tiposPassePrioritarios;
    }
}