<template>
  <div class="page-wrapper login-form">
    <h2 class="login-heading">Register</h2>
    <form action="#" @submit.prevent="register">
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
        <button type="submit" class="btn-submit">Create Account</button>
      </div>
    </form>
  </div>
</template>

<script>
import { useToast, POSITION } from "vue-toastification";

export default {
  name: "register",
  created() {
    this.toast = useToast();
  },
  data() {
    return {
      email: "",
      password: "",
      serverError: "",
      successMessage: "",
    };
  },
  methods: {
    register() {
      this.$store
        .dispatch("registerAccount", {
          email: this.email,
          password: this.password,
        })
        .then(() => {
          this.serverError = "";
          this.successMessage = "Registered Successfully!";

          this.toast.success(this.successMessage, {
            position: POSITION.BOTTOM_RIGHT,
            timeout: 2000,
          });
          this.$router.push({
            name: "login",
            params: {
              dataSuccessMessage: this.successMessage,
              dataEmail: this.email,
            },
          });
        })
        .catch((error) => {
          this.successMessage = "";
          this.serverError = error.code;
        });
    },
  },
};
</script>
