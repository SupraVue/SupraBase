<script setup>
import { ref, onMounted, computed } from 'vue'
import * as dbService from '../services/dbFile.js'

const dbData = ref([])
const newRecord = ref({ name: '', email: '', role: '' })
const tableHeaders = ref(['ID', 'Name', 'Email', 'Role', 'Actions'])
const isLoading = ref(false)
const searchQuery = ref('')
const showForm = ref(false)
const editMode = ref(false)
const currentId = ref(null)
const statusMessage = ref('')
const fileInput = ref(null)
const isExporting = ref(false)
const isImporting = ref(false)

// Load data from database service
const loadData = async () => {
  isLoading.value = true
  try {
    dbData.value = await dbService.loadAll()
    statusMessage.value = ''
  } catch (error) {
    console.error('Error loading data:', error)
    statusMessage.value = 'Failed to load data'
  } finally {
    isLoading.value = false
  }
}

// Add a new record
const addRecord = async () => {
  if (!newRecord.value.name || !newRecord.value.email || !newRecord.value.role) {
    statusMessage.value = 'All fields are required'
    return
  }
  
  isLoading.value = true
  try {
    await dbService.addRecord(newRecord.value)
    await loadData()
    
    // Reset form
    newRecord.value = { name: '', email: '', role: '' }
    showForm.value = false
    statusMessage.value = 'Record added successfully'
  } catch (error) {
    statusMessage.value = error.message || 'Failed to add record'
  } finally {
    isLoading.value = false
  }
}

// Start editing a record
const startEdit = (record) => {
  newRecord.value = { 
    name: record.name, 
    email: record.email, 
    role: record.role 
  }
  currentId.value = record.id
  editMode.value = true
  showForm.value = true
}

// Update a record
const updateRecord = async () => {
  if (!newRecord.value.name || !newRecord.value.email || !newRecord.value.role) {
    statusMessage.value = 'All fields are required'
    return
  }
  
  isLoading.value = true
  try {
    await dbService.updateRecord(currentId.value, newRecord.value)
    await loadData()
    
    // Reset form
    newRecord.value = { name: '', email: '', role: '' }
    editMode.value = false
    showForm.value = false
    currentId.value = null
    statusMessage.value = 'Record updated successfully'
  } catch (error) {
    statusMessage.value = error.message || 'Failed to update record'
  } finally {
    isLoading.value = false
  }
}

// Delete a record
const deleteRecord = async (id) => {
  if (confirm('Are you sure you want to delete this record?')) {
    isLoading.value = true
    try {
      await dbService.deleteRecord(id)
      await loadData()
      statusMessage.value = 'Record deleted successfully'
    } catch (error) {
      statusMessage.value = error.message || 'Failed to delete record'
    } finally {
      isLoading.value = false
    }
  }
}

// Reset database to default
const resetDb = async () => {
  if (confirm('Are you sure you want to reset the database? All data will be lost.')) {
    isLoading.value = true
    try {
      await dbService.resetDatabase()
      await loadData()
      statusMessage.value = 'Database reset successfully'
    } catch (error) {
      statusMessage.value = error.message || 'Failed to reset database'
    } finally {
      isLoading.value = false
    }
  }
}

// Export database
const exportDb = async () => {
  isExporting.value = true
  try {
    const url = await dbService.exportDatabase()
    const a = document.createElement('a')
    a.href = url
    a.download = 'database_export.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    statusMessage.value = 'Database exported successfully'
  } catch (error) {
    statusMessage.value = error.message || 'Failed to export database'
  } finally {
    isExporting.value = false
  }
}

// Import database
const triggerFileInput = () => {
  fileInput.value.click()
}

const importDb = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  isImporting.value = true
  try {
    await dbService.importDatabase(file)
    await loadData()
    statusMessage.value = 'Database imported successfully'
  } catch (error) {
    statusMessage.value = error.message || 'Failed to import database'
  } finally {
    isImporting.value = false
    // Reset file input
    event.target.value = null
  }
}

