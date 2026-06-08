import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

    // Guardar en base de datos
    await prisma.contactMessage.create({
      data: {
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        motivo: motivo.trim(),
        mensaje: mensaje.trim(),
      },
    })

    // Enviar notificación por email
    await resend.emails.send({
      from: 'ALT Contacto <onboarding@resend.dev>',
      to: 'hola@asamblealastorres.cl',
      replyTo: email.trim(),
      subject: `Nuevo mensaje: ${motivo}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f4f2ee;">
          <div style="background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e5e7eb;">
            <div style="border-bottom: 2px solid #2a7a2a; padding-bottom: 16px; margin-bottom: 24px;">
              <h1 style="margin: 0; font-size: 20px; color: #1a1a1a;">Nuevo mensaje de contacto</h1>
              <p style="margin: 4px 0 0; font-size: 13px; color: #6b7280;">Asamblea Las Torres · Las Torres #53</p>
            </div>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; width: 100px;">Nombre</td>
                <td style="padding: 8px 0; font-size: 15px; color: #1a1a1a;">${nombre}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af;">Correo</td>
                <td style="padding: 8px 0; font-size: 15px; color: #2a7a2a;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af;">Motivo</td>
                <td style="padding: 8px 0; font-size: 15px; color: #1a1a1a;">${motivo}</td>
              </tr>
            </table>

            <div style="margin-top: 24px; padding: 20px; background: #f9fafb; border-radius: 8px; border-left: 3px solid #2a7a2a;">
              <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af;">Mensaje</p>
              <p style="margin: 0; font-size: 15px; color: #374151; line-height: 1.6; white-space: pre-wrap;">${mensaje}</p>
            </div>

            <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                Podés responder directamente a este correo para contactar a ${nombre}.
              </p>
            </div>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Error al procesar mensaje de contacto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor. Por favor intenta nuevamente.' },
      { status: 500 }
    )
  }
}
