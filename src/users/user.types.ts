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

export type SortFiled = 'name' | 'age'
export type SortOrder = 'asc' | 'desc'

export type GetUsersParams = {
	city: string | null
	search: string | null
	sort: SortFiled | null
	order: SortOrder
	page: number
	limit: number
}

export type GetUsersResult = {
	data: User[]
	pagination: {
		page: number
		limit: number
		total: number
		totalPages: number
	}
}
