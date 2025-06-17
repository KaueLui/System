export class Visitor {
    id: string; 
    nome: string;
    cpf: string; 
    dataNascimento: Date;
    email: string; 
    tipoIngresso: string; 
    dadosCartaoCredito?: {
        token: string;
        bandeira: string;
        ultimosDigitos: string;
    };

    constructor(
        id: string,
        nome: string,
        cpf: string,
        dataNascimento: Date,
        email: string,
        tipoIngresso: string,
        dadosCartaoCredito?: { token: string; bandeira: string; ultimosDigitos: string }
    ) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
        this.email = email;
        this.tipoIngresso = tipoIngresso;
        this.dadosCartaoCredito = dadosCartaoCredito;
    }
}