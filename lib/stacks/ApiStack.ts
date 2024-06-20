import { Stack, StackProps } from "aws-cdk-lib";
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  Cors,
  LambdaIntegration,
  MethodOptions,
  MockIntegration,
  PassthroughBehavior,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

interface ApiStackProps extends StackProps {
  integrations: { [name: string]: LambdaIntegration };
  userPool: UserPool;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, "API");

    const authorizer = new CognitoUserPoolsAuthorizer(this, "ApiAuthorizer", {
      cognitoUserPools: [props.userPool],
    });

    const methodOptions: MethodOptions = {
      authorizer,
      authorizationType: AuthorizationType.COGNITO,
    };

    const demo = api.root.addResource("demo", {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    });

    demo.addMethod("GET", props.integrations["getAll"], methodOptions);
    demo.addMethod("POST", props.integrations["create"], methodOptions);

    const demoItem = demo.addResource("{id}");
    demoItem.addMethod("GET", props.integrations["getOne"], methodOptions);
    demoItem.addMethod("PUT", props.integrations["update"], methodOptions);
    demoItem.addMethod("DELETE", props.integrations["delete"], methodOptions);
  }
}
