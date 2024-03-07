<template>
  <div>
    <h1 class="text-center text-[3rem] text-green-500">Trivia</h1>
    <button @click="initTrivia" class="mx-auto block">Lets go!!</button>
  </div>
</template>

<script setup lang="ts">
async function initTrivia() {
  try {
    await $fetch("/api/initTrivia", {
      method: "post",
      body: { user: "nahar3" },
    });
    navigateTo("/trivia");
  } catch (error) {}
}
</script>

<style scoped></style>
