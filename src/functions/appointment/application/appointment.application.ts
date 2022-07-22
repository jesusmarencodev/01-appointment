import { Appointment } from "../domain/appointment";
import { AppointmentRepository } from "../domain/repository/appoinment.repository";

export class AppointmentApplication {

    constructor(private appointmentRepository:AppointmentRepository){}

    async create(appointment:Appointment){
        return await this.appointmentRepository.create(appointment);
    }
}