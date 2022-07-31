import { Appointment } from "../domain/appointment";
import * as AWS from "aws-sdk";
import { v4 } from "uuid";

export interface IPattern {
  Source: string;
  DetailType: string;
}
const awsEventBridge = new AWS.EventBridge();
//const dynamodb = new AWS.DynamoDB.DocumentClient();
export abstract class Factory {
  abstract pattern: IPattern;
  async sendMessage(appointment: Appointment): Promise<any> {
    const parameters = {
      Entries: [{ ... this.pattern, Detail: JSON.stringify(appointment), EventBusName: "EventBusPracticaAWSServerless01" }]
    }
    const result = await awsEventBridge.putEvents(parameters).promise();

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
