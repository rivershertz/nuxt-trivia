<template>
  <div>
    <h1 class="text-center text-2xl">Score Board</h1>
    <div class="mx-auto mt-12 flex w-fit gap-10">
      <button @click="navigateTo('/')">back to home</button>
      <button @click="restartTrivia">Go Again</button>
    </div>
  </div>
</template>

<script setup lang="ts">
function restartTrivia() {
  // re initialize session
  // navigate to /trivia
}
</script>

<style scoped></style>
