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
    const response = await db.get({
      TableName: TABLE_NAME,
      Key: { id: itemId },
    });

    if (response.Item) {
      return { statusCode: 200, body: JSON.stringify(response.Item) };
    } else {
      return { statusCode: 404, body: "" };
    }
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify(error) };
  }
}
