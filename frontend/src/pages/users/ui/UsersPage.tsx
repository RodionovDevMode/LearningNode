import { useEffect, useMemo, useState } from 'react'

import { UserSearch } from '../../../features/user-search'
import {
	UsersTable,
	type User,
	type UsersResponse,
} from '../../../entities/user'

export const UsersPage = () => {
	const [users, setUsers] = useState<User[]>([])
	const [search, setSearch] = useState('')

	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const controller = new AbortController()

		async function loadUsers() {
			try {
				const response = await fetch('/api/users', {
					signal: controller.signal,
				})
				if (!response.ok) {
					throw new Error(`HTTP ${response.status}`)
				}
				const result: UsersResponse = await response.json()
				setUsers(result.data)
			} catch (err) {
				if (controller.signal.aborted) return
				setError(err instanceof Error ? err.message : 'Ошибка загрузки')
			} finally {
				if (!controller.signal.aborted) {
					setLoading(false)
				}
			}
		}
		void loadUsers()
		return () => controller.abort()
	}, [])

	const filteredUsers = useMemo(() => {
		return users.filter(user =>
			user.name.toLowerCase().includes(search.toLowerCase()),
		)
	}, [users, search])

	if (loading) return <p>Загрузка пользователей...</p>
	if (error) return <p>Ошибка: {error}</p>

	return (
		<main>
			<h1>LearningNode CRM</h1>

			<UserSearch value={search} onChange={setSearch} />
			<UsersTable users={filteredUsers} />
		</main>
	)
}
