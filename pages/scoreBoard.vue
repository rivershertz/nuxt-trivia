<template>
  <div>
    <h1 class="text-center text-2xl">Score Board</h1>
    <div class="mx-auto mt-12 flex w-fit gap-10">
      <button @click="navigateTo('/')">back to home</button>
    </div>
    <h2 class="mt-10 text-center">Top 3!</h2>
    <ul class="mx-auto mt-2 grid w-fit grid-cols-3 gap-10">
      <li v-for="item in topThree" :key="item.id" class="w-full">
        <div class="flex flex-col gap-2 border-2 p-4 text-center">
          <span>{{ item.user }}</span
          ><span class="text-xl">{{ item.score }}</span>
        </div>
      </li>
    </ul>
    <h2 class="mt-10 text-center">The Rest</h2>
    <ul class="mx-auto w-fit">
      <li v-for="item in theRest" :key="item.id">
        {{ item.user }} {{ item.score }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// fetch scores and display top 3 nicely, the rest as a list beneath
const client = useSupabaseClient();
const { data: scores } = await client
  .from("scores")
  .select("*")
  .order("score", { ascending: false });

const topThree = scores?.slice(0, 3);
const theRest = scores?.slice(3);
</script>

<style scoped></style>
