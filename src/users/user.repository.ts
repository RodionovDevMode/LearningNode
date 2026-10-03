import { db } from '../database/db.js'
import type { User } from './user.types.js'

export const getUsersFromDb = async (): Promise<User[]> => {
	const result = await db.query<User>('SELECT * FROM users ORDER BY id')
	return result.rows
}
