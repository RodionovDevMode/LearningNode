import type { IncomingMessage } from 'node:http'
import { Readable } from 'node:stream'
import { describe, expect, it } from 'vitest'

import { readRequestBody } from './request.utils.js'

describe('readRequestBody', () => {
	it('should preserve UTF-8 characters split across chunks', async () => {
		const originalText = 'Андрей 🚀'

		const buffer = Buffer.from(originalText, 'utf8')

		const firstChunk = buffer.subarray(0, buffer.length - 2)
		const secondChunk = buffer.subarray(buffer.length - 2)

		const stream = Readable.from([firstChunk, secondChunk])

		const result = await readRequestBody(stream as IncomingMessage)

		expect(result).toBe(originalText)
	})

	it('should accept request body exactly at 100 KiB limit', async () => {
		const body = 'A'.repeat(100 * 1024)

		const stream = Readable.from([Buffer.from(body, 'utf8')])

		const result = await readRequestBody(stream as IncomingMessage)

		expect(result).toBe(body)
	})

	it('should reject request body exceeding 100 KiB', async () => {
		const body = 'A'.repeat(100 * 1024 + 1)

		const stream = Readable.from([Buffer.from(body, 'utf8')])

		await expect(
			readRequestBody(stream as IncomingMessage),
		).rejects.toMatchObject({
			statusCode: 413,
		})
	})
})
