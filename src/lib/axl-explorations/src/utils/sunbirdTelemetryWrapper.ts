// Sunbird Telemetry SDK Wrapper for React/TypeScript compatibility
// The SDK is loaded via script tag in index.html and available globally as $t or EkTelemetry
import { v4 as uuidv4 } from 'uuid';

// Get the SDK from global scope (loaded via script tag in index.html)
const getSDK = (): any => {
  return (window as any).$t || (window as any).EkTelemetry || null;
};

export interface SunbirdConfig {
  pdata: {
    id: string;
    ver: string;
    pid: string;
  };
  env: string;
  channel: string;
  did: string;
  authtoken?: string;
  uid: string;
  sid: string;
  batchsize: number;
  mode: string;
  host: string;
  endpoint: string;
  apislug?: string; // API slug (defaults to "/action" in SDK, set to "" to remove it)
  tags?: string[];
  cdata?: any[];
}

export interface TelemetryEventData {
  id?: string;
  type?: string;
  subtype?: string;
  [key: string]: any;
}

class SunbirdTelemetryWrapper {
  private static instance: SunbirdTelemetryWrapper;
  private config: SunbirdConfig | null = null;
  private isInitialized: boolean = false;
  private deviceId: string = '';
  private sessionId: string = '';

  private constructor() {
    this.generateDeviceId();
    this.generateSessionId();
    
    // Reset initialization state on page load/reload
    // This ensures telemetry is re-initialized on each page load
    this.isInitialized = false;
  }

  public static getInstance(): SunbirdTelemetryWrapper {
    if (!SunbirdTelemetryWrapper.instance) {
      SunbirdTelemetryWrapper.instance = new SunbirdTelemetryWrapper();
    }
    return SunbirdTelemetryWrapper.instance;
  }

  private generateDeviceId(): void {
    const storedDeviceId = localStorage.getItem('axl_device_id');
    if (!storedDeviceId) {
      // Generate UUID v4 format device ID using uuid library
      const newDeviceId = uuidv4();
      localStorage.setItem('axl_device_id', newDeviceId);
      this.deviceId = newDeviceId;
    } else {
      this.deviceId = storedDeviceId;
    }
  }

  private generateSessionId(): void {
    // Generate UUID v4 format session ID using uuid library
    // Only generate if we don't have one already
    if (!this.sessionId) {
      this.sessionId = uuidv4();
    }
  }

