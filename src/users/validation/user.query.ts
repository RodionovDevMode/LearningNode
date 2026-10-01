import type { GetUsersQueryResult } from '../user.types.js'

export const parseGetUsersQuery = (
	searchParams: URLSearchParams,
): GetUsersQueryResult => {
	const city = searchParams.get('city')
	const search = searchParams.get('search')
	const sort = searchParams.get('sort')
	const order = searchParams.get('order') ?? 'asc'
	const pageParam = searchParams.get('page')
	const limitParam = searchParams.get('limit')

	if (sort !== null && sort !== 'name' && sort !== 'age') {
		return {
			success: false,
			error: 'Invalid sort param',
		}
	}
	if (order !== 'asc' && order !== 'desc') {
		return {
			success: false,
			error: 'Invalid order param',
		}
	}

	const page = pageParam === null ? 1 : Number(pageParam)
	const limit = limitParam === null ? 10 : Number(limitParam)

	if (
		!Number.isInteger(page) ||
		!Number.isInteger(limit) ||
		page <= 0 ||
		limit <= 0
	) {
		return {
			success: false,
			error: 'Invalid pagination params',
		}
	}
	return {
		success: true,
		data: {
			city,
			search,
			sort,
			order,
			page,
			limit,
		},
	}
}
