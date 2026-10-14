import type { AddressInfo } from 'node:net'
import { beforeAll, afterAll, describe, expect, it } from 'vitest'

import { server } from '../server.js'
import { db } from '../database/db.js'

let baseUrl: string

beforeAll(async () => {
	const database = await db.query<{
		name: string
	}>('SELECT current_database() AS name')

	if (database.rows[0]?.name !== 'learning_node_test') {
		throw new Error('Unsafe database for integration tests')
	}

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

describe('POST /users - PostgreSQL integration', () => {
	it('should return 409 for duplicate email', async () => {
		const email = `test-${crypto.randomUUID()}@example.com`

		const user = {
			name: 'Andrei',
			age: 32,
			email,
			city: 'Moscow',
		}

		try {
			const firstResponse = await fetch(`${baseUrl}/users`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(user),
			})

			expect(firstResponse.status).toBe(201)

			const secondResponse = await fetch(`${baseUrl}/users`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(user),
			})

			expect(secondResponse.status).toBe(409)

			const result = await db.query<{ count: number }>(
				'SELECT COUNT(*)::int AS count FROM users WHERE email = $1',
				[email],
			)

			expect(result.rows[0]?.count).toBe(1)
		} finally {
			await db.query('DELETE FROM users WHERE email = $1', [email])
		}
	})
})
