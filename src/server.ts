import http from 'node:http'

import {
	createUserController,
	deleteUserController,
	getUserByIdController,
	getUsersController,
	updateUserController,
} from './users/user.controller.js'

export const server = http.createServer((req, res) => {
	const url = new URL(
		req.url ?? '/',
		`http://${req.headers.host ?? 'localhost'}`,
	)

	const pathParts = url.pathname.split('/').filter(Boolean)
	const isUserByIdRoute = pathParts.length === 2 && pathParts[0] === 'users'

	if (req.method === 'GET' && url.pathname === '/users') {
		getUsersController(req, res)
		return
	}
	if (req.method === 'GET' && isUserByIdRoute) {
		getUserByIdController(req, res)
		return
	}
	if (req.method === 'POST' && url.pathname === '/users') {
		createUserController(req, res)
		return
	}
	if (req.method === 'PATCH' && isUserByIdRoute) {
		updateUserController(req, res)
		return
	}
	if (req.method === 'DELETE' && isUserByIdRoute) {
		deleteUserController(req, res)
		return
	}
	res.statusCode = 404
	res.end('Not Found')
})
const port = Number(process.env.PORT) || 3000

server.listen(port, () => {
	console.log(`Сервер успешно запущен на localhost:${port}`)
})
