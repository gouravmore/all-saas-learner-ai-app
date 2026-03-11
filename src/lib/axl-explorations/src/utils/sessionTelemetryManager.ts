// Session and Telemetry Management Service
// Uses Sunbird Telemetry SDK for all telemetry events
import { v4 as uuidv4 } from 'uuid';
import { sunbirdTelemetryService } from './sunbirdTelemetryService';
import { sunbirdTelemetryWrapper } from './sunbirdTelemetryWrapper';

export interface SessionData {
  sessionId: string;
  userId: string;
  startTime: number;
  isActive: boolean;
  totalAttempts: number;
  totalDuration: number;
}

export interface SubSessionData {
  subSessionId: string;
  sessionId: string;
  gameId: string;
  level: number;
  language: string;
  startTime: number;
  isActive: boolean;
  questionsAttempted: number;
  correctAnswers: number;
  totalAttempts?: number; // Total attempts including retries (for heart-based games)
}

class SessionTelemetryManager {
  private static instance: SessionTelemetryManager;
  private currentSession: SessionData | null = null;
  private currentSubSession: SubSessionData | null = null;
  private sessionHistory: SessionData[] = [];
  private subSessionHistory: SubSessionData[] = [];

  private constructor() {
    // Load session data from localStorage on initialization
    this.loadSessionData();
  }

  public static getInstance(): SessionTelemetryManager {
    if (!SessionTelemetryManager.instance) {
      SessionTelemetryManager.instance = new SessionTelemetryManager();
    }
    return SessionTelemetryManager.instance;
  }

  // Generate unique IDs in UUID v4 format using uuid library
  private generateSessionId(): string {
    return uuidv4();
  }

  private generateSubSessionId(): string {
    return uuidv4();
  }

  // Start a new user session (login)
  public async startUserSession(userId: string): Promise<SessionData> {
    // Check if there's already an active session for this user
    // If yes, reuse it (for page reloads)
    if (this.currentSession && this.currentSession.userId === userId && this.currentSession.isActive) {
      console.log('✅ Reusing existing session on page reload:', this.currentSession.sessionId);
      
      // Get auth token from localStorage
      // Try both 'token' and 'apiToken' keys, and also check localStorage directly
      const authToken = typeof window !== 'undefined' 
        ? (localStorage.getItem('token') || localStorage.getItem('apiToken') || '')
        : '';
      
      console.log('🔐 Telemetry initialization - Auth token:', authToken ? 'Present' : 'Missing');
      
      // Re-initialize telemetry with existing session ID
      await sunbirdTelemetryService.initialize(userId, {
        sid: this.currentSession.sessionId, // Use existing session ID
        cdata: [
          { type: 'User', id: userId },
          { type: 'Application', id: 'axl-game-demo', ver: '1.0.0' }
        ],
        authtoken: authToken
      });
      
      // CRITICAL: Send START event even when reusing session after page refresh
      // The SDK's end() method requires a matching START event in its startData array
      // Without this, logout will fail with "Please invoke start before invoking end event"
      await this.sendUserSessionStartEvent(this.currentSession, true); // true = isRefresh
      
      return this.currentSession;
    }

    // End any existing session (different user or inactive)
    if (this.currentSession) {
      await this.endUserSession();
    }

    // Create new session
    const sessionData: SessionData = {
      sessionId: this.generateSessionId(),
      userId,
      startTime: Date.now(),
      isActive: true,
      totalAttempts: 0,
      totalDuration: 0
    };

    this.currentSession = sessionData;
    this.sessionHistory.push(sessionData);
    this.saveSessionData();

    // Get auth token from localStorage
    // Try both 'token' and 'apiToken' keys, and also check localStorage directly
    const authToken = typeof window !== 'undefined' 
      ? (localStorage.getItem('token') || localStorage.getItem('apiToken') || '')
      : '';
    
    console.log('🔐 Telemetry initialization - Auth token:', authToken ? 'Present' : 'Missing');
    
    // Initialize telemetry service with the session ID
    // check if there is already a session active
    await sunbirdTelemetryService.initialize(userId, {
      sid: sessionData.sessionId, // Pass the session ID to maintain consistency
      cdata: [
        { type: 'User', id: userId },
        { type: 'Application', id: 'axl-game-demo', ver: '1.0.0' }
      ],
      authtoken: authToken
    });

    // Send START event for user session
    await this.sendUserSessionStartEvent(sessionData);

    console.log('✅ User session started:', sessionData.sessionId);
    return sessionData;
  }

