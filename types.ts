type Question = {
  id: number;
  text: string;
  answers: Answer[];
  answerId: number;
};

type Answer = {
  id: number;
  text: string;
};

type SessionData = {
  user: string;
  score: number;
  currentQuestion: number;
  questionsList: number[];
};
