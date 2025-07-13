import { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      return handleGet(req, res)
    case 'POST':
      return handlePost(req, res)
    case 'PUT':
      return handlePut(req, res)
    case 'DELETE':
      return handleDelete(req, res)
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
      res.status(405).json({ error: `Method ${method} not allowed` })
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Database connection not available' })
    }

    const { data, error } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching services:', error)
      return res.status(500).json({ error: 'Failed to fetch services' })
    }

    res.status(200).json({ data })
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title, description, price, duration, icon } = req.body

    if (!title || !description || !price || !duration || !icon) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Database connection not available' })
    }

    const { data, error } = await supabaseAdmin
      .from('services')
      .insert([{
        title,
        description,
        price,
        duration,
        icon,
        is_active: true
      }])
      .select()

    if (error) {
      console.error('Error creating service:', error)
      return res.status(500).json({ error: 'Failed to create service' })
    }

    res.status(201).json({ data })
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query
    const { title, description, price, duration, icon, is_active } = req.body

    if (!id) {
      return res.status(400).json({ error: 'Service ID is required' })
    }

    const updateData: any = { updated_at: new Date().toISOString() }
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (price !== undefined) updateData.price = price
    if (duration !== undefined) updateData.duration = duration
    if (icon !== undefined) updateData.icon = icon
    if (is_active !== undefined) updateData.is_active = is_active

    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Database connection not available' })
    }

    const { data, error } = await supabaseAdmin
      .from('services')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error updating service:', error)
      return res.status(500).json({ error: 'Failed to update service' })
    }

    res.status(200).json({ data })
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({ error: 'Service ID is required' })
    }

    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Database connection not available' })
    }

    const { error } = await supabaseAdmin
      .from('services')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting service:', error)
      return res.status(500).json({ error: 'Failed to delete service' })
    }

    res.status(200).json({ message: 'Service deleted successfully' })
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
} 