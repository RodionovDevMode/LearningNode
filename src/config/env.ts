const port = Number(process.env.PORT)

export const env = {
	port: Number.isInteger(port) && port > 0 ? port : 3000,
}
