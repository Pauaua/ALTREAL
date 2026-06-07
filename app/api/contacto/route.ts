import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, email, motivo, mensaje } = body

    if (!nombre || !email || !motivo || !mensaje) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'El formato del correo electrónico no es válido.' },
        { status: 400 }
      )
    }

    await prisma.contactMessage.create({
      data: {
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        motivo: motivo.trim(),
        mensaje: mensaje.trim(),
      },
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Error al guardar mensaje de contacto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor. Por favor intenta nuevamente.' },
      { status: 500 }
    )
  }
}
