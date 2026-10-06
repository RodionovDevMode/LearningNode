import {
	createUserInDb,
	deleteUserFromDb,
	getUserByIdFromDb,
	getUsersFromDb,
	updateUserInDb,
} from './user.repository.js'
import type {
	CreateUserData,
	GetUsersParams,
	GetUsersResult,
	UpdateUserData,
	User,
} from './user.types.js'

export const getUserById = async (id: number): Promise<User | undefined> => {
	return await getUserByIdFromDb(id)
}

export const createUser = async (data: CreateUserData): Promise<User> => {
	return await createUserInDb(data)
}

export const updateUser = async (
	id: number,
	data: UpdateUserData,
): Promise<User | undefined> => {
	return await updateUserInDb(id, data)
}

export const deleteUser = async (id: number): Promise<User | undefined> => {
	return await deleteUserFromDb(id)
}

export const getUsers = async (
	params: GetUsersParams,
): Promise<GetUsersResult> => {
	const { page, limit } = params

	const { users, total } = await getUsersFromDb(params)

	const totalPages = Math.ceil(total / limit)

	return {
		data: users,
		pagination: {
			page,
			limit,
			total,
			totalPages,
		},
	}
}
