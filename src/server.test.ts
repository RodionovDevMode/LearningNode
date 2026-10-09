import type { AddressInfo } from 'node:net'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { server } from './server.js'

let baseUrl: string

beforeAll(async () => {
	await new Promise<void>(resolve => {
		server.listen(0, resolve)
	})

	const address = server.address() as AddressInfo
	baseUrl = `http://127.0.0.1:${address.port}`
})

afterAll(async () => {
	await new Promise<void>((resolve, reject) => {
		server.close(error => {
			if (error) reject(error)
			else resolve()
		})
	})
})

describe('HTTP API', () => {
	it('should return 404 for unknown route', async () => {
		const response = await fetch(`${baseUrl}/unknown`)
		expect(response.status).toBe(404)
	})

	it('should return 400 for invalid user data', async () => {
		const user = {
			name: 'Andrei',
			age: 32,
			email: '@',
			city: 'Moscow',
		}
		const response = await fetch(`${baseUrl}/users`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(user),
		})
		expect(response.status).toBe(400)
	})

	it('should return 413 for oversized request body', async () => {
		const largeBody = JSON.stringify({
			name: 'A'.repeat(110 * 1024),
			age: 32,
			email: 'andrei@example.com',
			city: 'Moscow',
		})

		const response = await fetch(`${baseUrl}/users`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: largeBody,
		})

		expect(response.status).toBe(413)
	})

	it('should return 400 for malformed JSON', async () => {
		const response = await fetch(`${baseUrl}/users`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: '{"name":',
		})
		expect(response.status).toBe(400)
	})
})
