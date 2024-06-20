import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const TABLE_NAME = process.env.TABLE_NAME || "";

const db = DynamoDBDocument.from(new DynamoDB());

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const itemId = event.pathParameters?.id;

  if (!itemId) {
    return { statusCode: 400, body: "Path parameter ID is required" };
  }

  try {
    await db.delete({
      TableName: TABLE_NAME,
      Key: { id: itemId },
    });

    return { statusCode: 200, body: "" };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify(error) };
  }
}
