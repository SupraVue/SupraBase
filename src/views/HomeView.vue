<script setup>
import { ref } from 'vue'
</script>

<template>
  <main class="home-container">
    <div class="card">
      <div class="logo-container">
        <img src="../assets/logo.svg" alt="Logo" class="logo" />
        <h1>Vue<span class="db-title">.DB</span></h1>
      </div>
      
      <p class="description">Современная система управления базами данных</p>
      
      <div class="menu-options">

        <router-link to="/database/local" class="menu-button highlight-button">
          <span class="button-content">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <div class="button-text">
              <h3>Файловая БД (.db)</h3>
              <p>Работа с локальными .db файлами</p>
            </div>
          </span>
        </router-link>
        
        <router-link to="/database/mysql" class="menu-button">
          <span class="button-content">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 019 0m-9 0v1.5c0 .621.504 1.125 1.125 1.125H9.75v-1.5m3.75 1.5h-1.5m1.5 0c0 .621-.504 1.125-1.125 1.125H9.75m1.5-3.75C12 12.504 12.504 12 13.125 12h1.5c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5z" />
            </svg>
            <div class="button-text">
              <h3>MySQL база данных</h3>
              <p>Управление MySQL сервером</p>
            </div>
          </span>
        </router-link>
      </div>
      
      <footer class="footer">
        <p>Создано с <span class="vue-text">Vue.js</span></p>
      </footer>
    </div>
  </main>
</template>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: var(--bg-darker);
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(66, 184, 131, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(66, 184, 131, 0.05) 0%, transparent 50%);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.card {
  background-color: var(--bg-card);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  padding: 2.5rem;
  max-width: 700px;
  width: 100%;
  text-align: center;
  border: 1px solid var(--border-color);
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 1rem;
}

h1 {
  color: var(--text-primary);
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.db-title {
  color: var(--accent-green);
}

.vue-text {
  color: var(--accent-green);
  font-weight: 600;
}

.description {
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
  font-size: 1.1rem;
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.menu-options {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-bottom: 2rem;
}

.menu-button {
  display: block;
  padding: 1.5rem;
  background-color: var(--bg-dark);
  color: var(--text-primary);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
  text-align: left;
  border: 1px solid var(--border-color);
}

.menu-button:hover {
  border-color: var(--accent-green);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.button-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.button-text {
  flex: 1;
}

.button-text h3 {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
}

.button-text p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.icon {
  width: 2rem;
  height: 2rem;
  color: var(--accent-green);
}

.footer {
  margin-top: 3rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.highlight-button {
  border-color: var(--accent-green);
  position: relative;
}

.highlight-button::after {
  content: 'NEW';
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: var(--accent-green);
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 3px 6px;
  border-radius: 12px;
  letter-spacing: 0.5px;
}

@media (max-width: 640px) {
  .card {
    padding: 1.5rem;
  }
  
  h1 {
    font-size: 1.8rem;
  }
  
  .menu-button {
    padding: 1.2rem;
  }
  
  .icon {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  .button-text h3 {
    font-size: 1.1rem;
  }
}
</style> 