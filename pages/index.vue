<template>
  <div>
    <h1 class="text-center text-[3rem] text-green-500">Trivia</h1>
    <input
      type="text"
      v-model="user"
      placeholder="Type your name here"
      class="mx-auto mt-10 block p-2 text-black"
    />
    <button
      @click="initTrivia"
      class="mx-auto mt-5 block"
      :class="{ 'opacity-40': !user }"
      :disabled="!user"
    >
      Lets go!!
    </button>
  </div>
</template>

<script setup lang="ts">
const user = ref(null);
async function initTrivia() {
  try {
    await $fetch("/api/initTrivia", {
      method: "post",
      body: { user: user.value || "user" },
    });
    navigateTo("/trivia");
  } catch (error) {}
}
</script>

<style scoped></style>
