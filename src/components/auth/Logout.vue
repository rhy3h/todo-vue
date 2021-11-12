<template>
  <div></div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch("clearTodos");
    this.$store.dispatch("destroyToken").then(() => {
      this.$router.push({ name: "home" });
    });
  },
};
</script>
