// Sunbird Telemetry Service
// Provides a simplified interface for telemetry operations
// Wraps sunbirdTelemetryWrapper for easier usage
import { sunbirdTelemetryWrapper } from './sunbirdTelemetryWrapper';

export interface GameSessionData {
  gameId: string;
  gameName: string;
  gameType: string;
  level: number;
  language: string;
  complexity: string;
  username: string;
  isCombinedGame: boolean;
  startTime: number;
  sessionId?: string;
}

export interface QuestionResponseData {
  questionId: string;
  questionType: string;
  userAnswer: any;
  correctAnswer: any;
  isCorrect: boolean;
  responseTime: number;
  attempts: number;
  complexity: string;
}

export interface GameEndSessionData {
  gameId: string;
  gameName: string;
  level: number;
  language: string;
  totalQuestions: number;
  correctAnswers: number;
  successRate: number;
  duration: number;
  completed: boolean;
}

class SunbirdTelemetryService {
  private static instance: SunbirdTelemetryService;

  private constructor() {}

  public static getInstance(): SunbirdTelemetryService {
    if (!SunbirdTelemetryService.instance) {
      SunbirdTelemetryService.instance = new SunbirdTelemetryService();
    }
    return SunbirdTelemetryService.instance;
  }

  /**
   * Initialize the telemetry service
   * @param userId - User ID
   * @param config - Configuration object with sid (session ID) and cdata (context data)
   */
  public async initialize(
    userId: string,
    config: {
      sid?: string;
      cdata?: any[];
      authtoken?: string;
    } = {}
  ): Promise<boolean> {
    return await sunbirdTelemetryWrapper.initialize({
      uid: userId,
      sid: config.sid,
      cdata: config.cdata || [],
      authtoken: config.authtoken
    });
  }

  /**
   * Send a game session start event
   */
  public async sendGameSessionStart(sessionData: GameSessionData): Promise<void> {
    const contentId = `${sessionData.gameId}-level${sessionData.level}`;
    const contentVer = '1.0.0';
    const startData = {
      type: 'content',
      mode: 'play',
      pageid: `${sessionData.gameId}-level-${sessionData.level}`,
      duration: 0
    };

    const options = {
      object: {
        id: contentId,
        type: 'GameLevel',
        ver: contentVer
      },
      context: {
        env: 'production',
        cdata: [
          { id: sessionData.gameId, type: 'gameType' },
          { id: sessionData.language, type: 'language' },
          { id: sessionData.level.toString(), type: 'Level' },
          { type: 'User', id: sessionData.username }
        ]
      }
    };

    await sunbirdTelemetryWrapper.start(contentId, contentVer, startData, []);
  }

  /**
   * Send a question response event
   */
  public async sendResponseEvent(
    sessionData: GameSessionData,
    responseData: QuestionResponseData
  ): Promise<void> {
    const assessData = {
      item: {
        id: responseData.questionId,
        question: responseData.questionId,
        correctAnswer: responseData.correctAnswer
      },
      resvalues: [
        {
          userAnswer: responseData.userAnswer
        }
      ],
      pass: responseData.isCorrect,
      score: responseData.isCorrect ? 1 : 0,
      duration: responseData.responseTime
    };

    const options = {
      object: {
        id: responseData.questionId,
        type: 'Question',
        ver: '1.0.0'
      },
      context: {
        env: 'production',
        cdata: [
          { id: sessionData.gameId, type: 'gameType' },
          { id: sessionData.language, type: 'language' },
          { id: responseData.questionType, type: 'mechanicType' },
          { type: 'User', id: sessionData.username }
        ]
      }
    };

    sunbirdTelemetryWrapper.assess(assessData, options);
  }

  /**
   * Send a game session end event
   */
  public async sendGameSessionEnd(
    sessionData: GameSessionData,
    endData: GameEndSessionData
  ): Promise<void> {
    const endEventData = {
      type: 'content',
      summary: [
        { level: endData.level },
        { score: endData.correctAnswers },
        { result: endData.completed ? 'pass' : 'fail' },
        { duration: endData.duration },
        { totalQuestions: endData.totalQuestions },
        { successRate: endData.successRate }
      ]
    };

    const options = {
      object: {
        id: `${endData.gameId}-level${endData.level}`,
        type: 'GameLevel',
        ver: '1.0.0'
      },
      context: {
        env: 'production',
        cdata: [
          { id: endData.gameId, type: 'gameType' },
          { id: endData.language, type: 'language' },
          { type: 'User', id: sessionData.username }
        ]
      }
    };

    await sunbirdTelemetryWrapper.end(endEventData, options);
  }
}

// Export singleton instance
export const sunbirdTelemetryService = SunbirdTelemetryService.getInstance();

/**
 * Create game session data object
 */
export function createGameSessionData(
  gameId: string,
  gameName: string,
  gameType: string,
  level: number,
  language: string,
  complexity: string,
  username: string,
  isCombinedGame: boolean
): GameSessionData {
  return {
    gameId,
    gameName,
    gameType,
    level,
    language,
    complexity,
    username,
    isCombinedGame,
    startTime: Date.now()
  };
}

/**
 * Create question response data object
 */
export function createQuestionResponseData(
  questionId: string,
  questionType: string,
  userAnswer: any,
  correctAnswer: any,
  isCorrect: boolean,
  responseTime: number,
  attempts: number,
  complexity: string
): QuestionResponseData {
  return {
    questionId,
    questionType,
    userAnswer,
    correctAnswer,
    isCorrect,
    responseTime,
    attempts,
    complexity
  };
}

/**
 * Create game end session data object
 */
export function createGameEndSessionData(
  gameId: string,
  gameName: string,
  level: number,
  language: string,
  totalQuestions: number,
  correctAnswers: number,
  successRate: number,
  duration: number,
  completed: boolean
): GameEndSessionData {
  return {
    gameId,
    gameName,
    level,
    language,
    totalQuestions,
    correctAnswers,
    successRate,
    duration,
    completed
  };
}

