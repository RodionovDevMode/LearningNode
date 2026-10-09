import type { CreateUserData, UpdateUserData } from '../user.types.js'

const isValidEmail = (email: string): boolean => {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export const isCreateUserData = (data: unknown): data is CreateUserData => {
	if (typeof data !== 'object' || data === null) {
		return false
	}
	const user = data as Record<string, unknown>

	const isValidName =
		typeof user.name === 'string' && user.name.trim().length > 0

	const isValidAge =
		typeof user.age === 'number' &&
		Number.isInteger(user.age) &&
		user.age > 0 &&
		user.age <= 100

	const hasValidEmail =
		typeof user.email === 'string' && isValidEmail(user.email)

	const isValidCity =
		typeof user.city === 'string' && user.city.trim().length > 0

	const hasAtLeastOneField =
		user.name !== undefined ||
		user.age !== undefined ||
		user.email !== undefined ||
		user.city !== undefined

	return (
		hasAtLeastOneField &&
		isValidName &&
		isValidAge &&
		hasValidEmail &&
		isValidCity
	)
}

export const isUpdateUserData = (data: unknown): data is UpdateUserData => {
	if (typeof data !== 'object' || data === null) {
		return false
	}

	const user = data as Record<string, unknown>

	const isValidName =
		user.name === undefined ||
		(typeof user.name === 'string' && user.name.trim().length > 0)

	const isValidAge =
		user.age === undefined ||
		(typeof user.age === 'number' &&
			Number.isInteger(user.age) &&
			user.age > 0 &&
			user.age <= 100)

	const hasValidEmail =
		user.email === undefined ||
		(typeof user.email === 'string' && isValidEmail(user.email))

	const isValidCity =
		user.city === undefined ||
		(typeof user.city === 'string' && user.city.trim().length > 0)

	const hasAtLeastOneField =
		user.name !== undefined ||
		user.age !== undefined ||
		user.email !== undefined ||
		user.city !== undefined

	return (
		hasAtLeastOneField &&
		isValidName &&
		isValidAge &&
		hasValidEmail &&
		isValidCity
	)
}
