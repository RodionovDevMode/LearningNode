export interface User {
	id: number
	name: string
	age: number
	email: string
	city: string
}

export interface UpdateUserData {
	name?: string
	age?: number
	email?: string
	city?: string
}

export interface CreateUserData {
	name: string
	age: number
	email: string
	city: string
}
