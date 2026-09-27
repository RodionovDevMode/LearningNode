import { userInfo } from 'node:os'
import type { CreateUserData, UpdateUserData } from './user.types.js'

export const isCreateUserData = (data: unknown): data is CreateUserData => {
	if (typeof data !== 'object' || data === null) {
		return false
	}
	const user = data as Record<string, unknown>

	if (typeof user.name !== 'string') {
		return false
	}
	if (typeof user.age !== 'number') {
		return false
	}
	if (typeof user.email !== 'string') {
		return false
	}
	if (typeof user.city !== 'string') {
		return false
	}
	return true
}

export const isUpdateUserData = (data: unknown): data is UpdateUserData => {
	if (typeof data !== 'object' || data === null) {
		return false
	}

	const user = data as Record<string, unknown>

	if (user.name !== undefined && typeof user.name !== 'string') {
		return false
	}
	if (user.age !== undefined && typeof user.age !== 'number') {
		return false
	}
	if (user.email !== undefined && typeof user.email !== 'number') {
		return false
	}
	if (user.city !== undefined && typeof user.city !== 'string') {
		return false
	}
	return true
}
