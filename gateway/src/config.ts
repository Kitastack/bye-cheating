import { addAliases } from 'module-alias'
import dotenv from 'dotenv'
import path from 'node:path'
import 'module-alias/register'

addAliases({
  '@src': `${__dirname}`,
  '@libs': `${__dirname}/libs`
})

dotenv.config()
dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
})
const PORT = +(process.env.PORT ?? 8080)

// todo: setup global definition
declare global {
  var PORT: number
}

globalThis.PORT = PORT
