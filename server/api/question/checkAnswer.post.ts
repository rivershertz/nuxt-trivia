import { SessionData } from "~/types";
import trivia from "../../resources/trivia.json";

export default defineEventHandler(async (event) => {
  // get sessionId from cookie
  // get session data from storage
  // check if the answer is correct
  // if incorrect - return failed indicator
  // if correct - bump currentQuestion
  // return success indicator and next question
  try {
    const { questionId, answerId } = await readBody(event);
    const isAnswerCorrect = trivia.find(
      (question) =>
        question.id === questionId && question.answerId === answerId,
    )
      ? true
      : false;

    if (!isAnswerCorrect) {
      return {
        isCorrect: false,
      };
    }
    const sessionId = getCookie(event, "sessionId") as string;
    const storage = useStorage();
    const sessionData = (await storage.getItem(sessionId)) as SessionData;
    const { currentQuestion, questionsList } = sessionData;

    await storage.setItem(sessionId, {
      ...sessionData,
      currentQuestion: currentQuestion + 1,
    });
    if (currentQuestion >= questionsList.length) {
      // update DB with final score
      await storage.removeItem(sessionId, { removeMeta: true });
      return {
        isCorrect: true,
        nextQuestion: null,
      };
    }
    return {
      isCorrect: true,
      nextQuestion: trivia.find(
        (question) => question.id === questionsList[currentQuestion + 1],
      ),
    };
  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: "Something went wrong",
      data: error,
    });
  }
});
