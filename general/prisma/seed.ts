import { PrismaClient } from '../prisma_dist'
import { randomUUID } from 'crypto'
import { hash, genSalt } from 'bcrypt'
const prisma = new PrismaClient()
const Admin = 'Admin'
const generatePassword = async (password: string) => {
  try {
    const newPassword: string = await genSalt(12).then(async (salt: string) => {
      return await hash(password, salt).then((hash: string) => {
        return hash
      })
    })
    if (!newPassword) throw new Error('password no result')
    return newPassword
  } catch (error) {
    throw error
  }
}
async function systemUser() {
  try {
    const admin = await prisma.user.create({
      data: {
        id: randomUUID(),
        email: 'admin@byecheating.com',
        name: 'Admin Byecheating',
        roles: [Admin],
        isVerified: true,
        password: await generatePassword('@aBcDeFgHiJk12345')
      }
    })
    console.log('log - user admin created', admin)
    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        email: 'basic@byecheating.com',
        name: 'Basic Byecheating',
        isVerified: true,
        password: await generatePassword('@aBcDeFgHiJk12345')
      }
    })
    console.log('log - user created', user)
  } catch (error) {
    console.log(error)
  }
}
async function main() {
  systemUser()
}
main()
