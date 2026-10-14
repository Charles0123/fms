<template>
  <div class="transactions-page min-h-screen p-6">
    <div class="page-heading mb-6">
      <p class="eyebrow">CASH FLOW</p>
      <h1 class="text-3xl font-bold">收支明細</h1>
      <p class="page-description">管理日常收入與支出，快速掌握每筆資金流向</p>
    </div>

    <v-card class="mb-6">
      <v-card-content>
        <div class="grid grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">開始日期</label>
            <input v-model="filters.startDate" type="date" class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">結束日期</label>
            <input v-model="filters.endDate" type="date" class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">類型</label>
            <select v-model="filters.type" class="w-full border rounded px-3 py-2">
              <option value="">全部</option>
              <option value="REVENUE">收入</option>
              <option value="EXPENSE">支出</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              @click="fetchTransactions"
              class="action-button action-button-primary w-full rounded px-4 py-2"
            >
              查詢
            </button>
          </div>
        </div>
      </v-card-content>
    </v-card>

    <div class="transaction-form mb-6 border rounded p-4">
      <h2 class="text-lg font-semibold mb-3">{{ editingTransactionId ? '編輯紀錄' : '新增紀錄' }}</h2>
      <div class="grid grid-cols-6 gap-4 items-end">
        <div>
          <label class="block text-sm mb-1">日期</label>
          <input v-model="form.date" type="date" class="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label class="block text-sm mb-1">分類</label>
          <select v-model="form.categoryId" class="border rounded px-3 py-2 w-full">
            <option value="">請選擇</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }} ({{ category.type }})
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm mb-1">金額</label>
          <input v-model.number="form.amount" type="number" min="0" step="0.01" class="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label class="block text-sm mb-1">類型</label>
          <select v-model="form.type" class="border rounded px-3 py-2 w-full">
            <option value="REVENUE">收入</option>
            <option value="EXPENSE">支出</option>
          </select>
        </div>
        <div>
          <label class="block text-sm mb-1">付款方式</label>
          <input v-model="form.paymentMethod" type="text" class="border rounded px-3 py-2 w-full" placeholder="現金 / 卡 / 匯款" />
        </div>
        <div>
          <label class="block text-sm mb-1">備註</label>
          <input v-model="form.note" type="text" class="border rounded px-3 py-2 w-full" placeholder="備註" />
        </div>
      </div>
      <div class="mt-4 flex gap-3">
        <button @click="submitTransaction" class="action-button action-button-success rounded px-4 py-2">
          {{ editingTransactionId ? '更新' : '新增' }} 記錄
        </button>
        <button v-if="editingTransactionId" @click="resetForm" class="action-button action-button-muted rounded px-4 py-2">
          取消
        </button>
      </div>
    </div>

    <v-card>
      <v-table>
        <thead>
          <tr>
            <th>日期</th>
            <th>分類</th>
            <th>金額</th>
            <th>類型</th>
            <th>付款方式</th>
            <th>備註</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in transactions" :key="transaction.id">
            <td>{{ formatDate(transaction.date) }}</td>
            <td>{{ getCategoryName(transaction.categoryId) }}</td>
            <td>NT$ {{ transaction.amount.toLocaleString() }}</td>
            <td>{{ transaction.type }}</td>
            <td>{{ transaction.paymentMethod || '-' }}</td>
            <td>{{ transaction.note || '-' }}</td>
            <td>
              <button @click="editTransaction(transaction)" class="table-action table-action-edit mr-2">編輯</button>
              <button @click="deleteTransaction(transaction.id)" class="table-action table-action-delete">刪除</button>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiClient from '../services/api'
import type { Category, Transaction } from '../types'

const filters = ref({
  startDate: '',
  endDate: '',
  type: '',
})

const transactions = ref<Transaction[]>([])
const categories = ref<Category[]>([])
const editingTransactionId = ref<string | null>(null)
const form = ref({
  date: new Date().toISOString().slice(0, 10),
  amount: 0,
  type: 'EXPENSE' as 'REVENUE' | 'EXPENSE',
  categoryId: '',
  paymentMethod: '',
  note: '',
})

const getCategoryName = (categoryId: string) => {
  const found = categories.value.find((category) => category.id === categoryId)
  return found ? found.name : categoryId
}

const fetchCategories = async () => {
  try {
    const response = await apiClient.get('/categories')
    categories.value = response.data
  } catch (error) {
    console.error('Fetch categories failed:', error)
  }
}

