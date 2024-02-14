import trivia from "../../resources/trivia.json";

export default defineEventHandler(async (event) => {
  const { questionId, answerId } = await readBody(event);
  return trivia.find(
    (question) => question.id === questionId && question.answerId === answerId,
  )
    ? true
    : false;
});
