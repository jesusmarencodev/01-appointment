import type { AWS } from "@serverless/typescript";

import { appointment, medic } from "./src/functions";

const serverlessConfiguration: AWS = {
  service: "appointment",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    stage: "${opt:stage, 'dev'}",
    apiGateway: {
      restApiId: "${ssm:/digital/api-gateway-rest-api-id-${self:provider.stage}}",
      restApiRootResourceId: "${ssm:/digital/api-gateway-rest-api-root-resource-id-${self:provider.stage}}",
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    deploymentBucket: {//PROPIEDAD PARA DECIRLE QUE BUCKET USAR
      name: "${ssm:/digital/s3-bucket-deployment-name-${self:provider.stage}}",
      serverSideEncryption: "AES256",
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      LAMBDA_CORE_PE : "appointment-pe-${self:provider.stage}-appointment",
      LAMBDA_CORE_CO : "appointment-co-${self:provider.stage}-appointment",
      LAMBDA_CORE_EC : "appointment-ec-${self:provider.stage}-appointment",
    },
    iam: {
      role: {
        name: "appointment-role-${self:provider.stage}",
        statements: [
          {
            Effect: "Allow",
            Action: [
              "logs:CreateLogGroup",
              "logs:CreateLogStream",
              "logs:PutLogEvents",
            ],
            Resource: "arn:aws:logs:*:*:*",
          },
          {
            Effect: "Allow",
            Action: "lambda:InvokeFunction",
            Resource: "arn:aws:lambda:us-east-1:867855303039:*"
          },
          {
            Effect: "Allow",
            Action: "events:PutEvents",
            //Aqui puedo colocar el ARN del eventBridge pero tambien puedo colocar * que  significa que puedo enviar eventos 
            //a todos los recursos, aunque en el factory solo configuramos a events bredges. 
            Resource: "*" 
          },
          {//permisos para eescribir en un recurso de dynamodb
            Effect: "Allow",
            Action: "dynamodb:*",
            Resource: "arn:aws:dynamodb:us-east-1:*:table/Appointment-${self:provider.stage}" 
          }
        ],

      }
    }
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: true,
      exclude: ["aws-sdk"],
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    apiGateway: {
      restApiId: "2191e9kay8",
      restApiRootResourceId: "6pmiw878ck",
    }
  },
  functions: { appointment, medic },

};

module.exports = serverlessConfiguration;
