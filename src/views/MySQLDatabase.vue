<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const dbData = ref([])
const newRecord = ref({ name: '', email: '', role: '' })
const tableHeaders = ref(['ID', 'Name', 'Email', 'Role', 'Actions'])
const isLoading = ref(false)
const searchQuery = ref('')
const showForm = ref(false)
const editMode = ref(false)
const currentId = ref(null)
const statusMessage = ref('')
const isConnected = ref(false)
const connectionData = ref({
  host: '',
  port: '3306',
  username: '',
  password: '',
  database: ''
})
const showConnectionForm = ref(true)

// Simulated database connection and operations
const connectToDatabase = () => {
  // In a real app, you would connect to MySQL using a backend service
  // This is a simulation for demonstration purposes
  if (!connectionData.value.host || !connectionData.value.username || !connectionData.value.database) {
    statusMessage.value = 'Connection details are required'
    return
  }
  
  isLoading.value = true
  
  // Simulate API call to connect
  setTimeout(() => {
    isLoading.value = false
    isConnected.value = true
    showConnectionForm.value = false
    statusMessage.value = 'Connected to MySQL database successfully'
    
    // Load sample data after "connection"
    dbData.value = [
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Manager' },
      { id: 2, name: 'Bob Williams', email: 'bob@example.com', role: 'Developer' },
      { id: 3, name: 'Carol Davis', email: 'carol@example.com', role: 'Designer' },
      { id: 4, name: 'Dave Wilson', email: 'dave@example.com', role: 'Analyst' },
      { id: 5, name: 'Eva Brown', email: 'eva@example.com', role: 'Tester' }
    ]
  }, 1500)
}

const disconnectFromDatabase = () => {
  isConnected.value = false
  showConnectionForm.value = true
  dbData.value = []
  statusMessage.value = 'Disconnected from database'
}

const addRecord = () => {
  if (!isConnected.value) {
    statusMessage.value = 'Please connect to the database first'
    return
  }
  
  if (!newRecord.value.name || !newRecord.value.email || !newRecord.value.role) {
    statusMessage.value = 'All fields are required'
    return
  }
  
  isLoading.value = true
  
  // Simulate API call to insert data
  setTimeout(() => {
    const newId = dbData.value.length > 0 ? Math.max(...dbData.value.map(item => item.id)) + 1 : 1
    
    const record = {
      id: newId,
      name: newRecord.value.name,
      email: newRecord.value.email,
      role: newRecord.value.role
    }
    
    dbData.value.push(record)
    
    // Reset form
    newRecord.value = { name: '', email: '', role: '' }
    showForm.value = false
    isLoading.value = false
    statusMessage.value = 'Record added successfully'
  }, 800)
}

const startEdit = (record) => {
  newRecord.value = { ...record }
  currentId.value = record.id
  editMode.value = true
  showForm.value = true
}

const updateRecord = () => {
  if (!isConnected.value) {
    statusMessage.value = 'Please connect to the database first'
    return
  }
  
  if (!newRecord.value.name || !newRecord.value.email || !newRecord.value.role) {
    statusMessage.value = 'All fields are required'
    return
  }
  
  isLoading.value = true
  
  // Simulate API call to update data
  setTimeout(() => {
    const index = dbData.value.findIndex(item => item.id === currentId.value)
    if (index !== -1) {
      dbData.value[index] = {
        id: currentId.value,
        name: newRecord.value.name,
        email: newRecord.value.email,
        role: newRecord.value.role
      }
      
      // Reset form
      newRecord.value = { name: '', email: '', role: '' }
      editMode.value = false
      showForm.value = false
      currentId.value = null
      isLoading.value = false
      statusMessage.value = 'Record updated successfully'
    }
  }, 800)
}

const deleteRecord = (id) => {
  if (!isConnected.value) {
    statusMessage.value = 'Please connect to the database first'
    return
  }
  
  if (confirm('Are you sure you want to delete this record?')) {
    isLoading.value = true
    
    // Simulate API call to delete data
    setTimeout(() => {
      dbData.value = dbData.value.filter(item => item.id !== id)
      isLoading.value = false
      statusMessage.value = 'Record deleted successfully'
    }, 800)
  }
}

