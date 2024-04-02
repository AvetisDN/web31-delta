<script setup>
import { useUserStore } from "./stores/user";
import { supabase } from "./supabase";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

supabase.auth.onAuthStateChange((event, session) => {
  const prevUser = userStore.user;
  userStore.setUserState(session?.user || null);
  if (userStore.user !== null && prevUser === null) {
    router.push("/");
  }
  if (userStore.user === null && prevUser !== null) {
    router.push("/landing");
  }
});
</script>

<template>
  <div class="min-h-screen bg-zinc-100 text-zinc-800">
    <router-view></router-view>
  </div>
</template>
