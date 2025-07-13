import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'
import { validateEmail, validatePhone } from '../../lib/utils'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      return handleGet(req, res)
    case 'POST':
      return handlePost(req, res)
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).json({ error: `Method ${method} not allowed` })
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await prisma.contact.findMany({
      orderBy: { created_at: 'desc' }
    })
    res.status(200).json({ data })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    res.status(500).json({ error: 'Failed to fetch contacts' })
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, email, phone, message } = req.body

    // Validation
    if (!name || !phone || !message) {
      return res.status(400).json({ error: 'Name, phone, and message are required' })
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({ error: 'Invalid phone number' })
    }

    if (email && !validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' })
    }

    const data = await prisma.contact.create({
      data: {
        name: name.trim(),
        email: email ? email.trim() : null,
        phone: phone.trim(),
        message: message.trim()
      }
    })

    // TODO: Send notification email to admin
    // TODO: Send auto-reply to customer

    res.status(201).json({ 
      data,
      message: 'Contact form submitted successfully'
    })
  } catch (error) {
    console.error('Error creating contact:', error)
    res.status(500).json({ error: 'Failed to submit contact form' })
  }
} 