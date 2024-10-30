<template>
    <div class="bg-gray-200 overflow-x-auto mt-20 pb-20" style="background-color: rgba(229, 231, 235, 0.0);">
        <div class="container mx-auto py-12 mt-10">
            <h1 class="text-3xl font-bold mb-6 text-center">Calendar App</h1>

            <div class="bg-white shadow-md rounded-lg px-6 py-8">
                <!-- Notification -->
                <div v-if="notification"
                    class="notification bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 fade-in"
                    role="alert">
                    <span class="icon mr-2">&#10003;</span>
                    {{ notification }}
                </div>

                <!-- Modal for adding/editing event -->
                <div v-if="showForm" class="mb-4">
                    <div class="bg-white shadow-md rounded-lg p-6 w-full max-w-md mx-auto modal fade-in">
                        <h2 class="text-xl font-bold mb-4">{{ isEditing ? 'Edit Event' : 'Add a new event for ' +
                            (selectedDay !== null ? weekdays[selectedDay] : '...') }}</h2>
                        <div class="mb-4">
                            <input v-model="newEventTitle"
                                class="border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring focus:border-blue-500"
                                placeholder="Event title" />
                        </div>
                        <div class="flex justify-end">
                            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                                @click="addEvent">
                                {{ isEditing ? 'Update' : 'Submit' }}
                            </button>
                            <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded"
                                @click="showForm = false; resetForm()">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>

                <div class="flex justify-between items-center mb-4">
                    <table class="w-full">
                        <thead>
                            <tr>
                                <th v-for="(day, index) in weekdays" :key="day"
                                    :class="{ 'text-red-500': selectedDay === index, 'cursor-pointer': true }"
                                    class="text-center font-bold py-2" @click="selectDay(index)">
                                    {{ day }}
                                </th>
                                <th class="text-center font-bold py-2">
                                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        @click="openModal()">
                                        Add Event
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td v-for="(events, dayIndex) in calendar" :key="dayIndex">
                                    <div v-for="event in events" :key="event._id"
                                        class= "bg-gray-200 rounded-lg p-4 text-center font-bold mb-2 flex justify-center  fade-in ">
                                        <span class="mr-3">{{ event.title }}</span>
                                        <div class="flex items-center ">
                                            <button @click="editEvent(event)"
                                                class="text-blue-500 hover:text-blue-700 mr-4">
                                                &#9998;
                                            </button>
                                            <button @click="confirmDelete(event._id)"
                                                class="text-red-500 hover:text-red-700">
                                                &#10006;
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Modal de Confirmation -->
        <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-lg p-8 modal fade-in">
                <h2 class="text-xl font-bold mb-4">Confirmer la Suppression</h2>
                <p>Êtes-vous sûr de vouloir supprimer cet événement ?</p>
                <div class="flex justify-end mt-4">
                    <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                        @click="deleteEvent(currentEventId)">
                        Supprimer
                    </button>
                    <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded"
                        @click="showDeleteModal = false">
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            calendar: Array(7).fill([]).map(() => []),
            showForm: false,
            newEventTitle: '',
            selectedDay: null,
            notification: '',
            isEditing: false,
            currentEventId: null,
            showDeleteModal: false // Variable pour contrôler l'affichage du modal de suppression
        };
    },
    mounted() {
        this.fetchEvents();
    },
    methods: {
        fetchEvents() {
            axios.get('http://localhost:5000/api/events')
                .then(response => {
                    this.populateCalendar(response.data);
                })
                .catch(error => {
                    console.error('Error fetching events:', error);
                });
        },
        populateCalendar(events) {
            this.calendar = Array(7).fill([]).map(() => []);
            if (Array.isArray(events)) {
                events.forEach(event => {
                    const date = new Date(event.date);
                    const dayIndex = date.getDay() - 1;
                    if (dayIndex >= 0) {
                        this.calendar[dayIndex].push(event);
                    }
                });
            } else {
                console.error('Expected events to be an array, but got:', events);
            }
        },
        selectDay(dayIndex) {
            this.selectedDay = dayIndex;
        },
        openModal() {
            this.showForm = true;
        },
        resetForm() {
            this.newEventTitle = '';
            this.selectedDay = null;
            this.isEditing = false;
            this.currentEventId = null;
        },
        addEvent() {
            if (this.newEventTitle.trim() === '') {
                this.notification = 'Veuillez entrer un titre pour l\'événement.';
                setTimeout(() => {
                    this.notification = '';
                }, 2000);
                return;
            }

            if (this.selectedDay === null) {
                this.notification = 'Veuillez choisir un jour pour l\'événement.';
                setTimeout(() => {
                    this.notification = '';
                }, 2000);
                return;
            }

            const eventDate = this.weekdays[this.selectedDay];
            if (this.isEditing) {
                axios.put(`http://localhost:5000/api/events/${this.currentEventId}`, { title: this.newEventTitle.trim(), date: eventDate })
                    .then(response => {
                        const index = this.calendar[this.selectedDay].findIndex(event => event._id === this.currentEventId);
                        if (index !== -1) {
                            this.calendar[this.selectedDay][index] = response.data;
                        }
                        this.notification = 'Event updated successfully!';
                        this.showForm = false;
                        this.resetForm();
                        setTimeout(() => {
                            this.notification = '';
                        }, 2000);
                    })
                    .catch(error => {
                        console.error('Error updating event:', error);
                    });
            } else {
                axios.post('http://localhost:5000/api/events', { title: this.newEventTitle.trim(), date: eventDate })
                    .then(response => {
                        this.calendar[this.selectedDay].push(response.data);
                        this.notification = 'Event added successfully!';
                        this.showForm = false;
                        this.resetForm();
                        setTimeout(() => {
                            this.notification = '';
                        }, 2000);
                    })
                    .catch(error => {
                        console.error('Error adding event:', error);
                    });
            }
        },
        editEvent(event) {
            this.newEventTitle = event.title;
            this.selectedDay = this.weekdays.indexOf(event.date);
            this.isEditing = true;
            this.currentEventId = event._id;
            this.showForm = true;
        },
        confirmDelete(eventId) {
            this.currentEventId = eventId;
            this.showDeleteModal = true; // Ouvre le modal de confirmation
        },
        deleteEvent(eventId) {
            axios.delete(`http://localhost:5000/api/events/${eventId}`)
                .then(() => {
                    this.calendar.forEach(dayEvents => {
                        const index = dayEvents.findIndex(event => event._id === eventId);
                        if (index !== -1) {
                            dayEvents.splice(index, 1);
                        }
                    });
                    this.notification = 'Event deleted successfully!';
                    this.showDeleteModal = false; // Ferme le modal après la suppression
                    setTimeout(() => {
                        this.notification = '';
                    }, 2000);
                })
                .catch(error => {
                    console.error('Error deleting event:', error);
                });
        }
    }
};
</script>

<style>
.notification {
    display: flex;
    align-items: center;
    font-size: 1rem;
}

.icon {
    font-size: 1.5rem;
}

.text-red-500 {
    color: red;
    font-weight: bold;
}

/* Animation Styles */
.fade-in {
    animation: fadeIn 0.5s forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.modal {
    transform: scale(0.7);
    opacity: 0;
    animation: modalOpen 0.3s forwards;
}

@keyframes modalOpen {
    to {
        transform: scale(1);
        opacity: 1;
    }
}

/* Spinner for loading */
.spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>