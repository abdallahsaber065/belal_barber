import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'

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
    const data = await prisma.service.findMany({
      where: { is_active: true },
      orderBy: { created_at: 'asc' }
    })
    res.status(200).json({ data })
  } catch (error) {
    console.error('Error fetching services:', error)
    res.status(500).json({ error: 'Failed to fetch services' })
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title, description, price, duration, icon } = req.body

    if (!title || !description || !price || !duration || !icon) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const data = await prisma.service.create({
      data: {
        title,
        description,
        price,
        duration,
        icon,
        is_active: true
      }
    })

    res.status(201).json({ data })
  } catch (error) {
    console.error('Error creating service:', error)
    res.status(500).json({ error: 'Failed to create service' })
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query
    const { title, description, price, duration, icon, is_active } = req.body

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Service ID is required' })
    }

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (price !== undefined) updateData.price = price
    if (duration !== undefined) updateData.duration = duration
    if (icon !== undefined) updateData.icon = icon
    if (is_active !== undefined) updateData.is_active = is_active

    const data = await prisma.service.update({
      where: { id },
      data: updateData
    })

    res.status(200).json({ data })
  } catch (error) {
    console.error('Error updating service:', error)
    
    // Check if the error is due to record not found
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return res.status(404).json({ error: 'Service not found' })
    }
    
    res.status(500).json({ error: 'Failed to update service' })
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Service ID is required' })
    }

    await prisma.service.delete({
      where: { id }
    })

    res.status(200).json({ message: 'Service deleted successfully' })
  } catch (error) {
    console.error('Error deleting service:', error)
    
    // Check if the error is due to record not found
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return res.status(404).json({ error: 'Service not found' })
    }
    
    res.status(500).json({ error: 'Failed to delete service' })
  }
} 