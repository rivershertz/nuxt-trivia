<template>
  <div>
    <h1 class="text-center text-[3rem] text-green-500">Trivia</h1>
    <div
      v-if="question"
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
const question: Ref<Question | null> = ref(null);
onMounted(async () => {
  const sessionId = useCookie("sessionId");
  if (!sessionId.value) {
    return navigateTo("/");
  }
  try {
    question.value = await $fetch(`/api/question/get`);
  } catch (error) {
    console.error(error);
    if (error.statusMessage === "no session data") {
      return navigateTo("/");
    }
    if (error.statusMessage === "no more questions") {
      return navigateTo("/scoreBoard");
    }
  }
});

async function submitAnswer(questionId, answerId) {
  try {
    const data = await $fetch("/api/question/checkAnswer", {
      method: "post",
      body: {
        questionId,
        answerId,
      },
    });
    if (!data.isCorrect) return;
    if (!data.nextQuestion) {
      navigateTo("/scoreBoard");
    }
    question.value = data.nextQuestion;
  } catch (error) {}
}
</script>

<style scoped></style>
