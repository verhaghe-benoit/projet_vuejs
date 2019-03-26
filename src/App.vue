<template>
  <div id="app">
    <p>
      <router-link to="/">Home</router-link>
      <router-link to="/lists">Lists</router-link>
      <router-link to="/list">My list</router-link>
    </p>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
}
</script>

<style>
@import '../node_modules/bootstrap/dist/css/bootstrap.css';
</style>
