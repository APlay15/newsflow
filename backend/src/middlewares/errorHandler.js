export function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  })
}

export function globalErrorHandler(err, req, res, _next) {
  console.error('❌ Error:', err)
  const status = err.statusCode || 500
  const message = process.env.NODE_ENV === 'production'
    ? 'Error interno del servidor'
    : err.message
  res.status(status).json({ success: false, message })
}