  public async initialize(userConfig: Partial<SunbirdConfig> = {}): Promise<boolean> {
    // Get SDK from global scope (loaded via script tag)
    const $t = getSDK();
    
    // Use session ID from userConfig if provided, otherwise use existing or generate new
    // This allows sessionTelemetryManager to pass the persisted session ID
    const newSessionId = userConfig.sid || this.sessionId || uuidv4();
    
    // CRITICAL: Check if we need to end previous session before initializing
    // Only run cleanup if there's actually an existing session to clean up
    const currentSdkSessionId = $t?.config?.sid || localStorage.getItem('telemetry_session_id') || null;
    const hasDifferentSession = currentSdkSessionId && currentSdkSessionId !== newSessionId;
    const isExplicitNewSession = userConfig.sid && this.sessionId && userConfig.sid !== this.sessionId; // Only if this.sessionId exists
    const sdkHasActiveSession = $t && typeof $t.isSessionActive === 'function' && $t.isSessionActive();
    
    // Only end previous session if there actually IS a previous session
    // Skip cleanup on first initialization (when currentSdkSessionId is null and this.sessionId is empty)
    if (hasDifferentSession || isExplicitNewSession || (sdkHasActiveSession && currentSdkSessionId !== newSessionId)) {
      this.endSession();
    }
    
    // SAFEGUARD: Only clear localStorage if we're switching from an existing session
    // Skip on first initialization to avoid unnecessary operations
    if (userConfig.sid && currentSdkSessionId && currentSdkSessionId !== userConfig.sid) {
      localStorage.removeItem("telemetry_session_id");
      localStorage.removeItem("telemetry_session_started");
      console.log('🔄 Cleared localStorage before switching to new sessionId:', userConfig.sid);
    }
    
    this.sessionId = newSessionId;
    
    if (!$t) {
      console.warn('⚠️ Telemetry SDK not found in global scope. Make sure it is loaded via script tag in index.html');
      // Still mark as initialized to allow mock fallback
      this.isInitialized = true;
      return false;
    }

    try {
      // CRITICAL: Force reset SDK's internal state ONLY if switching from an existing session
      // The SDK checks if it's already initialized and skips re-initialization
      if ($t) {
        // Only force reset if SDK is already initialized with a different session
        const sdkAlreadyInitialized = $t.config?.initialized || $t._initialized || $t.initialized;
        if (userConfig.sid && sdkAlreadyInitialized && currentSdkSessionId && currentSdkSessionId !== userConfig.sid) {
          console.log('🔄 Force resetting SDK before initialize with new sessionId', {
            oldSid: currentSdkSessionId,
            newSid: userConfig.sid,
            wasInitialized: sdkAlreadyInitialized
          });
          
          // Try to reset SDK state - some SDKs have a reset or destroy method
          if (typeof $t.destroy === 'function') {
            $t.destroy();
            console.log('✅ Called SDK destroy()');
          } else if (typeof $t.reset === 'function') {
            $t.reset();
            console.log('✅ Called SDK reset()');
          }
          
          // FORCE reset the SDK's initialized flag
          if ($t.config) {
            $t.config.initialized = false;
            $t.config.sid = '';
            console.log('✅ Reset SDK config.initialized to false');
          }
          
          if ($t._initialized !== undefined) {
            $t._initialized = false;
            console.log('✅ Reset SDK _initialized to false');
          }
          
          if ($t.initialized !== undefined) {
            $t.initialized = false;
            console.log('✅ Reset SDK initialized to false');
          }
        }
      }
      
      this.config = {
        pdata: {
          id: 'axl-game-frontend',
          ver: '1.0.0',
          pid: 'axl-game-demo'
        },
        env: 'production',
        channel: 'axl-game-demo',
        did: this.deviceId,
        authtoken: userConfig.authtoken || '',
        uid: userConfig.uid || 'anonymous',
        sid: this.sessionId, // Use the new session ID
        batchsize: 10,
        mode: 'play',
        host: (process.env.REACT_APP_TELEMETRY_HOST || 'https://telemetry-dev.theall.ai'),
        endpoint: (process.env.REACT_APP_TELEMETRY_ENDPOINT || '') || '/v2/telemetry',
        apislug: '', // Remove /action prefix - set to empty string to use endpoint as-is
        tags: [],
        cdata: userConfig.cdata || [],
        ...userConfig
      };
      
      // Log auth token status (without exposing the actual token)
      if (this.config.authtoken) {
        console.log('✅ Telemetry config - Auth token is present (length:', this.config.authtoken.length, ')');
      } else {
        console.warn('⚠️ Telemetry config - Auth token is missing. API may return "Authorization header missing" error.');
      }

      // Always re-initialize to ensure SDK uses the new sessionId
      // We've already ended any previous session above if needed
      if ($t.initialize && typeof $t.initialize === 'function') {
        $t.initialize(this.config);
        
        // Verify the SDK actually used our sessionId
        const actualSdkSessionId = $t.config?.sid || localStorage.getItem('telemetry_session_id');
        if (actualSdkSessionId !== this.sessionId) {
          console.warn('⚠️ WARNING: SDK sessionId mismatch!', {
            expected: this.sessionId,
            actual: actualSdkSessionId,
            'SDK config sid': $t.config?.sid,
            'localStorage sid': localStorage.getItem('telemetry_session_id')
          });
        } else {
          console.log('✅ Telemetry SDK initialized with session:', this.sessionId);
        }
      }
      
      this.isInitialized = true;
      // console.log('✅ Sunbird Telemetry SDK initialized successfully', this.config);
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Sunbird Telemetry SDK:', error);
      this.isInitialized = true; // Allow fallback to mock
      return false;
    }
  }

