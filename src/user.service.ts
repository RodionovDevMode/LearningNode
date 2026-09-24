import type { User, CreateUserData, UpdateUserData } from './users.js'
import { users } from './users.js'

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