// Computed property for filtered data
const filteredData = computed(() => {
  if (!searchQuery.value) return dbData.value
  
  const query = searchQuery.value.toLowerCase()
  return dbData.value.filter(item => 
    item.name.toLowerCase().includes(query) || 
    item.email.toLowerCase().includes(query) || 
    item.role.toLowerCase().includes(query)
  )
})

// Cancel form
const cancelForm = () => {
  newRecord.value = { name: '', email: '', role: '' }
  editMode.value = false
  showForm.value = false
  currentId.value = null
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="db-container">
    <div class="db-content">
      <header class="db-header">
        <div class="header-left">
          <h1>Локальная БД</h1>
          <span class="subtitle">Управление локальным хранилищем с использованием .db файлов</span>
        </div>
        <div class="nav-buttons">
          <router-link to="/" class="nav-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Главная
          </router-link>
          <router-link to="/database/mysql" class="nav-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg>
            MySQL БД
          </router-link>
        </div>
      </header>
      
      <div class="controls">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="search-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Поиск записей..." 
            class="search-input"
          />
        </div>
        <div class="action-buttons">
          <button @click="showForm = !showForm" class="action-button">
            <svg v-if="!showForm" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {{ showForm ? 'Отмена' : 'Добавить запись' }}
          </button>
          <button @click="triggerFileInput" class="secondary-button" :disabled="isImporting">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Импорт .db файла
          </button>
          <input 
            type="file" 
            ref="fileInput" 
            @change="importDb" 
            accept=".db" 
            style="display: none;" 
          />
          <button @click="exportDb" class="secondary-button" :disabled="isExporting">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Создать .db файл
          </button>
          <button @click="resetDb" class="danger-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Сбросить
          </button>
        </div>
      </div>
      
      <div v-if="statusMessage" class="status-message" :class="{ 'success': statusMessage.includes('success') }">
        {{ statusMessage }}
      </div>
      
      <div v-if="showForm" class="form-container">
        <h2>{{ editMode ? 'Редактировать запись' : 'Добавить новую запись' }}</h2>
        <form @submit.prevent="editMode ? updateRecord() : addRecord()">
          <div class="form-group">
            <label for="name">Имя</label>
            <input id="name" type="text" v-model="newRecord.name" required />
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" v-model="newRecord.email" required />
          </div>
          
          <div class="form-group">
            <label for="role">Роль</label>
            <select id="role" v-model="newRecord.role" required>
              <option value="">Выберите роль</option>
              <option value="Admin">Администратор</option>
              <option value="User">Пользователь</option>
              <option value="Editor">Редактор</option>
              <option value="Guest">Гость</option>
            </select>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="cancelForm" class="cancel-button">Отмена</button>
            <button type="submit" class="submit-button">
              {{ editMode ? 'Обновить' : 'Сохранить' }}
            </button>
          </div>
        </form>
      </div>
      
      <div class="db-info">
        <div class="info-panel">
          <h3>О работе с .db файлами</h3>
          <p>
            Данные хранятся локально в браузере, но могут быть экспортированы в .db файл для переноса или резервного копирования.
            Используйте кнопку "Создать .db файл" для экспорта текущих данных и "Импорт .db файла" для загрузки данных из .db файла.
          </p>
        </div>
      </div>
      
      <div v-if="isLoading" class="loading">
        <svg class="spinner" viewBox="0 0 50 50">
          <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
        </svg>
        Загрузка...
      </div>
      
      <div v-else-if="filteredData.length === 0" class="no-data">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="empty-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
        Записи не найдены
      </div>
      
      <div v-else class="table-container">
        <table>
          <thead>
            <tr>
              <th v-for="header in tableHeaders" :key="header">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredData" :key="item.id">
              <td class="id-column">{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.role }}</td>
              <td class="actions">
                <button @click="startEdit(item)" class="edit-button" title="Редактировать">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
                <button @click="deleteRecord(item.id)" class="delete-button" title="Удалить">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.db-container {
  padding: 2rem;
  min-height: 100vh;
  background-color: var(--bg-darker);
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.db-content {
  max-width: 1200px;
  width: 100%;
  margin: 2rem auto;
  position: relative;
  z-index: 10;
}

.db-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-left {
  display: flex;
  flex-direction: column;
}

h1 {
  font-size: 2rem;
  margin: 0;
  font-weight: 600;
  color: var(--text-primary);
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  margin-top: 0.2rem;
}

.nav-buttons {
  display: flex;
  gap: 1rem;
}

.nav-button {
  padding: 0.6rem 1.2rem;
  background-color: var(--bg-card);
  color: var(--text-primary);
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--border-color);
}

