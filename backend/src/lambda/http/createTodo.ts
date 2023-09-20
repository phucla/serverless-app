import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { CreateTodoRequest } from "../../requests/CreateTodoRequest";
import { getUserId } from "../utils";
import { createTodo } from "../../businessLogic/todos";
import { createLogger } from "../../utils/logger";

const logger = createLogger("createTodo");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body);
    const userId = getUserId(event);
    try {
      const item = await createTodo(newTodo, userId);
      return {
        statusCode: 201,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ item }),
      };
    } catch (error) {
      logger.info("Error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error }),
      };
    }
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
