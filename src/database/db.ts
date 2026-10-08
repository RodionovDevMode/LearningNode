import { Pool } from 'pg'
import { env } from '../config/env.js'

export const db = new Pool({
	host: env.db.host,
	port: env.db.port,
	database: env.db.name,
	user: env.db.user,
})

db.on('error', error => {
	console.error('Unexpected PostgreSQL pool error:', error)
})
