import { describe, expect, it } from 'vitest'
import { isCreateUserData, isUpdateUserData } from './user.validation.js'

describe('isCreateUserData', () => {
	it('Should return true for valid user data', () => {
		const user = {
			name: 'Andrei',
			age: 32,
			email: 'andrei@example.com',
			city: 'Moscow',
		}
		const result = isCreateUserData(user)
		expect(result).toBe(true)
	})

	it('Should return false for negative age', () => {
		const user = {
			name: 'Andrei',
			age: -5,
			email: 'andrei@example.com',
			city: 'Moscow',
		}
		const result = isCreateUserData(user)
		expect(result).toBe(false)
	})

	it('Should return false when email is missing', () => {
		const user = {
			name: 'Andrei',
			age: 32,
			city: 'Moscow',
		}
		const result = isCreateUserData(user)
		expect(result).toBe(false)
	})

	it('should return false for null', () => {
		expect(isCreateUserData(null)).toBe(false)
	})

	it('should return false for invalid email', () => {
		const user = {
			name: 'Andrei',
			age: 32,
			email: '@',
			city: 'Moscow',
		}
		const result = isCreateUserData(user)
		expect(result).toBe(false)
	})
})

describe('isUpdateUserData', () => {
	it('Should return true when updating only name', () => {
		const data = {
			name: 'Andrei',
		}
		const result = isUpdateUserData(data)
		expect(result).toBe(true)
	})

	it('should return false for empty object', () => {
		const data = {}
		const result = isUpdateUserData(data)
		expect(result).toBe(false)
	})

	it('Should return false for negative age', () => {
		const data = {
			age: -5,
		}
		const result = isUpdateUserData(data)
		expect(result).toBe(false)
	})

	it('should reject update when one of the fields is invalid', () => {
		const data = {
			name: 'Andrei',
			age: -5,
		}
		const result = isUpdateUserData(data)
		expect(result).toBe(false)
	})

	it('should accept a valid email', () => {
		const data = {
			email: 'andrei@example.com',
		}
		const result = isUpdateUserData(data)
		expect(result).toBe(true)
	})

	it('Should reject for no correct email', () => {
		const data = {
			email: '@',
		}
		const result = isUpdateUserData(data)
		expect(result).toBe(false)
	})

	it('Should return false for null', () => {
		expect(isUpdateUserData(null)).toBe(false)
	})

	it('should reject age greater than 100', () => {
		const data = {
			age: 101,
		}
		const result = isUpdateUserData(data)
		expect(result).toBe(false)
	})

	it('Expect false for empty name', () => {
		const data = {
			name: '',
		}
		const result = isUpdateUserData(data)
		expect(result).toBe(false)
	})

	it('should intentionally fail CI', () => {
		expect(1).toBe(2)
	})
})
