import http from 'node:http'

import { router } from './router.js'

export const server = http.createServer(router)
const port = Number(process.env.PORT) || 3000

server.listen(port, () => {
	console.log(`Сервер успешно запущен на localhost:${port}`)
})
