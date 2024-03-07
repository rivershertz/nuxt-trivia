import { SessionData } from "~/types";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    const sessionId = getCookie(event, "sessionId") as string;
    const storage = useStorage();
    const sessionData = <SessionData>await storage.getItem(sessionId);
    const { currentQuestion, questionsList } = sessionData;

    const { questionId, answerId } = await readBody(event);
    const isAnswerCorrect = questionsList.find(
      (question) =>
        question.id === questionId && question.answer_id === answerId,
    )
      ? true
      : false;

    if (!isAnswerCorrect) {
      return {
        isCorrect: false,
      };
    }

    await storage.setItem(sessionId, {
      ...sessionData,
      currentQuestion: currentQuestion + 1,
    });
    const isLastQuestion = currentQuestion >= questionsList.length - 1;
    if (isLastQuestion) {
      const { user, score } = sessionData;
      const client = await serverSupabaseClient(event);
      await client
        .from("scores")
        .insert({ user, score }, { returning: "minimal" })
        .single();
      await storage.removeItem(sessionId, { removeMeta: true });
      deleteCookie(event, "sessionId");
      return {
        isCorrect: true,
        nextQuestion: null,
      };
    }
    return {
      isCorrect: true,
      nextQuestion: questionsList[currentQuestion + 1],
    };
  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: "Something went wrong",
      data: error,
    });
  }
});
