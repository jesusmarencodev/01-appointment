import joi from "joi";
import { AppointmentController } from "./adapters/controllers/appointment.controllers";
import { AppointmentApplication } from "./application/appointment.application";
import { Appointment, FieldsRequired } from "./domain/appointment";
import { AppointmentRepository } from "./domain/repository/appoinment.repository";
import { BusinessError } from "./helpers/errors.helper";
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

  const schema = joi.object({
    idMedic: joi.string().required(),
    idSpeciality: joi.string().required(),
    idAgenda: joi.string().required(),
    pacientName: joi.string().required(),
    pacientLastName: joi.string().required(),
    pacientPhone: joi.string().required(),
    countryISO: joi.string().required(),
  });

  const validationResult: joi.ValidationResult<any> = schema.validate(body);

  if (validationResult.error) {
    throw new BusinessError(
      validationResult.error.stack,
      validationResult.error.message,
      411
    );
  }

  const properties: FieldsRequired = {
    idMedic: body.idMedic,
    idSpeciality: body.idSpeciality,
    idAgenda: body.idAgenda,
    pacientName: body.pacientName,
    pacientLastName: body.pacientLastName,
    pacientPhone: body.pacientPhone,
    countryISO: body.countryISO,
    status_appointment: 0,
  };

  const appointment: Appointment = new Appointment(properties);

  const result = await controller.create(appointment);

  return {
    statusCode: 200,
    body: result,
  };
};
