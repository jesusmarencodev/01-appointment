import { Appointment } from "../domain/appointment";
import { AppointmentRepository } from "../domain/repository/appoinment.repository";

export class AppointmentInfraestructure implements AppointmentRepository {

    async create(appointment: Appointment) {

        return appointment;
    }



}