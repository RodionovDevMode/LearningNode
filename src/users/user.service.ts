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

export const getUsers = async ({
	city,
	search,
	sort,
	order,
	page,
	limit,
}: GetUsersParams): Promise<GetUsersResult> => {
	const dbUsers = await getUsersFromDb()
	const filteredUsers = city
		? dbUsers.filter(user => user.city === city)
		: dbUsers

	const normalizedSearch = search === null ? null : search.trim().toLowerCase()

	const searchedUsers = normalizedSearch
		? filteredUsers.filter(user =>
				user.name.toLowerCase().includes(normalizedSearch),
			)
		: filteredUsers

	const sortedUsers = [...searchedUsers]

	if (sort === 'name') {
		sortedUsers.sort((a, b) => a.name.localeCompare(b.name))
	}

	if (sort === 'age') {
		sortedUsers.sort((a, b) => a.age - b.age)
	}

	if (sort && order === 'desc') {
		sortedUsers.reverse()
	}

	const total = searchedUsers.length
	const totalPages = Math.ceil(total / limit)

	const startIndex = (page - 1) * limit
	const endIndex = startIndex + limit

	const paginatedUsers = sortedUsers.slice(startIndex, endIndex)

	return {
		data: paginatedUsers,
		pagination: {
			page,
			limit,
			total,
			totalPages,
		},
	}
}
