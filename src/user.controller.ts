import type { IncomingMessage, ServerResponse } from 'node:http'
import { users, type CreateUserData, type UpdateUserData } from './users.js'
import {
	createUser,
	deleteUser,
	getUserById,
	updateUser,
} from './user.service.js'

export const getUsersController = (
	_req: IncomingMessage,
	res: ServerResponse,
) => {
	res.statusCode = 200
	res.setHeader('Content-Type', 'application/json')
	res.end(JSON.stringify(users))
	return
}

export const getUserByIdController = (
	req: IncomingMessage,
	res: ServerResponse,
) => {
	const id = Number(req.url?.split('/')[2])
	if (Number.isNaN(id)) {
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

export const createUserController = (
	req: IncomingMessage,
	res: ServerResponse,
) => {
	let body = ''
	req.on('data', chunk => {
		body += chunk
	})
	req.on('end', () => {
		try {
			const data: CreateUserData = JSON.parse(body)
			const newUser = createUser(data)
			res.statusCode = 201
			res.setHeader('Content-Type', 'application/json')
			res.end(JSON.stringify(newUser))
		} catch {
			res.statusCode = 400
			res.end('Invalid JSON')
			return
		}
	})
	return
}

export const updateUserController = (
	req: IncomingMessage,
	res: ServerResponse,
) => {
	const id = Number(req.url?.split('/')[2])
	if (Number.isNaN(id)) {
		res.statusCode = 400
		res.end('Invalid user id')
		return
	}
	let body = ''
	req.on('data', chunk => {
		body += chunk
	})
	req.on('end', () => {
		try {
			const data: UpdateUserData = JSON.parse(body)
			const updatedUser = updateUser(id, data)
			if (!updatedUser) {
				res.statusCode = 404
				res.end('User not found')
				return
			}
			res.statusCode = 200
			res.setHeader('Content-Type', 'application/json')
			res.end(JSON.stringify(updatedUser))
		} catch {
			res.statusCode = 400
			res.end('Invalid JSON')
			return
		}
	})
	return
}

export const deleteUserController = (
	req: IncomingMessage,
	res: ServerResponse,
) => {
	const id = Number(req.url?.split('/')[2])
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
