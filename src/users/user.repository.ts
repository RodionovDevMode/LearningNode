import { db } from '../database/db.js'
import type { User, CreateUserData, UpdateUserData } from './user.types.js'

export const getUsersFromDb = async (): Promise<User[]> => {
	const result = await db.query<User>('SELECT * FROM users ORDER BY id')
	return result.rows
}

export const getUserByIdFromDb = async (
	id: number,
): Promise<User | undefined> => {
	const result = await db.query<User>('SELECT * FROM users WHERE id = $1', [id])
	return result.rows[0]
}

export const createUserInDb = async (data: CreateUserData): Promise<User> => {
	const result = await db.query<User>(
		`INSERT INTO users (name,age,email,city) VALUES ($1,$2,$3,$4) RETURNING *`,
		[data.name, data.age, data.email, data.city],
	)
	const createdUser = result.rows[0]
	if (!createdUser) {
		throw new Error('Failed to create user')
	}
	return createdUser
}

export const updateUserInDb = async (
	id: number,
	data: UpdateUserData,
): Promise<User | undefined> => {
	const result = await db.query<User>(
		`
		UPDATE users
		SET
		name = COALESCE($1, name),
		age = COALESCE($2,age),
		email = COALESCE($3, email),
		city = COALESCE($4, city)
		WHERE id = $5
		RETURNING *
		`,
		[
			data.name ?? null,
			data.age ?? null,
			data.email ?? null,
			data.city ?? null,
			id,
		],
	)
	return result.rows[0]
}

export const deleteUserFromDb = async (
	id: number,
): Promise<User | undefined> => {
	const result = await db.query<User>(
		`
		DELETE FROM users
		WHERE id = $1
		RETURNING *
		`,
		[id],
	)
	return result.rows[0]
}
