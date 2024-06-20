import { Stack, StackProps } from "aws-cdk-lib";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

export class AuthStack extends Stack {
  public readonly userPool: UserPool;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.userPool = new UserPool(this, "DemoUserPool", {
      signInCaseSensitive: false,
      selfSignUpEnabled: true,
      signInAliases: {
        username: true,
        email: true,
      },
    });

    this.userPool.addClient("DemoUserPoolClient", {
      preventUserExistenceErrors: true,
      enableTokenRevocation: true,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
    });
  }
}
