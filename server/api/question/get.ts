import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, "sessionId");
  if (!sessionId)
    return createError({ statusCode: 400, statusMessage: "no sessionId" });
  const client = await serverSupabaseClient(event);
  const { data: sessionData, error } = await client
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .single();
  if (error) {
    deleteCookie(event, "sessionId");
    return createError({ statusCode: 404, statusMessage: "no session" });
  }
  const { current_question, questions_list } = sessionData;
  if (current_question >= questions_list.length) {
    return createError({ statusCode: 404, statusMessage: "no more questions" });
  }
  const { text, answers, id } = questions_list[current_question];
  return { text, answers, id };
});
