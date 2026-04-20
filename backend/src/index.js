import 'dotenv/config'
import app from './app.js'
import { prisma } from './lib/prisma.js'

const PORT = process.env.PORT || 4000

async function bootstrap() {
  try {
    await prisma.$connect()
    console.log('Base de datos conectada')

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`)
      console.log(`Health check: http://localhost:${PORT}/health`)
    })
  } catch (error) {
    console.error('Error al iniciar:', error)
    process.exit(1)
  }
}

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  console.log('Servidor cerrado')
  process.exit(0)
})

bootstrap()