.nav-button:hover {
  border-color: var(--accent-green);
}

.nav-button .icon {
  width: 1.2rem;
  height: 1.2rem;
}

.controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  max-width: 400px;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.7rem 1rem 0.7rem 2.5rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-card);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: var(--accent-green);
  outline: none;
}

.search-input::placeholder {
  color: var(--text-secondary);
}

.search-icon {
  position: absolute;
  left: 0.7rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.2rem;
  height: 1.2rem;
  color: var(--text-secondary);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-button {
  padding: 0.7rem 1.2rem;
  background-color: var(--accent-green);
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-button:hover {
  background-color: var(--accent-green-dark);
}

.action-button .icon {
  width: 1.2rem;
  height: 1.2rem;
}

.secondary-button {
  padding: 0.7rem 1.2rem;
  background-color: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.secondary-button:hover {
  background-color: var(--bg-dark);
}

.secondary-button:disabled {
  background-color: var(--bg-dark);
  cursor: not-allowed;
  opacity: 0.7;
}

.secondary-button .icon {
  width: 1.2rem;
  height: 1.2rem;
}

.danger-button {
  padding: 0.7rem 1.2rem;
  background-color: var(--danger-color);
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.danger-button:hover {
  background-color: var(--danger-hover);
}

.danger-button .icon {
  width: 1.2rem;
  height: 1.2rem;
}

.status-message {
  background-color: var(--bg-card);
  padding: 0.8rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  text-align: center;
  border-left: 4px solid var(--accent-green);
}

.status-message.success {
  border-left-color: var(--accent-green);
}

.form-container {
  background-color: var(--bg-card);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
}

.form-container h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  color: var(--text-primary);
  font-weight: 500;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.7rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-dark);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: var(--accent-green);
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-button {
  padding: 0.7rem 1.2rem;
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button:hover {
  border-color: var(--text-secondary);
}

.submit-button {
  padding: 0.7rem 1.2rem;
  background-color: var(--accent-green);
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover {
  background-color: var(--accent-green-dark);
}

.loading {
  text-align: center;
  padding: 2.5rem;
  background-color: var(--bg-card);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--text-secondary);
}

.spinner {
  animation: rotate 2s linear infinite;
  width: 30px;
  height: 30px;
}

.spinner .path {
  stroke: var(--accent-green);
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

.no-data {
  text-align: center;
  padding: 3rem;
  background-color: var(--bg-card);
  border-radius: 8px;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  color: var(--text-secondary);
}

.table-container {
  overflow-x: auto;
  background-color: var(--bg-card);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.8rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  background-color: var(--bg-dark);
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.id-column {
  color: var(--accent-green);
  font-weight: 500;
}

tr:hover {
  background-color: rgba(66, 184, 131, 0.05);
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.edit-button,
.delete-button {
  padding: 0.4rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: transparent;
}

.edit-button:hover {
  background-color: rgba(66, 184, 131, 0.1);
}

.delete-button:hover {
  background-color: rgba(229, 57, 53, 0.1);
}

.edit-button .icon {
  width: 1.2rem;
  height: 1.2rem;
  color: var(--accent-green);
}

.delete-button .icon {
  width: 1.2rem;
  height: 1.2rem;
  color: var(--danger-color);
}

@media (max-width: 768px) {
  .db-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .controls {
    flex-direction: column;
  }
  
  .search-box {
    max-width: 100%;
  }
  
  th, td {
    padding: 0.8rem 0.5rem;
    font-size: 0.9rem;
  }
  
  .actions {
    flex-direction: row;
  }
}

.db-info {
  margin-top: 2rem;
  background-color: var(--bg-card);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.info-panel {
  padding: 1.5rem;
}

.info-panel h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--accent-green);
}

.info-panel p {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--text-secondary);
}
</style> 