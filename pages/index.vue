<template>
  <div>
    <h1 class="text-center text-[3rem] text-green-500">Trivia</h1>
    <div
      :key="question.id"
      class="mx-auto w-full max-w-[600px] basis-full rounded-sm border p-8"
    >
      <h3 class="mb-10 text-center text-lg uppercase">{{ question.text }}</h3>
      <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
        <button
          v-for="answer in question.answers"
          :key="answer.id"
          class="border border-green-100 p-2 text-center duration-200 hover:cursor-pointer hover:bg-green-200 hover:text-green-900"
          @click="submitAnswer(question.id, answer.id)"
        >
          {{ answer.text }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const currentQuestion = ref(0);
const { data: question } = await useAsyncData(
  "trivia",
  () => $fetch(`/api/question/get?question=${currentQuestion.value}`),
  { watch: [currentQuestion] },
);

async function submitAnswer(questionId, answerId) {
  const isAnswerCorrect = await $fetch("/api/question/checkAnswer", {
    method: "post",
    body: {
      questionId,
      answerId,
    },
  });

  if (isAnswerCorrect) {
    currentQuestion.value++;
  }
}
</script>

<style scoped></style>
