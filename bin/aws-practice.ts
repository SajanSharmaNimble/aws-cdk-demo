#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { DataStack } from "../lib/stacks/DataStack";
import { LambdaStack } from "../lib/stacks/LambdaStack";
import { ApiStack } from "../lib/stacks/ApiStack";
import { AuthStack } from "../lib/stacks/AuthStack";

const app = new cdk.App();

const dataStack = new DataStack(app, "DataStack");
const authStack = new AuthStack(app, "AuthStack");

const lambdaStack = new LambdaStack(app, "LambdaStack", {
  table: dataStack.table,
});

const apiStack = new ApiStack(app, "ApiStack", {
  integrations: lambdaStack.intergrations,
  userPool: authStack.userPool,
});
