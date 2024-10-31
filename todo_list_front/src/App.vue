<script setup>
import { ref } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
  localStorage.removeItem('token'); // Supprime le token du stockage local
  router.push('/login'); // Redirige vers la page de connexion
};
</script>

<template>
  <div class="app-container">
    <header class="app-header bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
      <div class="app-title text-2xl font-bold">
        <RouterLink to="/">Calendar App</RouterLink>
      </div>
      <nav class="app-navigation">
        <button @click="logout" class="text-gray-100 hover:text-gray-300">
          Log out
        </button>
      </nav>
    </header>

    <main class="app-content p-6">
      <RouterView></RouterView>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  @apply bg-gray-100 min-h-screen;
  background-image: url('./assets/boss-s-day-assortment-blue-background-with-empty-notepad.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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