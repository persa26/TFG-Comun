<template>
  <section class="h-screen">
    <div class="container px-6 py-12 h-full">
      <div
        class="flex justify-center items-center flex-wrap h-full g-6 text-gray-800"
      >
        <div class="md:w-8/12 lg:w-6/12 mb-12 md:mb-0">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw1.svg"
            class="w-full"
            alt="Phone image"
          />
        </div>
        <div class="md:w-8/12 lg:w-5/12 lg:ml-20">
          <!-- Title -->
          <h2
            class="text-3xl font-bold text-center text-gray-800 leading-tight mb-6"
          >
            Sign up
          </h2>
          <form action @submit.prevent="register">
            <!-- Name input -->
            <div class="mb-6">
              <input
                v-model="name"
                type="text"
                class="form-control  w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Name"
                required
              />
            </div>
            <!-- Surname input -->
            <div class="mb-6">
              <input
                v-model="surname"
                type="text"
                class="form-control  w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Surname"
                required
              />
            </div>
            <!-- Email input -->
            <div class="mb-6">
              <input
                v-model="email"
                type="text"
                class="form-control  w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Email address"
                required
              />
            </div>

            <!-- Password input -->
            <div class="mb-6">
              <input
                v-model="password"
                type="password"
                class="form-control  w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Password"
              />
            </div>
            <!-- PasswordRepeat input -->
            <div class="mb-6">
              <input
                v-model="passwordRepeat"
                type="password"
                class="form-control  w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Password repeat"
              />
            </div>
            <div class="flex items-center mb-6">
              <p v-if="error" class="error">
                {{ error }}
              </p>
            </div>
            <!-- Submit button -->
            <button
              type="submit"
              class="inline- px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import campusdb from "@/services/campusdb";

export default {
  data: () => ({
    name: "",
    surname: "",
    email: "",
    password: "",
    passwordRepeat: "",
    error: "",
  }),
  methods: {
    // TODO - Implementar error en el formulario de registro (en el mismo componente)
    async register() {
      const mail = this.email;
      const pass = this.password;
      try {
        if (this.password != this.passwordRepeat) {
          throw new Error("Passwords don't match");
        }
        await campusdb
          .register(this.name, this.surname, this.email, btoa(this.password))
          .then(function () {
            campusdb
              .login(mail, btoa(pass))
              .then((res) =>
                campusdb.setUserLogged(res.data.token, res.data.user.id)
              );
          });
        this.$router.push("/posts");
      } catch (error) {
        this.error = error.message;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.register {
  padding: 2rem;
}
.title {
  text-align: center;
}
.form {
  margin: 3rem auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 20%;
  min-width: 350px;
  max-width: 100%;
  background: rgba(19, 35, 47, 0.9);
  border-radius: 5px;
  padding: 40px;
  box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.3);
}
.form-label {
  margin-top: 2rem;
  color: white;
  margin-bottom: 0.5rem;
  &:first-of-type {
    margin-top: 0rem;
  }
}
.form-input {
  padding: 10px 15px;
  background: none;
  background-image: none;
  border: 1px solid white;
  color: white;
  &:focus {
    outline: 0;
    border-color: #1ab188;
  }
}
.form-submit {
  background: #1ab188;
  border: none;
  color: white;
  margin-top: 3rem;
  padding: 1rem 0;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #0b9185;
  }
}
.error {
  margin: 1rem 0 0;
  color: #ff4a96;
}
</style>
