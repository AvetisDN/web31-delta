<script setup>
import { ref } from "vue";
import LoginModal from "../components/LoginModal.vue";
import RegisterModal from "../components/RegisterModal.vue";
import { useUserStore } from "../stores/user";

const loginModal = ref(false);
const registerModal = ref(false);

const userStore = useUserStore();

const handleLoginWithProvider = (provider) => {
  userStore.loginWithProvider(provider);
};
</script>

<template>
  <div class="flex min-h-screen flex-col md:flex-row">
    <router-link
      to="/"
      class="bg-zinc-900 flex items-center justify-center md:basis-1/2 flex-col text-teal-400 p-3"
    >
      <img
        src="../assets/logo-primary.png"
        class="h-14 md:h-auto max-w-[60%]"
        alt="Delta"
      />
      <h1
        class="font-black tracking-wider text-2xl md:text-6xl lg:text-8xl md:-translate-y-6 lg:-translate-y-10 hidden md:block"
      >
        DELTA
      </h1>
    </router-link>
    <div
      class="flex justify-center md:basis-1/2 flex-col gap-10 p-5 grow md:grow-0"
    >
      <div>
        <h2 class="text-4xl font-bold text-center">Join Delta now!</h2>
      </div>
      <div class="flex flex-col gap-4">
        <button
          class="w-full max-w-80 mx-auto flex items-center justify-center gap-1 py-3 px-8 rounded-full border border-zinc-800 hover:bg-zinc-300 font-semibold"
          @click="handleLoginWithProvider('google')"
        >
          <i class="fa-brands fa-google"></i>
          <span>Sign In with Google</span>
        </button>
        <button
          class="w-full max-w-80 mx-auto flex items-center justify-center gap-1 py-3 px-8 rounded-full border border-zinc-800 hover:bg-zinc-300 font-semibold"
          @click="handleLoginWithProvider('github')"
        >
          <i class="fa-brands fa-github"></i>
          <span>Sign In with Github</span>
        </button>
      </div>
      <div class="flex flex-col gap-2">
        <p class="text-center font-medium text-zinc-400">
          Create a new account
        </p>
        <button
          class="w-full max-w-80 mx-auto flex items-center justify-center gap-1 py-3 px-8 rounded-full bg-teal-500 text-zinc-50 hover:bg-teal-400 font-semibold"
          @click="registerModal = true"
        >
          <span>Sign Up with E-Mail</span>
        </button>
      </div>
      <div class="flex flex-col gap-2">
        <p class="text-center font-medium text-zinc-400">
          Already have an account?
        </p>
        <button
          class="w-full max-w-80 mx-auto flex items-center justify-center gap-1 py-3 px-8 rounded-full border border-zinc-800 hover:bg-zinc-300 font-semibold"
          @click="loginModal = true"
        >
          <span>Sign In</span>
        </button>
      </div>
    </div>
    <Transition name="slide-fade">
      <LoginModal v-if="loginModal" @close="loginModal = false" />
    </Transition>
    <Transition name="slide-fade">
      <RegisterModal v-if="registerModal" @close="registerModal = false" />
    </Transition>
  </div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.4s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-50px);
  opacity: 0;
}
</style>
