import type { ServerResponse } from 'node:http'

import { sendError } from '../http/response.utils.js'
import { HttpError } from './http-error.js'

const isPostgresError = (
	error: unknown,
): error is { code?: string; constraint?: string } => {
	return error instanceof Error && 'code' in error
}

export const handleError = (error: unknown, res: ServerResponse) => {
	if (error instanceof HttpError) {
		sendError(res, error.statusCode, error.message)
		return
	}
	if (
		isPostgresError(error) &&
		error.code === '23505' &&
		error.constraint === 'users_email_key'
	) {
		sendError(res, 409, 'Email already exists')
		return
	}
	console.error(error)
	sendError(res, 500, 'Internal server error')
}
