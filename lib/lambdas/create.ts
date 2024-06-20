import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { randomUUID } from "crypto";

const TABLE_NAME = process.env.TABLE_NAME || "";

const db = DynamoDBDocument.from(new DynamoDB());

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    return { statusCode: 400, body: "Invalid request" };
  }

  try {
    const item =
      typeof event.body === "object" ? event.body : JSON.parse(event.body);

    item["id"] = randomUUID();
    await db.put({ TableName: TABLE_NAME, Item: item });

    return { statusCode: 201, body: "" };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify(error) };
  }
}
