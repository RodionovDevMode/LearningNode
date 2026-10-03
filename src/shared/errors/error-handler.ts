import type { ServerResponse } from 'node:http'

import { sendError } from '../http/response.utils.js'
import { HttpError } from './http-error.js'

export const handleError = (error: unknown, res: ServerResponse) => {
	if (error instanceof HttpError) {
		sendError(res, error.statusCode, error.message)
		return
	}
	console.error(error)
	sendError(res, 500, 'Internal server error')
}
