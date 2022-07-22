import { Appointment } from "../appointment";

export interface AppointmentRepository {
  create(appointment: Appointment): Promise<Appointment>;
}
