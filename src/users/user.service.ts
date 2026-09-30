import type {
	CreateUserData,
	UpdateUserData,
	User,
	GetUsersParams,
	GetUsersResult,
} from './user.types.js'
import { users } from './user.data.js'

export const getUserById = (id: number): User | undefined => {
	const user = users.find(user => user.id === id)
	if (!user) {
		return undefined
	}
	return user
}

export const createUser = (data: CreateUserData): User => {
	const newId =
		users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1
	const newUser: User = {
		id: newId,
		...data,
	}
	users.push(newUser)
	return newUser
}

export const updateUser = (
	id: number,
	data: UpdateUserData,
): User | undefined => {
	const foundUser = users.find(user => user.id === id)
	if (!foundUser) {
		return undefined
	}
	if (data.name !== undefined) {
		foundUser.name = data.name
	}
	if (data.age !== undefined) {
		foundUser.age = data.age
	}
	if (data.email !== undefined) {
		foundUser.email = data.email
	}
	if (data.city !== undefined) {
		foundUser.city = data.city
	}
	return foundUser
}

export const deleteUser = (id: number): User | undefined => {
	const userIndex = users.findIndex(user => user.id === id)

	if (userIndex === -1) {
		return undefined
	}
	const deletedUsers = users.splice(userIndex, 1)
	return deletedUsers[0]
}

export const getUsers = ({
	city,
	search,
	sort,
	order,
	page,
	limit,
}: GetUsersParams): GetUsersResult => {
	const filteredUsers = city ? users.filter(user => user.city === city) : users

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
