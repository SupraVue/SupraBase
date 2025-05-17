<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <RouterView />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --bg-dark: #121212;
  --bg-darker: #0a0a0a;
  --bg-card: #181818;
  --accent-green: #42b883;
  --accent-green-dark: #2c8c67;
  --text-primary: #f2f2f2;
  --text-secondary: #aaaaaa;
  --border-color: #222222;
  --danger-color: #e53935;
  --danger-hover: #c62828;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--bg-dark);
  color: var(--text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
}

html {
  scroll-behavior: smooth;
}

a {
  color: var(--accent-green);
  text-decoration: none;
}

button {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

input, select, button {
  font-size: 14px;
}

.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  padding: 0;
  margin: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }
}
</style>
