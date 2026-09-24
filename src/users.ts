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

export const users: User[] = [
	{
		id: 1,
		name: 'Alex',
		age: 25,
		email: 'alex@mail.ru',
		city: 'Moscow',
	},
	{
		id: 2,
		name: 'Max',
		age: 31,
		email: 'max@mail.ru',
		city: 'Kazan',
	},
	{
		id: 3,
		name: 'Anna',
		age: 28,
		email: 'anna@mail.ru',
		city: 'Saint Petersburg',
	},
]