  // End user session (logout)
  public async endUserSession(): Promise<void> {
    if (!this.currentSession) return;

    // End any active subsession
    if (this.currentSubSession) {
      await this.endSubSession();
    }

    const sessionDuration = Date.now() - this.currentSession.startTime;
    this.currentSession.totalDuration = sessionDuration;
    this.currentSession.isActive = false;

    // Send END event for user session
    await this.sendUserSessionEndEvent(this.currentSession);

    // SDK handles batching automatically, no need to force flush

    console.log('✅ User session ended:', this.currentSession.sessionId);
    this.currentSession = null;
    this.saveSessionData();
  }

  // Start a new game subsession (level attempt)
  public async startSubSession(gameId: string, level: number, language: string): Promise<SubSessionData> {
    if (!this.currentSession) {
      throw new Error('No active user session. Please login first.');
    }

    // End any existing subsession
    if (this.currentSubSession) {
      await this.endSubSession();
    }

    const subSessionData: SubSessionData = {
      subSessionId: this.generateSubSessionId(),
      sessionId: this.currentSession.sessionId,
      gameId,
      level,
      language,
      startTime: Date.now(),
      isActive: true,
      questionsAttempted: 0,
      correctAnswers: 0
    };

    this.currentSubSession = subSessionData;
    this.subSessionHistory.push(subSessionData);
    this.currentSession.totalAttempts++;
    this.saveSessionData();

    // Send START event for subsession
    await this.sendSubSessionStartEvent(subSessionData);

    console.log('✅ Subsession started:', subSessionData.subSessionId);
    return subSessionData;
  }

  // End current subsession
  public async endSubSession(): Promise<void> {
    if (!this.currentSubSession) return;

    const subSessionDuration = Date.now() - this.currentSubSession.startTime;
    const subSessionId = this.currentSubSession.subSessionId;
    this.currentSubSession.isActive = false;

    // Send END event for subsession
    await this.sendSubSessionEndEvent(this.currentSubSession, subSessionDuration);

    // SDK handles batching automatically, no need to force flush

    console.log('✅ Subsession ended:', subSessionId);
    this.currentSubSession = null;
    this.saveSessionData();
  }

  // End current subsession with back button context
  public async endSubSessionWithBackButton(): Promise<void> {
    if (!this.currentSubSession) return;

    const subSessionDuration = Date.now() - this.currentSubSession.startTime;
    const subSessionId = this.currentSubSession.subSessionId;
    this.currentSubSession.isActive = false;

    // Send END event for subsession with back button context
    await this.sendSubSessionEndEventWithBackButton(this.currentSubSession, subSessionDuration);

    // SDK handles batching automatically, no need to force flush

    console.log('✅ Subsession ended with back button:', subSessionId);
    this.currentSubSession = null;
    this.saveSessionData();
  }

  // End current subsession with page refresh context (for beforeunload event)
  // Note: This is called from App.tsx on page unload/refresh
  public async endSubSessionWithPageRefreshSync(): Promise<void> {
    if (!this.currentSubSession) return;

    const subSessionDuration = Date.now() - this.currentSubSession.startTime;
    const subSessionId = this.currentSubSession.subSessionId;
    const subSessionData = { ...this.currentSubSession };
    this.currentSubSession.isActive = false;

    // Send END event synchronously (fire and forget for beforeunload)
    await this.sendSubSessionEndEventWithPageRefresh(subSessionData, subSessionDuration).catch(error => {
      console.error('❌ Failed to send page refresh event on unload:', error);
    });

    console.log('✅ Subsession ended with page refresh:', subSessionId);
    this.currentSubSession = null;
    this.saveSessionData();
  }

  // Update subsession with question attempt
  public updateSubSession(isCorrect: boolean, totalAttempts?: number): void {
    if (!this.currentSubSession) return;

    this.currentSubSession.questionsAttempted++;
    if (isCorrect) {
      this.currentSubSession.correctAnswers++;
    }
    
    // Update totalAttempts if provided (for heart-based games like LetterGame)
    if (totalAttempts !== undefined) {
      this.currentSubSession.totalAttempts = totalAttempts;
    }

    this.saveSessionData();
  }


