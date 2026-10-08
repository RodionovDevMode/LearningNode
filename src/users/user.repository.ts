import { db } from '../database/db.js'
import type { User, CreateUserData, UpdateUserData } from './user.types.js'
import type { GetUsersParams } from './user.types.js'

export const getUsersFromDb = async ({
	city,
	search,
	sort,
	order,
	page,
	limit,
}: GetUsersParams): Promise<{
	users: User[]
	total: number
}> => {
	const conditions: string[] = []
	const filterValues: unknown[] = []

	if (city) {
		filterValues.push(city)
		conditions.push(`city = $${filterValues.length}`)
	}

	if (search) {
		filterValues.push(`%${search.trim()}%`)
		conditions.push(`name ILIKE $${filterValues.length}`)
	}

	const whereClause =
		conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

	let orderByClause = 'ORDER BY id ASC'

	if (sort === 'name') {
		orderByClause =
			order === 'desc'
				? 'ORDER BY name DESC, id DESC'
				: 'ORDER BY name ASC, id ASC'
	}

	if (sort === 'age') {
		orderByClause =
			order === 'desc'
				? 'ORDER BY age DESC, id DESC'
				: 'ORDER BY age ASC, id ASC'
	}

	const countResult = await db.query<{ total: number }>(
		`
			SELECT COUNT(*)::int AS total
			FROM users
			${whereClause}
		`,
		filterValues,
	)

	const total = countResult.rows[0]?.total ?? 0

	const offset = (page - 1) * limit

	const queryValues = [...filterValues]

	queryValues.push(limit)
	const limitParam = `$${queryValues.length}`

	queryValues.push(offset)
	const offsetParam = `$${queryValues.length}`

	const usersResult = await db.query<User>(
		`
			SELECT *
			FROM users
			${whereClause}
			${orderByClause}
			LIMIT ${limitParam}
			OFFSET ${offsetParam}
		`,
		queryValues,
	)

	return {
		users: usersResult.rows,
		total,
	}
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
