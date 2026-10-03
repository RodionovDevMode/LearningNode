import http from 'node:http'

import { router } from './router.js'

export const server = http.createServer(router)
