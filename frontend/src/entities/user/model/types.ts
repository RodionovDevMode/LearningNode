export type User = {
	id: number
	name: string
	age: number
	email: string
	city: string
}

export type UsersResponse = {
	data: User[]
	pagination: {
		page: number
		limit: number
		total: number
		totalPages: number
	}
}
