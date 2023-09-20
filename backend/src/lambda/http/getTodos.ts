import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../utils'
import { getTodos } from '../../businessLogic/todos'

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)

    // Extract the searchQuery parameter from the event's queryStringParameters
    const searchQuery = event.queryStringParameters?.searchQuery || ''

    const todos = await getTodos(userId, searchQuery) // Pass the searchQuery to the getTodos function

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todos
      })
    }
  }
)
handler.use(
  cors({
    credentials: true
  })
)
