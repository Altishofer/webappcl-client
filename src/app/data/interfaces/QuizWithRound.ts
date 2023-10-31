import {Round} from "./round.model";

export interface QuizWithRound {
  quizId: number,
  hostId: number,
  title: string,
  rounds: Round[]
}
