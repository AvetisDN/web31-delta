<script setup>
import { useUserStore } from "../stores/user";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { profile } = storeToRefs(userStore);

const handleLogout = () => {
  userStore.logout();
};
</script>

<template>
  <div class="flex justify-between items-center">
    <div class="flex p-4 gap-4">
      <router-link to="/">Delta</router-link>
      <router-link to="/home">Home</router-link>
      <router-link to="/explore">Explore</router-link>
    </div>
    <button
      class="flex items-center justify-center gap-1 py-2 px-4 rounded-full bg-red-500 text-zinc-50 hover:bg-red-400 font-semibold"
      @click="handleLogout"
    >
      Logout ({{ profile?.username || profile?.full_name }})
    </button>
  </div>
</template>
