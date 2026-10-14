<template>
  <div class="dashboard-page min-h-screen p-6">
    <div class="mb-6 flex items-end justify-between gap-4">
      <div>
        <p class="eyebrow">FINANCIAL OVERVIEW</p>
        <h1 class="text-3xl font-bold">儀表板</h1>
        <p class="text-sm text-gray-500">點擊圖表分類，即時查看對應的收支明細</p>
      </div>
      <v-chip :color="usingDemoData ? 'orange' : 'green'" variant="tonal">
        {{ usingDemoData ? '展示資料' : '資料庫已連線' }}
      </v-chip>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
      <v-card class="kpi-card revenue-card"><v-card-text><div class="text-sm text-gray-500">總營收</div><div class="mt-2 text-3xl font-bold text-emerald-700">NT$ {{ formatAmount(totalRevenue) }}</div><div class="mt-2 text-xs text-gray-500">共 {{ revenueTransactions.length }} 筆收入</div></v-card-text></v-card>
      <v-card class="kpi-card expense-card"><v-card-text><div class="text-sm text-gray-500">總支出</div><div class="mt-2 text-3xl font-bold text-rose-700">NT$ {{ formatAmount(totalExpense) }}</div><div class="mt-2 text-xs text-gray-500">共 {{ expenseTransactions.length }} 筆支出</div></v-card-text></v-card>
      <v-card class="kpi-card balance-card"><v-card-text><div class="text-sm text-gray-500">本期結餘</div><div class="mt-2 text-3xl font-bold" :class="balance >= 0 ? 'text-sky-700' : 'text-rose-700'">NT$ {{ formatAmount(balance) }}</div><div class="mt-2 text-xs text-gray-500">營收減去支出</div></v-card-text></v-card>
    </div>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <v-card><v-card-title class="flex items-center justify-between"><span>營收分布</span><span class="text-xs font-normal text-gray-500">點擊分類查看明細</span></v-card-title><v-card-text><div ref="revenueChartElement" class="chart-container" /></v-card-text></v-card>
      <v-card><v-card-title class="flex items-center justify-between"><span>支出分布</span><span class="text-xs font-normal text-gray-500">點擊分類查看明細</span></v-card-title><v-card-text><div ref="expenseChartElement" class="chart-container" /></v-card-text></v-card>
    </div>

    <v-card class="mt-6">
      <v-card-title class="flex items-center justify-between"><span>{{ selectedType === 'REVENUE' ? '營收' : '支出' }}明細</span><v-btn v-if="selectedCategory" size="small" variant="text" @click="clearSelection">顯示全部</v-btn></v-card-title>
      <v-card-subtitle>{{ selectedCategory ? `目前篩選：${selectedCategory}` : '點擊上方圖表中的分類開始篩選' }}</v-card-subtitle>
      <v-table density="comfortable"><thead><tr><th>日期</th><th>分類</th><th>備註</th><th class="text-right">金額</th></tr></thead><tbody>
        <tr v-for="transaction in displayedTransactions" :key="transaction.id"><td>{{ formatDate(transaction.date) }}</td><td>{{ getCategoryName(transaction.categoryId) }}</td><td>{{ transaction.note || '一般收支' }}</td><td class="text-right font-medium" :class="transaction.type === 'REVENUE' ? 'text-emerald-700' : 'text-rose-700'">{{ transaction.type === 'REVENUE' ? '+' : '-' }} NT$ {{ formatAmount(transaction.amount) }}</td></tr>
        <tr v-if="displayedTransactions.length === 0"><td colspan="4" class="py-8 text-center text-gray-500">目前沒有符合條件的明細</td></tr>
      </tbody></v-table>
    </v-card>
  </div>
 </template>

 <script setup lang="ts">
 import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
 import * as echarts from 'echarts'
 import apiClient from '../services/api'
 import type { Category, Transaction } from '../types'

 const revenueChartElement = ref<HTMLElement | null>(null)
 const expenseChartElement = ref<HTMLElement | null>(null)
 const transactions = ref<Transaction[]>([])
 const categories = ref<Category[]>([])
 const usingDemoData = ref(true)
 const selectedType = ref<'REVENUE' | 'EXPENSE'>('REVENUE')
 const selectedCategory = ref<string | null>(null)
 let revenueChart: echarts.ECharts | null = null
 let expenseChart: echarts.ECharts | null = null

 const demoCategories: Category[] = [
   { id: 'cat-sales', name: '商品銷售', type: 'REVENUE', parentId: null, isActive: true, createdAt: new Date(), updatedAt: new Date() },
   { id: 'cat-service', name: '服務收入', type: 'REVENUE', parentId: null, isActive: true, createdAt: new Date(), updatedAt: new Date() },
   { id: 'cat-food', name: '餐飲費', type: 'EXPENSE', parentId: null, isActive: true, createdAt: new Date(), updatedAt: new Date() },
   { id: 'cat-supplies', name: '辦公用品', type: 'EXPENSE', parentId: null, isActive: true, createdAt: new Date(), updatedAt: new Date() },
   { id: 'cat-rent', name: '租金', type: 'EXPENSE', parentId: null, isActive: true, createdAt: new Date(), updatedAt: new Date() },
 ]
 const demoTransactions: Transaction[] = [
   { id: 'demo-1', date: new Date('2026-09-18'), amount: 12800, type: 'REVENUE', categoryId: 'cat-sales', paymentMethod: '匯款', note: '9 月商品訂單', createdAt: new Date(), updatedAt: new Date() },
   { id: 'demo-2', date: new Date('2026-09-15'), amount: 8600, type: 'REVENUE', categoryId: 'cat-service', paymentMethod: '信用卡', note: '顧問服務費', createdAt: new Date(), updatedAt: new Date() },
   { id: 'demo-3', date: new Date('2026-09-17'), amount: 3200, type: 'REVENUE', categoryId: 'cat-sales', paymentMethod: '現金', note: '門市銷售', createdAt: new Date(), updatedAt: new Date() },
   { id: 'demo-4', date: new Date('2026-09-16'), amount: 1450, type: 'EXPENSE', categoryId: 'cat-food', paymentMethod: '信用卡', note: '客戶餐敘', createdAt: new Date(), updatedAt: new Date() },
   { id: 'demo-5', date: new Date('2026-09-12'), amount: 890, type: 'EXPENSE', categoryId: 'cat-supplies', paymentMethod: '現金', note: '列印耗材', createdAt: new Date(), updatedAt: new Date() },
   { id: 'demo-6', date: new Date('2026-09-01'), amount: 18000, type: 'EXPENSE', categoryId: 'cat-rent', paymentMethod: '轉帳', note: '辦公室租金', createdAt: new Date(), updatedAt: new Date() },
 ]

 const revenueTransactions = computed(() => transactions.value.filter((transaction) => transaction.type === 'REVENUE'))
 const expenseTransactions = computed(() => transactions.value.filter((transaction) => transaction.type === 'EXPENSE'))
 const totalRevenue = computed(() => revenueTransactions.value.reduce((sum, transaction) => sum + transaction.amount, 0))
 const totalExpense = computed(() => expenseTransactions.value.reduce((sum, transaction) => sum + transaction.amount, 0))
 const balance = computed(() => totalRevenue.value - totalExpense.value)
 const displayedTransactions = computed(() => transactions.value.filter((transaction) => transaction.type === selectedType.value && (!selectedCategory.value || transaction.categoryId === selectedCategory.value)))

 const formatAmount = (amount: number) => amount.toLocaleString('zh-TW')
 const formatDate = (date: Date | string) => new Date(date).toLocaleDateString('zh-TW')
 const getCategoryName = (categoryId: string) => categories.value.find((category) => category.id === categoryId)?.name || categoryId
 const clearSelection = () => { selectedCategory.value = null }
 const categoryData = (type: 'REVENUE' | 'EXPENSE') => {
   const grouped = new Map<string, number>()
   transactions.value.filter((transaction) => transaction.type === type).forEach((transaction) => grouped.set(transaction.categoryId, (grouped.get(transaction.categoryId) || 0) + transaction.amount))
   return [...grouped.entries()].map(([categoryId, value]) => ({ name: getCategoryName(categoryId), value, categoryId }))
 }

 const createChart = (element: HTMLElement, type: 'REVENUE' | 'EXPENSE') => {
   const chart = echarts.init(element)
   chart.setOption({
     textStyle: { color: '#aab8c2', fontFamily: 'system-ui, sans-serif' },
     tooltip: { trigger: 'item', backgroundColor: '#26323b', borderColor: 'rgba(194, 208, 219, 0.18)', textStyle: { color: '#e4edf2' }, formatter: (params: { name: string; value: number; percent: number }) => `${params.name}<br/>NT$ ${formatAmount(params.value)} (${params.percent}%)` },
     legend: { bottom: 0, type: 'scroll', textStyle: { color: '#aab8c2' } },
     series: [{ type: 'pie', radius: ['48%', '72%'], center: ['50%', '45%'], avoidLabelOverlap: true, itemStyle: { borderRadius: 6, borderColor: '#1b232b', borderWidth: 3 }, label: { color: '#d9e2e8', formatter: '{b}\n{d}%' }, data: categoryData(type) }],
   })
   chart.on('click', (params: { data: { categoryId: string } }) => { selectedType.value = type; selectedCategory.value = params.data.categoryId })
   return chart
 }
 const renderCharts = async () => {
   await nextTick()
   revenueChart?.dispose(); expenseChart?.dispose()
   if (revenueChartElement.value && expenseChartElement.value) { revenueChart = createChart(revenueChartElement.value, 'REVENUE'); expenseChart = createChart(expenseChartElement.value, 'EXPENSE') }
 }
 const loadDashboardData = async () => {
   try {
     const [transactionResponse, categoryResponse] = await Promise.all([apiClient.get('/transactions'), apiClient.get('/categories')])
     if (Array.isArray(transactionResponse.data) && transactionResponse.data.length > 0) {
       transactions.value = transactionResponse.data
       categories.value = Array.isArray(categoryResponse.data) && categoryResponse.data.length > 0 ? categoryResponse.data : demoCategories
       usingDemoData.value = false
       return
     }
   } catch (error) { console.info('Dashboard API unavailable, showing demo data.', error) }
   transactions.value = demoTransactions; categories.value = demoCategories; usingDemoData.value = true
 }
 const handleResize = () => { revenueChart?.resize(); expenseChart?.resize() }
 onMounted(async () => { await loadDashboardData(); await renderCharts(); window.addEventListener('resize', handleResize) })
 onBeforeUnmount(() => { window.removeEventListener('resize', handleResize); revenueChart?.dispose(); expenseChart?.dispose() })
 </script>

 <style scoped>
 .dashboard-page {
   --dashboard-bg: #11171d;
   --dashboard-surface: #1b232b;
   --dashboard-surface-soft: #202a33;
   --dashboard-border: rgba(194, 208, 219, 0.12);
   --dashboard-text: #d9e2e8;
   --dashboard-muted: #9aa9b4;
   background: radial-gradient(circle at 12% 0%, #1d3437 0%, transparent 34%), var(--dashboard-bg);
   color: var(--dashboard-text);
 }
 .dashboard-page :deep(.v-card) {
   background: var(--dashboard-surface);
   border: 1px solid var(--dashboard-border);
   border-radius: 12px;
   box-shadow: 0 10px 28px rgba(0, 0, 0, 0.16);
   color: var(--dashboard-text);
 }
 .dashboard-page :deep(.v-card-title) { color: var(--dashboard-text); font-size: 1rem; font-weight: 550; letter-spacing: 0; }
 .dashboard-page :deep(.v-card-subtitle),
 .dashboard-page .text-gray-500 { color: var(--dashboard-muted) !important; }
 .dashboard-page :deep(.v-table) { background: transparent; color: var(--dashboard-text); }
 .dashboard-page :deep(.v-table th) { color: var(--dashboard-muted); font-size: 0.75rem; font-weight: 500; }
 .dashboard-page :deep(.v-table td),
 .dashboard-page :deep(.v-table th) { border-bottom-color: var(--dashboard-border); }
 .dashboard-page :deep(.v-table tbody tr:hover) { background: rgba(148, 163, 184, 0.06); }
 .dashboard-page :deep(.v-btn) { color: #9ed8d0; font-weight: 500; }
 .dashboard-page :deep(.v-chip) { font-weight: 500; }
 .dashboard-page h1 { color: var(--dashboard-text); font-weight: 600; letter-spacing: 0; }
 .eyebrow { color: #7fc7bd; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.12em; }
 .kpi-card { border-top: 3px solid transparent !important; }
 .revenue-card { border-top-color: #56b8a7 !important; }
 .expense-card { border-top-color: #d7838e !important; }
 .balance-card { border-top-color: #78a9c5 !important; }
 .kpi-card .text-emerald-700 { color: #8cd1bd !important; }
 .kpi-card .text-rose-700 { color: #e4a1aa !important; }
 .kpi-card .text-sky-700 { color: #a0c7db !important; }
 .text-emerald-700 { color: #8cd1bd !important; }
 .text-rose-700 { color: #e4a1aa !important; }
 .chart-container { height: 320px; width: 100%; }
 </style>
