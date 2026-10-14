import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['src/**/*.db.test.ts'],
		fileParallelism: false,
		setupFiles: ['./src/test/db.setup.ts'],
	},
})
