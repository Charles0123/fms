import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' })
})

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
    })

    res.json(categories)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

app.post('/api/categories', async (req, res) => {
  try {
    const { name, type, parentId, isActive = true } = req.body

    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type are required' })
    }

    const normalizedType = String(type).toUpperCase()

    if (!['REVENUE', 'EXPENSE'].includes(normalizedType)) {
      return res.status(400).json({ error: 'Type must be REVENUE or EXPENSE' })
    }

    const category = await prisma.category.create({
      data: {
        name: String(name).trim(),
        type: normalizedType,
        parentId: parentId || null,
        isActive: Boolean(isActive),
      },
    })

    res.status(201).json(category)
  } catch (error) {
    console.error('Create category error:', error)
    res.status(500).json({ error: 'Failed to create category' })
  }
})

app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, type, parentId, isActive } = req.body

    const payload: any = {}

    if (name !== undefined) payload.name = String(name).trim()
    if (type !== undefined) {
      const normalizedType = String(type).toUpperCase()
      if (!['REVENUE', 'EXPENSE'].includes(normalizedType)) {
        return res.status(400).json({ error: 'Type must be REVENUE or EXPENSE' })
      }
      payload.type = normalizedType
    }
    if (parentId !== undefined) payload.parentId = parentId || null
    if (isActive !== undefined) payload.isActive = Boolean(isActive)

    const category = await prisma.category.update({
      where: { id },
      data: payload,
    })

    res.json(category)
  } catch (error) {
    console.error('Update category error:', error)
    res.status(500).json({ error: 'Failed to update category' })
  }
})

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params

    const transactionCount = await prisma.transaction.count({
      where: { categoryId: id },
    })

    if (transactionCount > 0) {
      return res.status(400).json({
        error: 'Cannot delete category because it is used by existing transactions',
      })
    }

    await prisma.category.delete({ where: { id } })
    res.status(204).send()
  } catch (error) {
    console.error('Delete category error:', error)
    res.status(500).json({ error: 'Failed to delete category' })
  }
})

app.get('/api/transactions', async (req, res) => {
  try {
    const { startDate, endDate, type, categoryId } = req.query

    const where: any = {}

    if (type) where.type = String(type).toUpperCase()
    if (categoryId) where.categoryId = String(categoryId)
    if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date.gte = new Date(String(startDate))
      if (endDate) {
        const end = new Date(String(endDate))
        end.setHours(23, 59, 59, 999)
        where.date.lte = end
      }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    })

    const normalized = transactions.map((transaction: any) => ({
      ...transaction,
      amount: Number(transaction.amount.toString()),
    }))

    res.json(normalized)
  } catch (error) {
    console.error('Fetch transactions error:', error)
    res.status(500).json({ error: 'Failed to fetch transactions' })
  }
})

app.post('/api/transactions', async (req, res) => {
  try {
    const { date, amount, type, categoryId, paymentMethod, note } = req.body

    if (!date || amount === undefined || !type || !categoryId) {
      return res.status(400).json({
        error: 'date, amount, type, and categoryId are required',
      })
    }

    const normalizedType = String(type).toUpperCase()
    if (!['REVENUE', 'EXPENSE'].includes(normalizedType)) {
      return res.status(400).json({ error: 'Type must be REVENUE or EXPENSE' })
    }

    const category = await prisma.category.findUnique({ where: { id: String(categoryId) } })
    if (!category) {
      return res.status(400).json({ error: 'Category not found' })
    }

    const transaction = await prisma.transaction.create({
      data: {
        date: new Date(date),
        amount: Number(amount),
        type: normalizedType,
        categoryId: String(categoryId),
        paymentMethod: paymentMethod ? String(paymentMethod) : null,
        note: note ? String(note) : null,
      },
      include: { category: true },
    })

    res.status(201).json({
      ...transaction,
      amount: Number(transaction.amount.toString()),
    })
  } catch (error) {
    console.error('Create transaction error:', error)
    res.status(500).json({ error: 'Failed to create transaction' })
  }
})

app.put('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { date, amount, type, categoryId, paymentMethod, note } = req.body

    const payload: any = {}

    if (date !== undefined) payload.date = new Date(date)
    if (amount !== undefined) payload.amount = Number(amount)
    if (type !== undefined) {
      const normalizedType = String(type).toUpperCase()
      if (!['REVENUE', 'EXPENSE'].includes(normalizedType)) {
        return res.status(400).json({ error: 'Type must be REVENUE or EXPENSE' })
      }
      payload.type = normalizedType
    }
    if (categoryId !== undefined) payload.categoryId = String(categoryId)
    if (paymentMethod !== undefined) payload.paymentMethod = paymentMethod ? String(paymentMethod) : null
    if (note !== undefined) payload.note = note ? String(note) : null

    const transaction = await prisma.transaction.update({
      where: { id },
      data: payload,
      include: { category: true },
    })

    res.json({
      ...transaction,
      amount: Number(transaction.amount.toString()),
    })
  } catch (error) {
    console.error('Update transaction error:', error)
    res.status(500).json({ error: 'Failed to update transaction' })
  }
})

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params
    await prisma.transaction.delete({ where: { id } })
    res.status(204).send()
  } catch (error) {
    console.error('Delete transaction error:', error)
    res.status(500).json({ error: 'Failed to delete transaction' })
  }
})

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal Server Error' })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
