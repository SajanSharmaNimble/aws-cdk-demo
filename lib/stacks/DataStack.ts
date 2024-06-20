import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, TableV2 } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import getSuffix from "../utils/getSuffix";

export class DataStack extends Stack {
  public readonly table: TableV2;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.table = new TableV2(this, "DemoTable", {
      partitionKey: { name: "id", type: AttributeType.STRING },
      tableName: `DemoTable-${getSuffix(this)}`,
      removalPolicy: RemovalPolicy.DESTROY, // not recommended for production
    });
  }
}
