<template>
  <header>
    <h1>Симулятор космічної експедиції</h1>
    <nav>
      <ul>
        <li><router-link to="/about">Про симулятор</router-link></li>
        <li><router-link to="/ship">Космічний корабель</router-link></li>
        <li><router-link to="/missions">Експедиції</router-link></li>
        <li><router-link to="/journeys">Мої подорожі</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Header'
};
</script>

<style scoped>
header {
  background-color: #282c34;
  color: white;
  padding: 20px;
  text-align: center;
}
nav ul {
  list-style: none;
  padding: 0;
}
nav ul li {
  display: inline-block;
  margin: 0 10px;
}
</style>
