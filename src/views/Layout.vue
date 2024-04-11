<script setup>
import AppSidebar from "../components/Sidebar/AppSidebar.vue";
</script>

<template>
  <div class="grid grid-cols-[auto, 1fr] max-w-7xl mx-auto">
    <AppSidebar />
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>
