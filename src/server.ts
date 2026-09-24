import http from 'node:http'

import {
	createUserController,
	deleteUserController,
	getUserByIdController,
	getUsersController,
	updateUserController,
} from './user.controller.js'

export const server = http.createServer((req, res) => {
	if (req.method === 'GET' && req.url === '/users') {
		getUsersController(req, res)
		return
	}
	if (req.method === 'GET' && req.url?.startsWith('/users/')) {
		getUserByIdController(req, res)
		return
	}
	if (req.method === 'POST' && req.url === '/users') {
		createUserController(req, res)
		return
	}
	if (req.method === 'PATCH' && req.url?.startsWith('/users/')) {
		updateUserController(req, res)
		return
	}
	if (req.method === 'DELETE' && req.url?.startsWith('/users/')) {
		deleteUserController(req, res)
		return
	}
	res.statusCode = 404
	res.end('Not Found')
})
server.listen(3000, () => {
	console.log('Сервер успешно запущен на localhost:3000')
})