  public async start(contentId: string, contentVer: string, options: any = {}, tags: string[] = []): Promise<void> {
    const $t = getSDK();
    
    if (!this.isInitialized || !$t) {
      console.warn('⚠️ Telemetry SDK not available, skipping start event');
      return;
    }

    try {
      // Separate edata from object/context in options
      const { type, mode, pageid, duration, object, context, ...restOptions } = options;
      
      const edata = {
        ...(type && { type }),
        ...(mode && { mode }),
        ...(pageid && { pageid }),
        ...(duration !== undefined && { duration }),
        ...restOptions
      };
      
      // SDK signature: start(config, contentId, contentVer, data, options)
      // The 5th parameter 'options' is passed to updateValues() and should contain object, context, tags
      const startOptions: any = {
        ...(object && { object }),
        ...(context && { context }),
        ...(tags && tags.length > 0 && { tags })
      };
      
      $t.start({}, contentId, contentVer, edata, startOptions);
    } catch (error) {
      console.error('❌ Failed to send start event:', error);
    }
  }

  public async interact(edata: TelemetryEventData, options: any = {}): Promise<void> {
    const $t = getSDK();
    
    if (!this.isInitialized || !$t) {
      console.warn('⚠️ Telemetry SDK not available, skipping interact event');
      return;
    }

    try {
      // Use SDK's interact method directly (as per Sunbird Telemetry docs)
      $t.interact(edata, options);
      console.log('📊 INTERACT event sent via SDK:', edata);
    } catch (error) {
      console.error('❌ Failed to send interact event:', error);
    }
  }

  public async end(edata: TelemetryEventData, options: any = {}): Promise<void> {
    const $t = getSDK();
    
    if (!this.isInitialized || !$t) {
      console.warn('⚠️ Telemetry SDK not available, skipping end event');
      return;
    }

    try {
      await $t.end(edata, options);
    } catch (error) {
      console.error('❌ Failed to send end event:', error);
    }
  }

  public response(context: any, edata: any, options: any = {}): void {
    const $t = getSDK();
    if (!this.isInitialized || !$t) {
      console.warn('⚠️ Telemetry SDK not available, skipping response event');
      return;
    }

    try {
      $t.response(edata, options);
      console.log('📊 RESPONSE event sent via SDK:', edata);
    } catch (error) {
      console.error('❌ Failed to send response event:', error);
    }
  }

  public search(context: any, edata: any, options: any = {}): void {
    const $t = getSDK();
    if (!this.isInitialized || !$t) {
      console.warn('⚠️ Telemetry SDK not available, skipping search event');
      return;
    }

    try {
      $t.search(edata, options);
      console.log('📊 SEARCH event sent via SDK:', edata);
    } catch (error) {
      console.error('❌ Failed to send search event:', error);
    }
  }

  public feedback(context: any, edata: any, options: any = {}): void {
    const $t = getSDK();
    if (!this.isInitialized || !$t) {
      console.warn('⚠️ Telemetry SDK not available, skipping feedback event');
      return;
    }

    try {
      $t.feedback(edata, options);
      console.log('📊 FEEDBACK event sent via SDK:', edata);
    } catch (error) {
      console.error('❌ Failed to send feedback event:', error);
    }
  }

  public impression(context: any, edata: any, options: any = {}): void {
    const $t = getSDK();
    if (!this.isInitialized || !$t) {
      console.warn('⚠️ Telemetry SDK not available, skipping impression event');
      return;
    }

    try {
      $t.impression(edata, options);
      console.log('📊 IMPRESSION event sent via SDK:', edata);
    } catch (error) {
      console.error('❌ Failed to send impression event:', error);
    }
  }

  public assess(edata: any, options: any = {}): void {
    const $t = getSDK();
    if (!this.isInitialized || !$t) {
      console.warn('⚠️ Telemetry SDK not available, skipping assess event');
      return;
    }

    try {
      $t.assess(edata, options);
    } catch (error) {
      console.error('❌ Failed to send assess event:', error);
    }
  }

  public audit(context: any, edata: any, options: any = {}): void {
    const $t = getSDK();
    if (!this.isInitialized || !$t) {
      console.warn('⚠️ Telemetry SDK not available, skipping audit event');
      return;
    }

    try {
      $t.audit(edata, options);
      console.log('📊 AUDIT event sent via SDK:', edata);
    } catch (error) {
      console.error('❌ Failed to send audit event:', error);
    }
  }

  public error(context: any, edata: any, options: any = {}): void {
    const $t = getSDK();
    if (!this.isInitialized || !$t) {
      console.warn('⚠️ Telemetry SDK not available, skipping error event');
      return;
    }

    try {
      $t.error(edata, options);
      console.log('📊 ERROR event sent via SDK:', edata);
    } catch (error) {
      console.error('❌ Failed to send error event:', error);
    }
  }

