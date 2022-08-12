import { Appointment } from "../domain/appointment";
import * as AWS from "aws-sdk";
import { v4 } from "uuid";

export interface IPattern {
  Source: string;
  DetailType: string;
}
const awsEventBridge = new AWS.EventBridge();
const dynamodb = new AWS.DynamoDB.DocumentClient();
export abstract class Factory {
  abstract pattern: IPattern;

  async sendMessage(appointment: Appointment): Promise<any> {
    console.log(`Sending ${appointment.countryISO} from   appointment-dev`);
    

    const id = v4();

    const newAppointment = {id, ...appointment}

    const parameters = {
      Entries: [
        {
          ...this.pattern,
          Detail: JSON.stringify(newAppointment),
          EventBusName: "EventBusPracticaAWSServerless01"
        }
      ]
    }

    await dynamodb.put({
      TableName: "Appointment-dev",
      Item:newAppointment,
    }).promise();

    const result = await awsEventBridge.putEvents(parameters).promise();
    console.log(parameters);
    return result;
  }
}

export class FactoryPE extends Factory {
  pattern: IPattern = {
    Source: "appointment",
    DetailType: "appointment-create-pe",
  };
}

export class FactoryCO extends Factory {
  pattern: IPattern = {
    Source: "appointment",
    DetailType: "appointment-create-co",
  };
}

export class FactoryEC extends Factory {
  pattern: IPattern = {
    Source: "appointment",
    DetailType: "appointment-create-ec",
  };
}
