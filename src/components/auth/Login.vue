<template>
  <div class="page-wrapper login-form">
    <h2 class="login-heading">Login</h2>
    <form action="#" @submit.prevent="login">
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <div v-if="serverError" class="server-error">{{ serverError }}</div>

      <div class="form-control">
        <label for="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          class="login-input"
          v-model="email"
        />
      </div>

      <div class="form-control mb-more">
        <label for="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          class="login-input"
          v-model="password"
        />
      </div>

      <div class="form-control">
        <button type="submit" class="btn-submit">Login</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "login",
  props: {
    dataSuccessMessage: {
      type: String,
    },
    dataEmail: {
      type: String,
    },
  },
  data() {
    return {
      email: this.dataEmail || "",
      password: "",
      serverError: "",
      successMessage: this.dataSuccessMessage,
    };
  },
  methods: {
    login() {
      this.$store.dispatch("clearTodos");
      this.$store
        .dispatch("retrieveToken", {
          email: this.email,
          password: this.password,
        })
        .then(() => {
          this.$router.push({ name: "todo" });
        })
        .catch((error) => {
          console.log(error.code);
          this.serverError = error.code;
          this.password = "";
          this.successMessage = "";
        });
    },
  },
};
</script>
