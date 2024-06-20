import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const TABLE_NAME = process.env.TABLE_NAME || "";

const db = DynamoDBDocument.from(new DynamoDB());

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const response = await db.scan({
      TableName: TABLE_NAME,
    });

    return { statusCode: 200, body: JSON.stringify(response.Items) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify(error) };
  }
}
