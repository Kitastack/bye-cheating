import { Request, Response, NextFunction } from 'express'
import { networkInterfaces } from 'node:os'

export async function corsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // dynamic
  // res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Origin', req.headers.origin || '')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'POST, PATCH, DELETE, GET')
    res.status(200).json({})
    return
  }

  if (req.path.includes('/favicon.ico')) {
    res.status(204).end()
    return
  }

  const isFromInternal = req.headers['x-from-internal'] == 'true'
  if (isFromInternal && req.ip?.includes('172.')) {
    req.isInternal = true
  } else {
    req.isInternal = false
  }

  let ip =
    req.headers['x-forwarded-for']?.toString().split(',')[0] ||
    req.socket.remoteAddress ||
    ''
  if (ip === '::1' || ip === '127.0.0.1') {
    ip = 'localhost'
  }
  const userAgent = req.headers['user-agent'] || ''
  req.ipAddress = `${ip} | User-Agent: ${userAgent}`

  next()
}

export function hidePoweredByHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  req.app.disable('X-Powered-By')
  res.removeHeader('X-Powered-By')
  next()
}
