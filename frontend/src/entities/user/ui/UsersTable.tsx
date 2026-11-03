import { memo } from 'react'
import type { User } from '../model/types'

type UsersTableProps = {
	users: User[]
}

export const UsersTable = memo(({ users }: UsersTableProps) => {
	return (
		<div className='table-wrapper'>
			<table className='users-table'>
				<thead>
					<tr>
						<th>ID</th>
						<th>Имя</th>
						<th>Email</th>
						<th>Возраст</th>
						<th>Город</th>
					</tr>
				</thead>
				<tbody>
					{users.map(user => (
						<tr key={user.id}>
							<td>{user.id}</td>
							<td>{user.name}</td>
							<td>{user.email}</td>
							<td>{user.age}</td>
							<td>{user.city}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
})
