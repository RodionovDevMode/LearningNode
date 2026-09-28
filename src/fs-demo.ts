import {
	appendFile,
	mkdir,
	readFile,
	rm,
	stat,
	unlink,
	writeFile,
} from 'node:fs/promises'

const main = async () => {
	try {
		const message = await readFile('./src/data/message.txt', 'utf-8')

		await appendFile('./src/data/message.txt', '\nTest new message', 'utf-8')

		const readNewMessage = await readFile('./src/data/message.txt', 'utf-8')

		await mkdir('./src/data/logs', {
			recursive: true,
		})

		const fileInfo = await stat('./src/data/message.txt')
		const logsInfo = await stat('./src/data/logs')

		console.log(message)
		console.log(readNewMessage)

		console.log('message.txt:')
		console.log(fileInfo.isFile())
		console.log(fileInfo.isDirectory())
		console.log(fileInfo.size)

		console.log('logs:')
		console.log(logsInfo.isFile())
		console.log(logsInfo.isDirectory())

		await writeFile('./src/data/temp.txt', 'This is test for temp.txt')

		const tempMessage = await readFile('./src/data/temp.txt', 'utf-8')

		console.log(tempMessage)
		await unlink('./src/data/temp.txt')

		await mkdir('./src/data/temp-folder', {
			recursive: true,
		})
		console.log('temp-folder created')
		await writeFile('./src/data/temp-folder/test.txt', 'utf-8')
		await rm('./src/data/temp-folder', {
			recursive: true,
		})
		console.log('temp-folder removed')
	} catch (error) {
		console.error(error)
	}
}

main()