  // Send user session START event
  private async sendUserSessionStartEvent(sessionData: SessionData, isRefresh: boolean = false): Promise<void> {
    try {
      const contentId = `user-session-${sessionData.sessionId}`;
      const contentVer = '1.0.0';
      const startData = {
        type: "session",
        mode: "play",
        pageid: "login-screen",
        duration: 0
      };

      // Build cdata array with refresh flag if applicable
      const cdata: Array<{ type: string; id: string }> = [
        { type: 'User', id: sessionData.userId },
        { type: 'Application', id: 'axl-game-demo' }
      ];

      // Add refresh indicator to help differentiate in analytics
      if (isRefresh) {
        cdata.push({ type: 'SessionRestore', id: 'page-refresh' });
      }

      // CRITICAL: Pass context with User and Application cdata for session START
      // This ensures the user session START event has correct context, not leftover game context
      const options = {
        ...startData,
        context: {
          env: 'production',
          cdata: cdata
        }
      };

      // Send via SDK with correct options structure
      await sunbirdTelemetryWrapper.start(contentId, contentVer, options, []);
      console.log(isRefresh 
        ? '📊 User session START event sent via SDK (after page refresh)' 
        : '📊 User session START event sent via SDK');
    } catch (error) {
      console.error('❌ Failed to send user session START event:', error);
    }
  }

  // Send user session END event
  private async sendUserSessionEndEvent(sessionData: SessionData): Promise<void> {
    try {
      const endData = {
        type: "session",
        duration: sessionData.totalDuration,
        summary: [
          { totalAttempts: sessionData.totalAttempts },
          { duration: sessionData.totalDuration }
        ]
      };

      const options = {
        object: {
          id: sessionData.userId,
          type: "User",
          ver: "1.0.0"
        },
        context: {
          env: 'production',
          cdata: [
            { type: 'Session', id: sessionData.sessionId }
          ]
        }
      };

      // Send via SDK
      const response = await sunbirdTelemetryWrapper.end(endData, options);
      console.log("response", response);
      console.log('📊 User session END event sent via SDK response:', response);
      console.log('📊 User session END event sent via SDK');
    } catch (error) {
      console.error('❌ Failed to send user session END event:', error);
    }
  }

  // Send subsession START event
  private async sendSubSessionStartEvent(subSessionData: SubSessionData): Promise<void> {
    try {
      const contentId = `${subSessionData.gameId}-level${subSessionData.level}`;
      const contentVer = '1.0.0';
      const startData = {
        type: "attempt",
        mode: "play",
        pageid: `level-${subSessionData.level}-start`,
        duration: 0
      };

      // Create context with ONLY the new subsession data - no merging with cached context
      const context = {
        env: 'production',
        cdata: [
          { id: subSessionData.subSessionId, type: "GameAttempt" },
          { type: "User", id: this.currentSession!.userId },
          { id: subSessionData.language, type: "language" },
          { id: subSessionData.level.toString(), type: "Level" },
          { id: subSessionData.gameId, type: "gameType" }
        ]
      };

      const options = {
        ...startData, // Include startData properties in options
        object: {
          id: contentId,
          type: "GameLevel",
          ver: contentVer
        },
        context: context // Pass fresh context object
      };


      // Send via SDK - pass options which includes both startData and cdata with subSessionId
      await sunbirdTelemetryWrapper.start(contentId, contentVer, options, []);
    } catch (error) {
      console.error('❌ Failed to send subsession START event:', error);
    }
  }

