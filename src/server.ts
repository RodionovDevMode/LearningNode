import http from 'node:http'
import { users } from './users.js'
import {
	createUser,
	deleteUser,
	getUserById,
	updateUser,
} from './user.service.js'

export const server = http.createServer((req, res) => {
	if (req.method === 'GET' && req.url === '/users') {
		res.statusCode = 200
		res.setHeader('Content-Type', 'application/json')
		res.end(JSON.stringify(users))
		return
	}
	if (req.method === 'GET' && req.url?.startsWith('/users/')) {
		const id = Number(req.url.split('/')[2])
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
	if (req.method === 'POST' && req.url === '/users') {
		let body = ''
		req.on('data', chunk => {
			body += chunk
		})
		req.on('end', () => {
			try {
				const data = JSON.parse(body)
				const newUser = createUser(data)
				res.statusCode = 201
				res.setHeader('Content-Type', 'application/json')
				res.end(JSON.stringify(newUser))
			} catch {
				res.statusCode = 400
				res.end('Invalid JSON')
			}
		})
		return
	}
	if (req.method === 'PATCH' && req.url?.startsWith('/users/')) {
		const id = Number(req.url.split('/')[2])
		if (Number.isNaN(id)) {
			res.statusCode = 400
			res.end('Invalid id')
			return
		}
		let body = ''
		req.on('data', chunk => {
			body += chunk
		})
		req.on('end', () => {
			try {
				const data = JSON.parse(body)
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
	if (req.method === 'DELETE' && req.url?.startsWith('/users/')) {
		const id = Number(req.url.split('/')[2])
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
	res.statusCode = 404
	res.end('Not Found')
})
server.listen(3000, () => {
	console.log('Сервер успешно запущен на localhost:3000')
})
