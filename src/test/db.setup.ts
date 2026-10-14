import { beforeAll, afterAll } from 'vitest'
import { db } from '../database/db.js'
import { env } from '../config/env.js'

beforeAll(async () => {
	if (env.db.name !== 'learning_node_test') {
		throw new Error(`Unsafe database configuration: ${env.db.name}`)
	}

	const result = await db.query<{ database: string }>(
		'SELECT current_database() as database',
	)

	if (result.rows[0]?.database !== 'learning_node_test') {
		throw new Error('Integration tests require learning_node_test database')
	}
})
afterAll(async () => {
	await db.end()
})
