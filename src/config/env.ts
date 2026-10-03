const port = Number(process.env.PORT)
const dbPort = Number(process.env.DB_PORT)

export const env = {
	port: Number.isInteger(port) && port > 0 ? port : 3000,
	db: {
		host: process.env.DB_HOST ?? '/tmp',
		port: Number.isInteger(dbPort) && dbPort > 0 ? dbPort : 5432,
		name: process.env.DB_NAME ?? 'learning_node',
		user: process.env.DB_USER ?? '',
	},
}