  // Send subsession END event
  private async sendSubSessionEndEvent(subSessionData: SubSessionData, duration: number): Promise<void> {
    try {
      // For heart-based games like LetterGame, send totalAttempts instead of score
      const isHeartBasedGame = subSessionData.gameId.includes('letterHunt');
      
      // Calculate accuracy: 80% threshold for all games
      // For heart-based games: accuracy = correctAnswers / totalAttempts (includes retries)
      // For other games: accuracy = correctAnswers / questionsAttempted
      let accuracy: number;
      if (isHeartBasedGame) {
        const totalAttempts = subSessionData.totalAttempts || subSessionData.questionsAttempted;
        accuracy = totalAttempts > 0 ? subSessionData.correctAnswers / totalAttempts : 0;
      } else {
        accuracy = subSessionData.questionsAttempted > 0 ? subSessionData.correctAnswers / subSessionData.questionsAttempted : 0;
      }
      
      // Result is pass if accuracy >= 80% (0.8)
      const result = accuracy >= 0.8 ? "pass" : "fail";
      
      const endData = {
        type: "attempt",
        summary: [
          { level: subSessionData.level },
          // Send totalAttempts for heart-based games (includes retries), score for others
          isHeartBasedGame 
            ? { score: subSessionData.totalAttempts || subSessionData.questionsAttempted }
            : { score: subSessionData.correctAnswers },
          { result: result },
          { duration: duration },
          { correctAnswers: subSessionData.correctAnswers }, // Always include correct answers
          { questionsAttempted: subSessionData.questionsAttempted } // Always include questions attempted
        ]
      };

      const options = {
        object: {
          id: `${subSessionData.gameId}-level${subSessionData.level}`,
          type: "GameLevel",
          ver: "1.0.0"
        },
        context: {
          env: 'production',
          cdata: [
            { id: subSessionData.subSessionId, type: "GameAttempt" }
          ]
        }
      };

      // Send via SDK
      await sunbirdTelemetryWrapper.end(endData, options);
    } catch (error) {
      console.error('❌ Failed to send subsession END event:', error);
    }
  }

  // Send subsession END event with back button context
  private async sendSubSessionEndEventWithBackButton(subSessionData: SubSessionData, duration: number): Promise<void> {
    try {
      // For heart-based games like LetterGame, send totalAttempts instead of score
      const isHeartBasedGame = subSessionData.gameId.includes('letterHunt');
      
      const endData = {
        type: "attempt",
        summary: [
          { level: subSessionData.level },
          // Send totalAttempts for heart-based games (includes retries), score for others
          isHeartBasedGame 
            ? { totalAttempts: subSessionData.totalAttempts || subSessionData.questionsAttempted }
            : { score: subSessionData.correctAnswers },
          { result: "incomplete" },
          { duration: duration },
          { exitReason: "back-button" },
          { correctAnswers: subSessionData.correctAnswers }, // Always include correct answers
          { questionsAttempted: subSessionData.questionsAttempted } // Always include questions attempted
        ]
      };

      const options = {
        object: {
          id: `${subSessionData.gameId}-level${subSessionData.level}`,
          type: "GameLevel",
          ver: "1.0.0"
        },
        context: {
          env: 'production',
          cdata: [
            { id: subSessionData.subSessionId, type: "GameAttempt" },
            { id: "back-button", type: "ExitReason" }
          ]
        }
      };

      // Send via SDK
      await sunbirdTelemetryWrapper.end(endData, options);
    } catch (error) {
      console.error('❌ Failed to send subsession END event with back button:', error);
    }
  }

  // Send subsession END event with page refresh context
  private async sendSubSessionEndEventWithPageRefresh(subSessionData: SubSessionData, duration: number): Promise<void> {
    try {
      // For heart-based games like LetterGame, send totalAttempts instead of score
      const isHeartBasedGame = subSessionData.gameId.includes('letterHunt');
      
      const endData = {
        type: "attempt",
        summary: [
          { level: subSessionData.level },
          // Send totalAttempts for heart-based games (includes retries), score for others
          isHeartBasedGame 
            ? { totalAttempts: subSessionData.totalAttempts || subSessionData.questionsAttempted }
            : { score: subSessionData.correctAnswers },
          { result: "incomplete" },
          { duration: duration },
          { exitReason: "page-refresh" },
          { correctAnswers: subSessionData.correctAnswers }, // Always include correct answers
          { questionsAttempted: subSessionData.questionsAttempted } // Always include questions attempted
        ]
      };

      const options = {
        object: {
          id: `${subSessionData.gameId}-level${subSessionData.level}`,
          type: "GameLevel",
          ver: "1.0.0"
        },
        context: {
          env: 'production',
          cdata: [
            { id: subSessionData.subSessionId, type: "GameAttempt" },
            { id: "page-refresh", type: "ExitReason" }
          ]
        }
      };

      // Send via SDK
      await sunbirdTelemetryWrapper.end(endData, options);
    } catch (error) {
      console.error('❌ Failed to send subsession END event with page refresh:', error);
    }
  }

