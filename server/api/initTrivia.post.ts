import { v4 as uuidGenerator } from "uuid";
export default defineEventHandler(async (event) => {
  const user = await readBody(event);
  try {
    const questionsList = await getQuestionsList();
    const initialData = {
      user,
      score: 0,
      currentQuestion: 0,
      questionsList,
    };
    const sessionId = getCookie(event, "sessionId");
    if (!sessionId) {
      const newSessionId = uuidGenerator();
      const storage = useStorage();
      await storage.setItem(newSessionId, initialData);
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
