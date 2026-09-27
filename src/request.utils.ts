import type { IncomingMessage } from 'node:http'

export const readRequestBody = (req: IncomingMessage): Promise<string> => {
	return new Promise((resolve, reject) => {
		let body = ''
		req.on('data', chunk => {
			body += chunk
		})
		req.on('end', () => {
			resolve(body)
		})
		req.on('error', error => {
			reject(error)
		})
	})
}
