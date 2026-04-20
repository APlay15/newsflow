import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import postRoutes from './routes/post.routes.js'
import { notFound, globalErrorHandler } from './middlewares/errorHandler.js'

const app = express()

app.use(helmet())
app.use(morgan('dev'))

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((url) => url.trim())

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS: origen ${origin} no permitido`))
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Rutas
app.use('/api/posts', postRoutes)

// Errores
app.use(notFound)
app.use(globalErrorHandler)

export default app