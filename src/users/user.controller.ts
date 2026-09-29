import type { IncomingMessage, ServerResponse } from 'node:http'
import { readRequestBody } from '../shared/http/request.utils.js'
import { users } from './user.data.js'
import {
	createUser,
	deleteUser,
	getUserById,
	updateUser,
} from './user.service.js'
import { isCreateUserData, isUpdateUserData } from './user.validation.js'

export const getUsersController = (
	req: IncomingMessage,
	res: ServerResponse,
) => {
	const url = new URL(req.url ?? '/', `http://${req.headers.host}`)

	const city = url.searchParams.get('city')

	const filteredUsers = city ? users.filter(user => user.city === city) : users

	res.statusCode = 200
	res.setHeader('Content-Type', 'application/json')
	res.end(JSON.stringify(filteredUsers))
	return
}

export const getUserByIdController = (
	req: IncomingMessage,
	res: ServerResponse,
) => {
	const url = new URL(req.url ?? '/', `http://${req.headers.host}`)
	const id = Number(url.pathname.split('/')[2])

	if (!Number.isInteger(id) || id <= 0) {
		res.statusCode = 400
		res.end('Invalid user id')
		return
	}

	const user = getUserById(id)
	if (!user) {
		res.statusCode = 404
		res.end('User not found')
		return
	}
	res.statusCode = 200
	res.setHeader('Content-Type', 'application/json')
	res.end(JSON.stringify(user))
	return
}

export const createUserController = async (
	req: IncomingMessage,
	res: ServerResponse,
) => {
	try {
		const body = await readRequestBody(req)
		const data: unknown = JSON.parse(body)

		if (!isCreateUserData(data)) {
			res.statusCode = 400
			res.end('Invalid user data')
			return
		}
		const newUser = createUser(data)

		res.statusCode = 201
		res.setHeader('Content-Type', 'application/json')
		res.end(JSON.stringify(newUser))
	} catch (error) {
		if (error instanceof SyntaxError) {
			res.statusCode = 400
			res.end('Invalid JSON')
			return
		}

		console.error(error)
		res.statusCode = 500
		res.end('Internal Server Error')
	}
}

export const updateUserController = async (
	req: IncomingMessage,
	res: ServerResponse,
) => {
	const url = new URL(req.url ?? '/', `http://${req.headers.host}`)
	const id = Number(url.pathname.split('/')[2])

	if (Number.isNaN(id)) {
		res.statusCode = 400
		res.end('Invalid user id')
		return
	}

	try {
		const body = await readRequestBody(req)
		const data: unknown = JSON.parse(body)

		if (!isUpdateUserData(data)) {
			res.statusCode = 400
			res.end('Invalid user data')
			return
		}

		const updatedUser = updateUser(id, data)

		if (!updatedUser) {
			res.statusCode = 404
			res.end('User not found')
			return
		}

		res.statusCode = 200
		res.setHeader('Content-Type', 'application/json')
		res.end(JSON.stringify(updatedUser))
	} catch (error) {
		if (error instanceof SyntaxError) {
			res.statusCode = 400
			res.end('Invalid JSON')
			return
		}

		console.error(error)
		res.statusCode = 500
		res.end('Internal Server Error')
	}
	return
}

export const deleteUserController = (
	req: IncomingMessage,
	res: ServerResponse,
) => {
	const url = new URL(req.url ?? '/', `http://${req.headers.host}`)
	const id = Number(url.pathname.split('/')[2])

	if (Number.isNaN(id)) {
		res.statusCode = 400
		res.end('Invalid ID')

		return
	}

	const deleted = deleteUser(id)

	if (!deleted) {
		res.statusCode = 404
		res.end('User not found')
		return
	}

	res.statusCode = 200
	res.setHeader('Content-Type', 'application/json')
	res.end(JSON.stringify(deleted))
	return
}
