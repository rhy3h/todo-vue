<template>
  <div id="app" class="container">
    <img src="./assets/logo.png" class="logo" />
    <todo-list></todo-list>
  </div>
</template>

<script>
import TodoList from "./components/TodoList";

export default {
  name: "App",
  components: {
    TodoList,
  },
};
</script>

<style>
@media screen and (min-width: 650px) {
  .container {
    max-width: 600px;
    margin: 0 auto;
  }
}

@media screen and (max-width: 650px) {
  .container {
    max-width: 300px;
    margin: 0 auto;
  }
}

.logo {
  display: block;
  margin: 20px auto;
  height: 75px;
}
</style>
