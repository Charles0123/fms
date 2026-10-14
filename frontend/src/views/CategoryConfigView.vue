<template>
  <div class="categories-page min-h-screen p-6">
    <div class="page-heading mb-6">
      <p class="eyebrow">SYSTEM SETTINGS</p>
      <h1 class="text-3xl font-bold">分類設定</h1>
      <p class="page-description">建立清楚一致的分類，讓收支報表更容易閱讀</p>
    </div>

    <div class="category-form mb-6 border rounded p-4">
      <h2 class="text-lg font-semibold mb-3">{{ editingCategoryId ? '編輯分類' : '新增分類' }}</h2>
      <div class="flex gap-4 items-end flex-wrap">
        <div>
          <label class="block text-sm mb-1">分類名稱</label>
          <input v-model="form.name" type="text" class="border rounded px-3 py-2 w-48" placeholder="例如：餐飲" />
        </div>
        <div>
          <label class="block text-sm mb-1">類型</label>
          <select v-model="form.type" class="border rounded px-3 py-2 w-36">
            <option value="REVENUE">收入</option>
            <option value="EXPENSE">支出</option>
          </select>
        </div>
        <button
          @click="submitCategory"
          class="action-button action-button-success rounded px-4 py-2"
        >
          {{ editingCategoryId ? '更新' : '新增' }}
        </button>
        <button
          v-if="editingCategoryId"
          @click="resetForm"
          class="action-button action-button-muted rounded px-4 py-2"
        >
          取消
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-6">
      <v-card>
        <v-card-title>收入分類</v-card-title>
        <v-card-content>
          <v-list>
            <v-list-item
              v-for="category in revenueCategories"
              :key="category.id"
              :title="category.name"
            >
              <template #append>
                <button @click="editCategory(category)" class="table-action table-action-edit mr-2">編輯</button>
                <button @click="deleteCategory(category.id)" class="table-action table-action-delete">刪除</button>
              </template>
            </v-list-item>
          </v-list>
        </v-card-content>
      </v-card>

      <v-card>
        <v-card-title>支出分類</v-card-title>
        <v-card-content>
          <v-list>
            <v-list-item
              v-for="category in expenseCategories"
              :key="category.id"
              :title="category.name"
            >
              <template #append>
                <button @click="editCategory(category)" class="table-action table-action-edit mr-2">編輯</button>
                <button @click="deleteCategory(category.id)" class="table-action table-action-delete">刪除</button>
              </template>
            </v-list-item>
          </v-list>
        </v-card-content>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import apiClient from '../services/api'
import type { Category } from '../types'

const categories = ref<Category[]>([])
const editingCategoryId = ref<string | null>(null)
const form = ref({
  name: '',
  type: 'EXPENSE' as 'REVENUE' | 'EXPENSE',
})

const revenueCategories = computed(() =>
  categories.value.filter((cat) => cat.type === 'REVENUE' && cat.isActive)
)

const expenseCategories = computed(() =>
  categories.value.filter((cat) => cat.type === 'EXPENSE' && cat.isActive)
)

const fetchCategories = async () => {
  try {
    const response = await apiClient.get('/categories')
    categories.value = response.data
  } catch (error) {
    console.error('Fetch categories failed:', error)
  }
}

const resetForm = () => {
  editingCategoryId.value = null
  form.value = { name: '', type: 'EXPENSE' }
}

const submitCategory = async () => {
  const name = form.value.name.trim()
  if (!name) return

  try {
    if (editingCategoryId.value) {
      await apiClient.put(`/categories/${editingCategoryId.value}`, {
        name,
        type: form.value.type,
      })
    } else {
      await apiClient.post('/categories', {
        name,
        type: form.value.type,
        isActive: true,
      })
    }

    resetForm()
    await fetchCategories()
  } catch (error) {
    console.error('Submit category failed:', error)
  }
}

const editCategory = (category: Category) => {
  editingCategoryId.value = category.id
  form.value = {
    name: category.name,
    type: category.type,
  }
}

const deleteCategory = async (id: string) => {
  try {
    await apiClient.delete(`/categories/${id}`)
    await fetchCategories()
  } catch (error) {
    console.error('Delete category failed:', error)
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.categories-page { background: radial-gradient(circle at 8% 0%, #1d3437 0%, transparent 34%), #11171d; color: #d9e2e8; }
.eyebrow { color: #7fc7bd; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.12em; }
.page-heading h1 { color: #d9e2e8; font-weight: 600; letter-spacing: 0; }
.page-description { color: #9aa9b4; font-size: 0.88rem; }
.categories-page :deep(.v-card), .category-form { background: #1b232b; border: 1px solid rgba(194, 208, 219, 0.12); border-radius: 12px; box-shadow: 0 10px 28px rgba(0, 0, 0, 0.16); }
.category-form h2 { color: #d9e2e8; font-size: 1rem; font-weight: 550; }
.category-form label { color: #9aa9b4; font-size: 0.8rem; }
.categories-page input, .categories-page select { background: #202a33; border: 1px solid rgba(194, 208, 219, 0.16); border-radius: 7px; color: #d9e2e8; outline: none; }
.categories-page input:focus, .categories-page select:focus { background: #25313b; border-color: #67b9ae; }
.categories-page input::placeholder { color: #71818d; }
.action-button { border: 0; font-weight: 500; transition: transform 0.2s, filter 0.2s; }
.action-button:hover { filter: brightness(1.1); transform: translateY(-1px); }
.action-button-success { background: #3e806c; color: #e7f4ef; }
.action-button-muted { background: #35414a; color: #c4cfd5; }
.categories-page :deep(.v-card-title) { color: #d9e2e8; font-size: 1rem; font-weight: 550; }
.categories-page :deep(.v-list) { background: transparent; color: #d9e2e8; }
.categories-page :deep(.v-list-item) { border-top: 1px solid rgba(194, 208, 219, 0.08); min-height: 52px; }
.categories-page :deep(.v-list-item-title) { color: #cbd7de; font-size: 0.9rem; }
.table-action { font-weight: 500; }
.table-action-edit { color: #91c8db; }
.table-action-delete { color: #df9aa4; }
</style>
