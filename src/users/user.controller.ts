import type { IncomingMessage, ServerResponse } from 'node:http'
import { readRequestBody } from '../shared/http/request.utils.js'
import {
	createUser,
	deleteUser,
	getUserById,
	getUsers,
	updateUser,
} from './user.service.js'
import {
	isCreateUserData,
	isUpdateUserData,
} from './validation/user.validation.js'
import { parseGetUsersQuery } from './validation/user.query.js'
import { sendError, sendJson } from '../shared/http/response.utils.js'
import { HttpError } from '../shared/errors/http-error.js'

export const getUsersController = (
	req: IncomingMessage,
	res: ServerResponse,
) => {
	const url = new URL(req.url ?? '/', `http://${req.headers.host}`)
	const parsedQuery = parseGetUsersQuery(url.searchParams)

	if (!parsedQuery.success) {
		sendError(res, 400, parsedQuery.error)
		return
	}
	const result = getUsers(parsedQuery.data)

	sendJson(res, 200, result)
}

export const getUserByIdController = (
	req: IncomingMessage,
	res: ServerResponse,
) => {
	const url = new URL(req.url ?? '/', `http://${req.headers.host}`)
	const id = Number(url.pathname.split('/')[2])

	if (!Number.isInteger(id) || id <= 0) {
		sendError(res, 400, 'Invalid user id')
		return
	}

	const user = getUserById(id)
	if (!user) {
		sendError(res, 404, 'User not found')
		return
	}
	sendJson(res, 200, user)
	return
}

export const createUserController = async (
	req: IncomingMessage,
	res: ServerResponse,
) => {
	throw new Error('Test unexpected error')
	const body = await readRequestBody(req)

	let data: unknown

	try {
		data = JSON.parse(body)
	} catch {
		throw new HttpError(400, 'Invalid JSON')
	}

	if (!isCreateUserData(data)) {
		sendError(res, 400, 'Invalid user data')
		return
	}

	const newUser = createUser(data)

	sendJson(res, 201, newUser)
}

export const updateUserController = async (
	req: IncomingMessage,
	res: ServerResponse,
) => {
	const url = new URL(req.url ?? '/', `http://${req.headers.host}`)
	const id = Number(url.pathname.split('/')[2])

	if (!Number.isInteger(id) || id <= 0) {
		sendError(res, 400, 'Invalid user id')
		return
	}

	const body = await readRequestBody(req)

	let data: unknown

	try {
		data = JSON.parse(body)
	} catch {
		throw new HttpError(400, 'Invalid JSON')
	}

	if (!isUpdateUserData(data)) {
		sendError(res, 400, 'Invalid user data')
		return
	}

	const updatedUser = updateUser(id, data)

	if (!updatedUser) {
		sendError(res, 404, 'User not found')
		return
	}

	sendJson(res, 200, updatedUser)
}

export const deleteUserController = (
	req: IncomingMessage,
	res: ServerResponse,
) => {
	const url = new URL(req.url ?? '/', `http://${req.headers.host}`)
	const id = Number(url.pathname.split('/')[2])

	if (!Number.isInteger(id) || id <= 0) {
		sendError(res, 400, 'Invalid id')

		return
	}

	const deleted = deleteUser(id)

	if (!deleted) {
		sendError(res, 404, 'User not found')
		return
	}

	sendJson(res, 200, deleted)
	return
}
