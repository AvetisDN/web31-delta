<script setup></script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path
      d="M256 32a224 224 0 1 1 0 448 224 224 0 1 1 0-448zm0 480A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"
    />
    <path
      class="dots"
      d="M416 256a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm-160 0a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM64 288a32 32 0 1 1 0-64 32 32 0 1 1 0 64z"
    />
  </svg>
</template>

<style scoped>
path,
circle,
rect {
  fill: currentColor;
}
.dots {
  transform: translateX(6%);
}
</style>