const filteredData = () => {
  if (!searchQuery.value) return dbData.value
  
  const query = searchQuery.value.toLowerCase()
  return dbData.value.filter(item => 
    item.name.toLowerCase().includes(query) || 
    item.email.toLowerCase().includes(query) || 
    item.role.toLowerCase().includes(query)
  )
}

const cancelForm = () => {
  newRecord.value = { name: '', email: '', role: '' }
  editMode.value = false
  showForm.value = false
  currentId.value = null
}
</script>

<template>
  <div class="db-container">
    <div class="db-content">
      <header class="db-header">
        <div class="header-left">
          <h1>MySQL БД</h1>
          <span class="subtitle">Управление MySQL сервером</span>
        </div>
        <div class="nav-buttons">
          <router-link to="/" class="nav-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Главная
          </router-link>
          <router-link to="/database/local" class="nav-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg>
            Локальная БД
          </router-link>
        </div>
      </header>
      
      <div v-if="statusMessage" class="status-message" :class="{ 'success': statusMessage.includes('success') }">
        {{ statusMessage }}
      </div>
      
      <div v-if="showConnectionForm" class="connection-container">
        <h2>Подключение к MySQL</h2>
        <form @submit.prevent="connectToDatabase">
          <div class="form-group">
            <label for="host">Хост</label>
            <input id="host" type="text" v-model="connectionData.host" placeholder="localhost" required />
          </div>
          
          <div class="form-group">
            <label for="port">Порт</label>
            <input id="port" type="text" v-model="connectionData.port" placeholder="3306" />
          </div>
          
          <div class="form-group">
            <label for="username">Пользователь</label>
            <input id="username" type="text" v-model="connectionData.username" placeholder="root" required />
          </div>
          
          <div class="form-group">
            <label for="password">Пароль</label>
            <input id="password" type="password" v-model="connectionData.password" />
          </div>
          
          <div class="form-group">
            <label for="database">Имя базы данных</label>
            <input id="database" type="text" v-model="connectionData.database" required />
          </div>
          
          <div class="form-actions">
            <button type="submit" class="submit-button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              Подключиться
            </button>
          </div>
        </form>
      </div>
      
      <div v-if="isConnected" class="connected-container">
        <div class="connection-info">
          <div class="connection-details">
            <span class="connection-badge">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Подключено
            </span>
            <p>{{ connectionData.database }} @ {{ connectionData.host }}</p>
          </div>
          <button @click="disconnectFromDatabase" class="disconnect-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Отключиться
          </button>
        </div>
        
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
          <button @click="showForm = !showForm" class="action-button">
            <svg v-if="!showForm" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {{ showForm ? 'Отмена' : 'Добавить запись' }}
          </button>
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
                <option value="Manager">Менеджер</option>
                <option value="Developer">Разработчик</option>
                <option value="Designer">Дизайнер</option>
                <option value="Analyst">Аналитик</option>
                <option value="Tester">Тестировщик</option>
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
        
        <div v-if="isLoading" class="loading">
          <svg class="spinner" viewBox="0 0 50 50">
            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
          </svg>
          Загрузка...
        </div>
        
        <div v-else-if="filteredData().length === 0" class="no-data">
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
              <tr v-for="item in filteredData()" :key="item.id">
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

h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  color: var(--text-primary);
  font-weight: 500;
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

.connection-container,
.form-container {
  background-color: var(--bg-card);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
}

.connection-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-card);
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  border: 1px solid var(--border-color);
}

.connection-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.connection-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--accent-green);
  font-weight: 500;
  background-color: rgba(66, 184, 131, 0.1);
  padding: 0.3rem 0.7rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.connection-badge .icon {
  width: 1rem;
  height: 1rem;
}

.disconnect-button {
  padding: 0.6rem 1.2rem;
  background-color: var(--bg-dark);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.disconnect-button:hover {
  border-color: var(--danger-color);
  color: var(--danger-color);
}

.disconnect-button .icon {
  width: 1.2rem;
  height: 1.2rem;
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

.form-group input::placeholder {
  color: var(--text-secondary);
  opacity: 0.6;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.submit-button:hover {
  background-color: var(--accent-green-dark);
}

.submit-button .icon {
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
  
  .connection-info {
    flex-direction: column;
    align-items: flex-start;
  }
  
  th, td {
    padding: 0.8rem 0.5rem;
    font-size: 0.9rem;
  }
  
  .actions {
    flex-direction: row;
  }
}
</style> 