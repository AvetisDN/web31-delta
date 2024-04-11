<script setup>
import { useUserStore } from "../../stores/user";
import { storeToRefs } from "pinia";
import IconDots from "../Icons/IconDots.vue";

const userStore = useUserStore();
const { profile } = storeToRefs(userStore);

const handleLogout = () => {
  userStore.logout();
};
</script>

<template>
  <div class="flex justify-between w-full gap-4 items-center">
    <div class="flex gap-2 items-center">
      <img
        :src="profile.avatar_url ? profile.avatar_url : '/empty.png'"
        class="w-10 h-10 object-cover object-center rounded-full ring-2 ring-teal-400"
        alt=""
      />
      <span class="text-lg font-medium">{{
        profile?.username || profile?.full_name
      }}</span>
    </div>
    <button class="py-1 px-2">
      <!-- Задание: по нажатию на эту кнопку появляется выпадающее меню с ссылкой на профиль и кнопкой выход -->
      <IconDots class="h-4" />
    </button>
  </div>
</template>
