import { SessionData } from "~/types";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    const sessionId = getCookie(event, "sessionId") as string;
    const client = await serverSupabaseClient(event);
    const { data: sessionData, error: getSessionError } = await client
      .from("sessions")
      .select("*")
      .eq("id", sessionId)
      .single();
    if (getSessionError) {
      deleteCookie(event, "sessionId");
      return createError({ statusCode: 404, statusMessage: "no session" });
    }
    const { current_question: currentQuestion, questions_list } = sessionData;

    const { questionId, answerId } = await readBody(event);
    const isAnswerCorrect = questions_list.find(
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
    const { data: updateSessionResponse, error: updateSessionError } =
      await client
        .from("sessions")
        .update({ current_question: currentQuestion + 1 })
        .eq("id", sessionId)
        .select();
    console.log({ updateSessionResponse, updateSessionError });

    const isLastQuestion = currentQuestion >= questions_list.length - 1;
    if (isLastQuestion) {
      const { user, score } = sessionData;
      await client
        .from("scores")
        .insert({ user, score }, { returning: "minimal" })
        .single();
      const { data: deleteSessionResponse, error: deleteSessionError } =
        await client.from("sessions").delete().eq("id", sessionId);
      deleteCookie(event, "sessionId");
      console.log({ deleteSessionResponse, deleteSessionError });

      return {
        isCorrect: true,
        nextQuestion: null,
      };
    }
    return {
      isCorrect: true,
      nextQuestion: questions_list[currentQuestion + 1],
    };
  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: "Something went wrong",
      data: error,
    });
  }
});
