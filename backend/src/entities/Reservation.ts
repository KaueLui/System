export class Reservation {
    id: string; 
    visitorId: string;   
    attractionId: string; 
    horarioReserva: string; 
    dataReserva: Date;      
    status: string;        

    constructor(
        id: string,
        visitorId: string,
        attractionId: string,
        horarioReserva: string,
        dataReserva: Date,
        status: string
    ) {
        this.id = id;
        this.visitorId = visitorId;
        this.attractionId = attractionId;
        this.horarioReserva = horarioReserva;
        this.dataReserva = dataReserva;
        this.status = status;
    }
}