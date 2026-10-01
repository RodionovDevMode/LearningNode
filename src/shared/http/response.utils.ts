import type { ServerResponse } from 'node:http'

export const sendJson = (
	res: ServerResponse,
	status: number,
	data: unknown,
) => {
	res.statusCode = status
	res.setHeader('Content-Type', 'application/json')
	res.end(JSON.stringify(data))
}

export const sendError = (
	res: ServerResponse,
	status: number,
	message: string,
) => {
	res.statusCode = status
	res.setHeader('Content-Type', 'application/json')
	res.end(
		JSON.stringify({
			error: message,
		}),
	)
}
