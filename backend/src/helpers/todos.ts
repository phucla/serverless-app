import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'

const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()

export async function getTodos(
  userId: string,
  searchQuery: string
): Promise<TodoItem[]> {
  return todosAccess.getTodos(userId, searchQuery)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const todoId = uuid.v4()
  const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
  const newTodo: TodoItem = {
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    attachmentUrl: s3AttachmentUrl,
    done: false,
    ...createTodoRequest
  }

  return todosAccess.createTodoItem(newTodo)
}

export async function updateTodo(
  userId: string,
  todoId: string,
  updateTodoRequest: UpdateTodoRequest
): Promise<UpdateTodoRequest> {
  const todo = await todosAccess.getTodoItem(todoId, userId)

  if (!todo) throw new Error(`Can't find item with it: ${todoId}`)

  if (todo.userId !== userId) {
    throw new Error('User not authorized to update item')
  }

  return todosAccess.updateTodoItem(userId, todoId, updateTodoRequest)
}

export async function deleteTodo(
  todoId: string,
  userId: string
): Promise<void> {
  const item = await todosAccess.getTodoItem(todoId, userId)

  if (!item) throw new Error(`Can't delete item with it: ${todoId}`)

  if (item.userId !== userId) {
    throw new Error('User not authorized to delete item')
  }
  return todosAccess.deleteTodoItem(todoId, userId)
}

export async function createAttachmentPresignedUrl(
  todoId: string
): Promise<string> {
  return attachmentUtils.generateUploadUrl(todoId)
}

export async function getSortedTodos(
  userId: string,
  sortField: string,
  sortDirection: string
): Promise<TodoItem[]> {
  return todosAccess.sortTodosItem(userId, sortField, sortDirection)
}
