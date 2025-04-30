<template>
  <section>
    <h2>Журнал подорожей</h2>
    <textarea v-model="entry" placeholder="Запишіть свої враження..."></textarea>
    <button @click="addEntry">Зберегти</button>
    <ul>
      <li v-for="(item, index) in journal" :key="index">{{ item }}</li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'TravelJournal',
  data() {
    return {
      entry: '',
      journal: [],
    };
  },
  methods: {
    addEntry() {
      if (this.entry.trim()) {
        this.journal.push(this.entry);
        this.entry = '';
      } else {
        alert('Будь ласка, заповніть поле');
      }
    },
  },
};
</script>