  // Send ASSESS event for question attempt
  public async sendAssessEvent(questionId: string, questionType: string, userAnswer: any, correctAnswer: any, isCorrect: boolean, responseTime: number): Promise<void> {
    if (!this.currentSubSession || !this.currentSession) return;

    try {
      const assessData = {
        item: {
          id: questionId,
          question: questionId,
          correctAnswer: correctAnswer
        },
        resvalues: [
          {
            userAnswer: userAnswer
          }
        ],
        pass: isCorrect,
        score: isCorrect ? 1 : 0,
        duration: responseTime
      };

      const options = {
        object: {
          id: questionId,
          type: "Question",
          ver: "1.0.0"
        },
        context: {
          env: 'production',
          cdata: [
            { id: this.currentSubSession.subSessionId, type: "GameAttempt" },
            { id: this.currentSubSession.language, type: "language" },
            { id: this.currentSubSession.gameId, type: "gameType" },
            { id: questionType, type: "mechanicType" },
            { type: "User", id: this.currentSession.userId }
          ]
        }
      };

      // Send via SDK
      sunbirdTelemetryWrapper.assess(assessData, options);
    } catch (error) {
      console.error('❌ Failed to send ASSESS event:', error);
    }
  }

  // SDK handles batching automatically, no need to flush
  public async flushAssessEventBatch(): Promise<void> {
    // SDK handles batching automatically - this method is kept for backward compatibility
    // console.log('ℹ️ SDK handles batching automatically, no flush needed');
  }

  // Send IMPRESSION event
  public async sendImpressionEvent(pageId: string, data: any = {}): Promise<void> {
    if (!this.currentSession) return;

    try {
      const impressionData = {
        type: "view",
        pageid: pageId,
        ...data
      };

      const options = {
        object: {
          id: pageId,
          type: "Page",
          ver: "1.0.0"
        },
        context: {
          env: 'production',
          cdata: [
            { type: "Page", id: pageId },
            { type: "User", id: this.currentSession.userId }
          ]
        }
      };

      // Send via SDK
      sunbirdTelemetryWrapper.impression(impressionData, options);
      console.log('📊 IMPRESSION event sent via SDK for page:', pageId);
    } catch (error) {
      console.error('❌ Failed to send IMPRESSION event:', error);
    }
  }

  // Getters
  public getCurrentSession(): SessionData | null {
    return this.currentSession;
  }

  public getCurrentSubSession(): SubSessionData | null {
    return this.currentSubSession;
  }

  public getSessionHistory(): SessionData[] {
    return this.sessionHistory;
  }

  public getSubSessionHistory(): SubSessionData[] {
    return this.subSessionHistory;
  }

  // Check if user is logged in
  public isUserLoggedIn(): boolean {
    return this.currentSession !== null && this.currentSession.isActive;
  }

  // Check if subsession is active
  public isSubSessionActive(): boolean {
    return this.currentSubSession !== null && this.currentSubSession.isActive;
  }

  // Save session data to localStorage
  private saveSessionData(): void {
    try {
      const sessionData = {
        currentSession: this.currentSession,
        currentSubSession: this.currentSubSession,
        sessionHistory: this.sessionHistory,
        subSessionHistory: this.subSessionHistory
      };
      localStorage.setItem('sessionTelemetryData', JSON.stringify(sessionData));
    } catch (error) {
      console.error('❌ Failed to save session data:', error);
    }
  }

  // Load session data from localStorage
  private loadSessionData(): void {
    try {
      const savedData = localStorage.getItem('sessionTelemetryData');
      if (savedData) {
        const sessionData = JSON.parse(savedData);
        this.currentSession = sessionData.currentSession;
        this.currentSubSession = sessionData.currentSubSession;
        this.sessionHistory = sessionData.sessionHistory || [];
        this.subSessionHistory = sessionData.subSessionHistory || [];
      }
    } catch (error) {
      console.error('❌ Failed to load session data:', error);
    }
  }

  // Clear all session data
  public clearAllData(): void {
    this.currentSession = null;
    this.currentSubSession = null;
    this.sessionHistory = [];
    this.subSessionHistory = [];
    localStorage.removeItem('sessionTelemetryData');
    console.log('✅ All session data cleared');
  }
}

// Export singleton instance
export const sessionTelemetryManager = SessionTelemetryManager.getInstance();
