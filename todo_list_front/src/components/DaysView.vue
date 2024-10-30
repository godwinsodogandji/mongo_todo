<template>
    <div class="day-view">
      <h2 class="text-2xl font-bold mb-4">{{ currentDate | formatDate }}</h2>
      <div class="events">
        <event-item v-for="event in events" :key="event.id" :event="event"></event-item>
      </div>
    </div>
  </template>
  
  <script>
  import EventItem from './EventItem.vue'
  
  export default {
    components: {
      EventItem
    },
    props: {
      currentDate: {
        type: Date,
        required: true
      },
      events: {
        type: Array,
        required: true
      }
    },
    
  }
  </script>