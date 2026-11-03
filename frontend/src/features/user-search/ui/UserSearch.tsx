type UserSearchProps = {
	value: string
	onChange: (value: string) => void
}

export const UserSearch = ({ value, onChange }: UserSearchProps) => {
	return (
		<input
			type='search'
			placeholder='Поиск по имени'
			value={value}
			onChange={event => onChange(event.target.value)}
		/>
	)
}
