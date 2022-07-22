import { AppointmentController } from "./adapters/controllers/appointment.controllers";
import { AppointmentApplication } from "./application/appointment.application";
import { Appointment, FieldsRequired } from "./domain/appointment";
import { AppointmentRepository } from "./domain/repository/appoinment.repository";
import { AppointmentInfraestructure } from "./infraestructure/appointment.infraestructure";



const repository: AppointmentRepository = new AppointmentInfraestructure();

const application: AppointmentApplication = new AppointmentApplication(
  repository
);

const controller: AppointmentController = new AppointmentController(
  application
);

export const appointmentHandler = async (event) => {


  const body = event.body;

  const properties: FieldsRequired = {
    idMedic: body.idMedic,
    idSpeciality: body.idSpeciality,
    idAgenda: body.idAgenda,
    pacientName: body.pacientName,
    pacientLastName: body.pacientLastName,
    pacientPhone: body.pacientPhone,
    status: 0,
  };

  const appointment: Appointment = new Appointment(properties);



  const result = await controller.create(appointment);



  return {
    statusCode: 200,
    body: result,
  };
};