  public trace(context: any, edata: any, options: any = {}): void {
    const $t = getSDK();
    if (!this.isInitialized || !$t) {
      console.warn('⚠️ Telemetry SDK not available, skipping trace event');
      return;
    }

    try {
      $t.trace(edata, options);
      console.log('📊 TRACE event sent via SDK:', edata);
    } catch (error) {
      console.error('❌ Failed to send trace event:', error);
    }
  }

  public setUser(userId: string, userData: any = {}): void {
    if (this.config) {
      this.config.uid = userId;
      // Reinitialize with new user data
      this.initialize({
        uid: userId,
        cdata: [{ type: 'User', id: userId, ...userData }]
      });
    }
  }

  public getDeviceId(): string {
    return this.deviceId;
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public isReady(): boolean {
    return this.isInitialized;
  }

  public getConfig(): SunbirdConfig | null {
    return this.config;
  }

  /**
   * End the current SDK session and clear localStorage
   * This ensures the SDK accepts a new sessionId on next initialize
   * Call this before initializing with a new sessionId after logout
   */
  public endSession(): void {
    const $t = getSDK();
    
    try {
      // FIRST: Clear localStorage BEFORE ending session
      // This prevents SDK from reloading the old session on next initialize
      localStorage.removeItem("telemetry_session_id");
      localStorage.removeItem("telemetry_session_started");
      
      // Also clear any other potential SDK session keys
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('telemetry_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // THEN: End the SDK session if it exists
      if ($t) {
        // Check if SDK has an active session
        if (typeof $t.isSessionActive === 'function' && $t.isSessionActive()) {
          // End the previous session
          if (typeof $t.end === 'function') {
            $t.end({ type: "session" });
            console.log('✅ Previous SDK session ended');
          }
        }
        
        // FORCE reset SDK's initialized flag - this is critical
        // The SDK checks this flag and refuses to re-initialize if it's true
        if ($t.config) {
          $t.config.sid = '';
          $t.config.initialized = false;
        }
        
        // Also try to reset other possible initialized flags
        if ($t._initialized !== undefined) {
          $t._initialized = false;
        }
        if ($t.initialized !== undefined) {
          $t.initialized = false;
        }
      }
      
      // Reset wrapper state
      this.isInitialized = false;
      this.sessionId = '';
    } catch (error) {
      console.warn('⚠️ Error ending SDK session:', error);
    }
  }
}

// Export singleton instance
export const sunbirdTelemetryWrapper = SunbirdTelemetryWrapper.getInstance();

// Helper functions for creating event data
export const createGameStartData = (
  gameId: string,
  gameName: string,
  level: number,
  userId: string,
  language: string
): any => {
  return {
    type: 'content',
    mode: 'play',
    pageid: `${gameId}-level-${level}`,
    gameId,
    gameName,
    level,
    language,
    stageid: `${gameId}-level-${level}`,
    userId,
    timestamp: Date.now()
  };
};

export const createGameInteractData = (
  questionId: string,
  questionType: string,
  userAnswer: any,
  correctAnswer: any,
  isCorrect: boolean,
  responseTime: number
): TelemetryEventData => {
  return {
    id: `question_${questionId}`,
    type: 'TOUCH',
    subtype: 'CLICK',
    questionId,
    questionType,
    userAnswer,
    correctAnswer,
    isCorrect,
    responseTime,
    timestamp: Date.now()
  };
};

export const createGameEndData = (
  sessionId: string,
  duration: number,
  totalQuestions: number,
  correctAnswers: number,
  successRate: number,
  levelCompleted: boolean
): TelemetryEventData => {
  return {
    type: 'content',
    mode: 'play',
    pageid: 'game-end',
    sessionId,
    duration,
    totalQuestions,
    correctAnswers,
    successRate,
    levelCompleted,
    summary: [
      { metric: 'totalQuestions', value: totalQuestions },
      { metric: 'correctAnswers', value: correctAnswers },
      { metric: 'successRate', value: successRate },
      { metric: 'levelCompleted', value: levelCompleted }
    ],
    timestamp: Date.now()
  };
};

// Note: Mock events are no longer needed since SDK is loaded via script tag
// If SDK is not available, events will simply be skipped with a warning
