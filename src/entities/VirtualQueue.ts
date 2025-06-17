export class VirtualQueue {
    id: string; 
    attractionId: string; 
    visitorId: string;    
    horaEntrada: Date;
    prioridade: number;  

    constructor(
        id: string,
        attractionId: string,
        visitorId: string,
        horaEntrada: Date,
        prioridade: number
    ) {
        this.id = id;
        this.attractionId = attractionId;
        this.visitorId = visitorId;
        this.horaEntrada = horaEntrada;
        this.prioridade = prioridade;
    }
}