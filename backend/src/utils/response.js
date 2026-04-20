export function successResponse(res, data, message = 'OK', statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data })
}

export function errorResponse(res, message, statusCode = 500, errors = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  })
}