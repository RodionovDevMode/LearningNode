import type { IncomingMessage } from 'node:http'
import { HttpError } from '../errors/http-error.js'

const MAX_BODY_SIZE = 100 * 1024

export const readRequestBody = (req: IncomingMessage): Promise<string> => {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = []
		let totalBytes = 0
		let isTooLarge = false

		req.on('data', chunk => {
			if (isTooLarge) {
				return
			}
			totalBytes += chunk.length
			if (totalBytes > MAX_BODY_SIZE) {
				isTooLarge = true
				reject(new HttpError(413, 'Request body is too large'))
				return
			}
			chunks.push(chunk)
		})
		req.on('end', () => {
			if (isTooLarge) {
				return
			}
			const body = Buffer.concat(chunks).toString('utf8')
			resolve(body)
		})
		req.on('error', error => {
			reject(error)
		})
	})
}
