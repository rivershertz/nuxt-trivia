import { serverSupabaseClient } from "#supabase/server";
import trivia from "../../resources/trivia.json";
import type { SessionData } from "~/types";
export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, "sessionId");
  if (!sessionId)
    return createError({ statusCode: 400, statusMessage: "no sessionId" });

  const sessionData = <SessionData>await useStorage().getItem(sessionId);
  if (!sessionData) {
    deleteCookie(event, "sessionId");
    return createError({ statusCode: 500, statusMessage: "no session data" });
  }
  const { currentQuestion, questionsList } = sessionData;
  if (currentQuestion >= questionsList.length) {
    return createError({ statusCode: 404, statusMessage: "no more questions" });
  }
  const question = questionsList[currentQuestion];
  return question;
});
