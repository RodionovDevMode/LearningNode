import type { IncomingMessage, ServerResponse } from 'node:http'

import {
	createUserController,
	deleteUserController,
	getUserByIdController,
	getUsersController,
	updateUserController,
} from './users/user.controller.js'

import { sendError } from './shared/http/response.utils.js'
import { handleError } from './shared/errors/error-handler.js'

export const router = async (req: IncomingMessage, res: ServerResponse) => {
	try {
		const url = new URL(
			req.url ?? '/',
			`http://${req.headers.host ?? 'localhost'}`,
		)
		const pathParts = url.pathname.split('/').filter(Boolean)
		const isUserByIdRoute = pathParts.length === 2 && pathParts[0] === 'users'

		if (req.method === 'GET' && url.pathname === '/users') {
			await getUsersController(req, res)
			return
		}

		if (req.method === 'GET' && isUserByIdRoute) {
			await getUserByIdController(req, res)
			return
		}

		if (req.method === 'POST' && url.pathname === '/users') {
			await createUserController(req, res)
			return
		}

		if (req.method === 'PATCH' && isUserByIdRoute) {
			await updateUserController(req, res)
			return
		}

		if (req.method === 'DELETE' && isUserByIdRoute) {
			await deleteUserController(req, res)
			return
		}
		sendError(res, 404, 'Not Found')
	} catch (error) {
		handleError(error, res)
	}
}
