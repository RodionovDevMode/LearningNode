import 'dotenv/config'

import { server } from './server.js'
import { env } from './config/env.js'

server.listen(env.port, () => {
	console.log(`Сервер успешно запущен на localhost:${env.port}`)
})
