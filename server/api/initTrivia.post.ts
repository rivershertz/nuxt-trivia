import { serverSupabaseClient } from "#supabase/server";
export default defineEventHandler(async (event) => {
  const { user } = await readBody(event);
  try {
    const client = await serverSupabaseClient(event);
    const { data: questionsList } = await client.rpc(
      "get_random_questions_by_difficulty",
    );

    if (!questionsList) {
      return createError({
        statusCode: 500,
        statusMessage: "Something went wrong",
      });
    }
    const initialData = {
      user,
      score: 0,
      current_question: 0,
      questions_list: questionsList,
    };
    const sessionId = getCookie(event, "sessionId");
    if (!sessionId) {
      const { data: newSession, error } = await client
        .from("sessions")
        .insert(initialData)
        .select();
      if (error)
        return createError({
          statusCode: 500,
          statusMessage: "Session wasn't created",
          data: error,
        });
      const newSessionId = newSession[0].id;
      setCookie(event, "sessionId", newSessionId, {
        maxAge: 60 * 60,
        sameSite: true,
      });
    }
    return { success: true };
  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: "Something went wrong",
      data: error,
    });
  }
});
