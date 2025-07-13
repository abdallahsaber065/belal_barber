import { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../lib/supabaseClient'
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
    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Database connection not available' })
    }

    const { data, error } = await supabaseAdmin
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })  

    if (error) {
      console.error('Error fetching contacts:', error)
      return res.status(500).json({ error: 'Failed to fetch contacts' })
    }

    res.status(200).json({ data })
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: 'Internal server error' })
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

    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Database connection not available' })
    }

    const { data, error } = await supabaseAdmin
      .from('contacts')
      .insert([{
        name: name.trim(),
        email: email ? email.trim() : null,
        phone: phone.trim(),
        message: message.trim()
      }])
      .select()

    if (error) {
      console.error('Error creating contact:', error)
      return res.status(500).json({ error: 'Failed to submit contact form' })
    }

    // TODO: Send notification email to admin
    // TODO: Send auto-reply to customer

    res.status(201).json({ 
      data,
      message: 'Contact form submitted successfully'
    })
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
} 