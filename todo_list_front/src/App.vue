<script setup>
import { RouterLink } from 'vue-router';
import Calendar from './components/Calendar.vue';
</script>

<template>
  <div class="app-container">
    <header class="app-header bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
      <div class="app-title text-2xl font-bold">
        <RouterLink to="/">Calendar App</RouterLink>
      </div>
      <nav class="app-navigation">
        <RouterLink to="/" class="hover:text-gray-300">Calendar</RouterLink>
      </nav>
    </header>

    <main class="app-content p-6">
     
      <Calendar />
    </main>
  </div>
</template>
<style scoped>
.app-container {
  @apply bg-gray-100 min-h-screen;
  /* Enlever les marges par défaut */
  /* Hauteur à 100% de la fenêtre */
  background-image: url('./assets/boss-s-day-assortment-blue-background-with-empty-notepad.jpg');
  /* Remplacez par le chemin de votre image */
  background-size: cover;
  /* Couvre toute la page */
  background-position: center;
  /* Centre l'image */
  background-repeat: no-repeat;
  /* Ne pas répéter l'image */
}

.app-header {
  @apply shadow-md;
}

.app-title a {
  @apply text-white hover:text-gray-300;
}

.app-navigation a {
  @apply text-gray-400 transition-colors duration-300;
}

.app-navigation a.router-link-active,
.app-navigation a:hover {
  @apply text-white;
}
</style>