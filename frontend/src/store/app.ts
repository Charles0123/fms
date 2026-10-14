import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '../services/api'
import type { Category, Transaction } from '../types'

export const useAppStore = defineStore('app', () => {
  const categories = ref<Category[]>([])
  const transactions = ref<Transaction[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchCategories = async () => {
    loading.value = true
    try {
      const response = await apiClient.get('/categories')
      categories.value = response.data
      error.value = null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch categories'
    } finally {
      loading.value = false
    }
  }

  const fetchTransactions = async (params?: Record<string, string>) => {
    loading.value = true
    try {
      const response = await apiClient.get('/transactions', {
        params,
      })
      transactions.value = response.data
      error.value = null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch transactions'
    } finally {
      loading.value = false
    }
  }

  const createCategory = async (payload: { name: string; type: 'REVENUE' | 'EXPENSE'; isActive?: boolean }) => {
    const response = await apiClient.post('/categories', payload)
    categories.value.unshift(response.data)
    return response.data
  }

  const createTransaction = async (payload: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiClient.post('/transactions', payload)
    transactions.value.unshift(response.data)
    return response.data
  }

  return {
    categories,
    transactions,
    loading,
    error,
    fetchCategories,
    fetchTransactions,
    createCategory,
    createTransaction,
  }
})
