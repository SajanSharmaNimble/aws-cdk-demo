import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { TableV2 } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface LambdaStackProps extends StackProps {
  table: TableV2;
}

export class LambdaStack extends Stack {
  public readonly intergrations: { [name: string]: LambdaIntegration };

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const generalProps: NodejsFunctionProps = {
      runtime: Runtime.NODEJS_20_X,
      timeout: Duration.minutes(3),
      environment: {
        TABLE_NAME: props.table.tableName,
      },
    };

    // Create lambda
    const create = new NodejsFunction(this, "CreateDemoLambda", {
      ...generalProps,
      entry: join(__dirname, "../lambdas/create.ts"),
    });

    // getOne lambda
    const getAll = new NodejsFunction(this, "GetAllDemoLambda", {
      ...generalProps,
      entry: join(__dirname, "../lambdas/get.ts"),
    });

    // getOne lambda
    const getOne = new NodejsFunction(this, "GetOneDemoLambda", {
      ...generalProps,
      entry: join(__dirname, "../lambdas/getOne.ts"),
    });

    // update lambda
    const update = new NodejsFunction(this, "UpdateDemoLambda", {
      ...generalProps,
      entry: join(__dirname, "../lambdas/update.ts"),
    });

    // destroy lambda
    const destroy = new NodejsFunction(this, "DestroyDemoLambda", {
      ...generalProps,
      entry: join(__dirname, "../lambdas/destroy.ts"),
    });

    // add db permissions
    props.table.grantReadWriteData(create);
    props.table.grantReadWriteData(getAll);
    props.table.grantReadWriteData(getOne);
    props.table.grantReadWriteData(update);
    props.table.grantReadWriteData(destroy);

    // generate integrations
    this.intergrations = {
      create: new LambdaIntegration(create),
      getAll: new LambdaIntegration(getAll),
      getOne: new LambdaIntegration(getOne),
      update: new LambdaIntegration(update),
      destroy: new LambdaIntegration(destroy),
    };
  }
}
