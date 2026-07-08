import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const correo = process.env.SEED_ADMIN_EMAIL ?? 'admin@asamblealastorres.cl'
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'CambiarEstaClave123'

  const existente = await prisma.usuario.findUnique({ where: { correo } })
  if (existente) {
    console.log(`Ya existe un usuario con correo ${correo}, no se crea de nuevo.`)
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.usuario.create({
    data: {
      nombre: 'Administrador ALT',
      correo,
      passwordHash,
      activo: true,
      rol: 'ADMIN',
    },
  })

  console.log(`Usuario ADMIN creado: ${correo} / ${password}`)
  console.log('Cambia esta contraseña apenas inicies sesión.')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
