<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100"  style="background-color: rgba(229, 231, 235, 0.0);" >
        <div class="bg-white shadow-lg rounded-lg p-8 w-96 transition-transform transform hover:scale-105">
            <h2 class="text-2xl font-semibold text-center text-gray-800 mb-6">S'inscrire</h2>
            <form @submit.prevent="registerUser">
                <div class="mb-4">
                    <label for="username" class="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                    <input type="text" v-model="username" required
                        class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 transition duration-150" />
                </div>
                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" v-model="email" required
                        class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 transition duration-150" />
                </div>
                <div class="mb-4">
                    <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
                    <input type="password" v-model="password" required
                        class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 transition duration-150" />
                </div>
                <button type="submit" :disabled="isLoading"
                    class="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-400 transition duration-200">
                    <span v-if="isLoading">Chargement...</span>
                    <span v-else>S'inscrire</span>
                </button>
            </form>
            <p v-if="errorMessage" class="mt-4 text-red-600 text-sm text-center">{{ errorMessage }}</p>
            <p class="mt-4 text-center text-sm">
                Avez-vous déjà un compte ?
                <router-link to="/login" class="text-blue-500 hover:underline">Connectez-vous</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const username = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);
const router = useRouter();

const registerUser = async () => {
    isLoading.value = true; // Activer le chargement
    errorMessage.value = ''; // Réinitialiser le message d'erreur
    try {
        const response = await axios.post('http://localhost:5000/api/register', {
            username: username.value,
            email: email.value,
            password: password.value
        });
        console.log('User registered:', response.data);
        // Réinitialiser les champs du formulaire
        username.value = '';
        email.value = '';
        password.value = '';
        // Rediriger vers la page de connexion après l'inscription
        router.push('/login');
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Erreur lors de l\'inscription';
    } finally {
        isLoading.value = false; // Désactiver le chargement
    }
};
</script>

<style>
/* Styles globaux si nécessaire */
</style>