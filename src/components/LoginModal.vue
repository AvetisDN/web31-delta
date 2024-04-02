<script setup>
import { ref } from "vue";
import { useUserStore } from "../stores/user";

const emit = defineEmits(["close"]);
const userStore = useUserStore();

const email = ref("");
const password = ref("");

const login = () => {
  userStore.login(email.value, password.value);
  emit("close");
};
</script>

<template>
  <div
    class="fixed w-full h-screen top-0 left-0 flex items-center justify-center"
  >
    <div
      class="bg-black/50 absolute top-0 left-0 w-full h-[150%]"
      @click="emit('close')"
    ></div>
    <div
      class="relative p-6 bg-zinc-100 rounded-lg shadow-lg w-full max-w-80 flex flex-col gap-4"
    >
      <button
        class="w-6 h-6 flex items-center justify-center absolute top-3 right-3"
        @click="emit('close')"
      >
        <i class="fas fa-close"></i>
      </button>
      <h2 class="text-center text-xl font-bold">Login</h2>
      <form @submit.prevent="login" class="flex flex-col gap-4">
        <input
          class="w-full max-w-80 mx-auto flex items-center justify-center gap-1 py-3 px-4 rounded-lg border border-zinc-400 focus:border-zinc-800"
          type="email"
          v-model="email"
          required
          placeholder="E-Mail"
        />
        <input
          class="w-full max-w-80 mx-auto flex items-center justify-center gap-1 py-3 px-4 rounded-lg border border-zinc-400 focus:border-zinc-800"
          type="password"
          v-model="password"
          required
          placeholder="Password"
          minlength="8"
        />
        <button
          class="w-full max-w-80 mx-auto flex items-center justify-center gap-1 py-3 px-8 rounded-full bg-teal-500 text-zinc-50 hover:bg-teal-400 font-semibold"
          @click="registerModal = true"
        >
          <span>Login</span>
        </button>
      </form>
    </div>
  </div>
</template>
