import { readFile, writeFile, appendFile } from 'node:fs/promises'

const main = async () => {
	try {
		const message = await readFile('./src/data/message.txt', 'utf-8')

		await appendFile('./src/data/message.txt', '\nTest new message', 'utf-8')

		const readNewMessage = await readFile('./src/data/message.txt', 'utf-8')
		console.log(message)
		console.log(readNewMessage)
	} catch (error) {
		console.error(error)
	}
}
main()
