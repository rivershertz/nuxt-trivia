import trivia from "../../resources/trivia.json";

export default defineEventHandler((event) => {
  const { question } = getQuery(event);
  return trivia[+question];
});
