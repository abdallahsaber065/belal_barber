import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'
import { validatePhone } from '../../lib/utils'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      return handleGet(req, res)
    case 'POST':
      return handlePost(req, res)
    case 'PUT':
      return handlePut(req, res)
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT'])
      res.status(405).json({ error: `Method ${method} not allowed` })
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await prisma.reservation.findMany({
      include: {
        service: {
          select: {
            title: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    })
    res.status(200).json({ data })
  } catch (error) {
    console.error('Error fetching reservations:', error)
    res.status(500).json({ error: 'Failed to fetch reservations' })
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, phone, email, service_id, appointment_date, appointment_time, notes } = req.body

    // Validation
    if (!name || !phone || !service_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ error: 'Name, phone, service, date, and time are required' })
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({ error: 'Invalid phone number' })
    }

    // Check if time slot is available
    const existingReservations = await prisma.reservation.findMany({
      where: {
        appointment_date: new Date(appointment_date),
        appointment_time: appointment_time,
        status: { not: 'cancelled' }
      }
    })
    const isTimeSlotTaken = existingReservations.length > 0

    if (isTimeSlotTaken) {
      return res.status(409).json({ error: 'Time slot is already booked' })
    }

    const data = await prisma.reservation.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : null,
        service_id,
        appointment_date: new Date(appointment_date),
        appointment_time,
        notes: notes ? notes.trim() : null,
        status: 'pending'
      },
      include: {
        service: {
          select: {
            title: true
          }
        }
      }
    })

    res.status(201).json({ 
      data,
      message: 'Reservation created successfully'
    })
  } catch (error) {
    console.error('Error creating reservation:', error)
    res.status(500).json({ error: 'Failed to create reservation' })
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query
    const { status } = req.body

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Reservation ID is required' })
    }

    if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' })
    }

    const data = await prisma.reservation.update({
      where: { id },
      data: { status: status as any }, // Cast to avoid TypeScript enum issues
      include: {
        service: {
          select: {
            title: true
          }
        }
      }
    })

    res.status(200).json({ data })
  } catch (error) {
    console.error('Error updating reservation:', error)
    
    // Check if the error is due to record not found
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return res.status(404).json({ error: 'Reservation not found' })
    }
    
    res.status(500).json({ error: 'Failed to update reservation' })
  }
} 