const fetchTransactions = async () => {
  try {
    const params: Record<string, string> = {}
    if (filters.value.startDate) params.startDate = filters.value.startDate
    if (filters.value.endDate) params.endDate = filters.value.endDate
    if (filters.value.type) params.type = filters.value.type

    const response = await apiClient.get('/transactions', { params })
    transactions.value = response.data
  } catch (error) {
    console.error('Fetch transactions failed:', error)
  }
}

const resetForm = () => {
  editingTransactionId.value = null
  form.value = {
    date: new Date().toISOString().slice(0, 10),
    amount: 0,
    type: 'EXPENSE',
    categoryId: '',
    paymentMethod: '',
    note: '',
  }
}

const submitTransaction = async () => {
  if (!form.value.date || !form.value.categoryId || !form.value.amount) {
    return
  }

  const payload = {
    date: form.value.date,
    amount: Number(form.value.amount),
    type: form.value.type,
    categoryId: form.value.categoryId,
    paymentMethod: form.value.paymentMethod || null,
    note: form.value.note || null,
  }

  try {
    if (editingTransactionId.value) {
      await apiClient.put(`/transactions/${editingTransactionId.value}`, payload)
    } else {
      await apiClient.post('/transactions', payload)
    }

    resetForm()
    await fetchTransactions()
  } catch (error) {
    console.error('Submit transaction failed:', error)
  }
}

const editTransaction = (transaction: Transaction) => {
  editingTransactionId.value = transaction.id
  form.value = {
    date: new Date(transaction.date).toISOString().slice(0, 10),
    amount: transaction.amount,
    type: transaction.type,
    categoryId: transaction.categoryId,
    paymentMethod: transaction.paymentMethod || '',
    note: transaction.note || '',
  }
}

const deleteTransaction = async (id: string) => {
  try {
    await apiClient.delete(`/transactions/${id}`)
    await fetchTransactions()
  } catch (error) {
    console.error('Delete transaction failed:', error)
  }
}

const exportExcel = () => {
  console.log('Export Excel placeholder')
}

const exportPdf = () => {
  console.log('Export PDF placeholder')
}

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('zh-TW')
}

onMounted(async () => {
  await fetchCategories()
  await fetchTransactions()
})
</script>

<style scoped>
.transactions-page { background: radial-gradient(circle at 8% 0%, #1d3437 0%, transparent 34%), #11171d; color: #d9e2e8; }
.eyebrow { color: #7fc7bd; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.12em; }
.page-heading h1 { color: #d9e2e8; font-weight: 600; letter-spacing: 0; }
.page-description { color: #9aa9b4; font-size: 0.88rem; }
.transactions-page :deep(.v-card), .transaction-form { background: #1b232b; border: 1px solid rgba(194, 208, 219, 0.12); border-radius: 12px; box-shadow: 0 10px 28px rgba(0, 0, 0, 0.16); }
.transaction-form { color: #d9e2e8; }
.transaction-form h2 { color: #d9e2e8; font-size: 1rem; font-weight: 550; }
.transactions-page label { color: #9aa9b4; font-size: 0.8rem; }
.transactions-page input, .transactions-page select { background: #202a33; border: 1px solid rgba(194, 208, 219, 0.16); border-radius: 7px; color: #d9e2e8; outline: none; transition: border-color 0.2s, background 0.2s; }
.transactions-page input:focus, .transactions-page select:focus { background: #25313b; border-color: #67b9ae; }
.transactions-page input::placeholder { color: #71818d; }
.action-button { border: 0; font-weight: 500; transition: transform 0.2s, filter 0.2s; }
.action-button:hover { filter: brightness(1.1); transform: translateY(-1px); }
.action-button-primary { background: #2d7771; color: #e4f4f0; }
.action-button-success { background: #3e806c; color: #e7f4ef; }
.action-button-muted { background: #35414a; color: #c4cfd5; }
.transactions-page :deep(.v-table) { background: transparent; color: #d9e2e8; }
.transactions-page :deep(.v-table th) { color: #9aa9b4; font-size: 0.75rem; font-weight: 500; }
.transactions-page :deep(.v-table td), .transactions-page :deep(.v-table th) { border-bottom-color: rgba(194, 208, 219, 0.12); }
.transactions-page :deep(.v-table tbody tr:hover) { background: rgba(148, 163, 184, 0.06); }
.table-action { font-weight: 500; }
.table-action-edit { color: #91c8db; }
.table-action-delete { color: #df9aa4; }
@media (max-width: 900px) { .transactions-page .grid-cols-6, .transactions-page .grid-cols-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
</style>
