import type { SessionData } from "~/types";
export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, "sessionId");
  if (!sessionId)
    return createError({ statusCode: 400, statusMessage: "no sessionId" });

  const sessionData = (await useStorage().getItem(sessionId)) as SessionData;
  if (!sessionData) {
    deleteCookie(event, "sessionId");
    return createError({ statusCode: 500, statusMessage: "no session data" });
  }
  const { currentQuestion, questionsList } = sessionData;
  if (currentQuestion >= questionsList.length) {
    return createError({ statusCode: 404, statusMessage: "no more questions" });
  }
  const { text, answers, id } = questionsList[currentQuestion];
  return { text, answers, id };
});
