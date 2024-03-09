export type Question = {
  id: number;
  text: string;
  answers: Answer[];
  answer_id: number;
  created_at: Date;
};

type Answer = {
  id: number;
  text: string;
};

export type SessionData = {
  user: string;
  score: number;
  current_question: number;
  questions_list: Question[];
};

export type Score = {
  created_at: Date;
  id: number;
  user: string;
  score: number;
};
