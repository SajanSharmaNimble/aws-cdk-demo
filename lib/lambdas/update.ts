import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const TABLE_NAME = process.env.TABLE_NAME || "";

const db = DynamoDBDocument.from(new DynamoDB());

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    return { statusCode: 400, body: "Invalid request" };
  }

  const itemId = event.pathParameters?.id;

  if (itemId) {
    return { statusCode: 400, body: "Path parameter ID is required" };
  }

  const editedItem =
    typeof event.body === "object" ? event.body : JSON.parse(event.body);
  const editedItemProps = Object.keys(editedItem);

  if (!editedItemProps || editedItemProps.length < 1) {
    return { statusCode: 400, body: "No updates provided" };
  }

  const firstProperty = editedItemProps.splice(0, 1);
  const params: any = {
    TableName: TABLE_NAME,
    Key: {
      id: itemId,
    },
    UpdateExpression: `set ${firstProperty} = :${firstProperty}`,
    ExpressionAttributeValues: {},
    ReturnValues: "UPDATED_NEW",
  };
  params.ExpressionAttributeValues[`:${firstProperty}`] =
    editedItem[`${firstProperty}`];

  editedItemProps.forEach((property) => {
    params.UpdateExpression += `, ${property} = :${property}`;
    params.ExpressionAttributeValues[`:${property}`] = editedItem[property];
  });

  try {
    await db.update(params);
    return { statusCode: 204, body: "" };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify(error) };
  }
}
