/**
 * Tracking Assessment Service
 * 
 * This service provides a reusable interface to send game assessment data
 * to the backend tracking microservice API.
 * 
 * Usage:
 * ```typescript
 * import { trackingAssessmentService } from "./trackingAssessmentService";
 * 
 * await trackingAssessmentService.createAssessmentTracking({
 *   userId: 'user-123',
 *   gameKey: 'combinedLetter_te',
 *   level: 1,
 *   totalQuestions: 10,
 *   correctAnswers: 8,
 *   timeSpent: 120,
 *   assessmentSummary: [{ questionId: '1', correct: true, ... }]
 * });
 * ```
 */

import { v4 as uuidv4 } from 'uuid';

// UUID v4 generator using uuid library
function generateUUID(): string {
  return uuidv4();
}

// Backend API configuration
const TRACKING_API_BASE_URL = (process.env.REACT_APP_TRACKING_API_BASE_URL || 'https://www.learnerai-dev.theall.ai/lais/scores');
const TRACKING_API_ENDPOINT = `${TRACKING_API_BASE_URL}/assessment/create`;

export interface QuestionSummary {
  questionId: string;
  questionType: string;
  userAnswer: string | number;
  correctAnswer: string | number;
  isCorrect: boolean;
  responseTime: number;
  complexity: string;
}

export interface CreateAssessmentData {
  userId: string;
  gameKey: string;
  gameTitle: string;
  level: number;
  language: string;
  totalQuestions: number;
  correctAnswers: number;
  totalScore: number;
  timeSpent: number; // in seconds
  assessmentSummary: QuestionSummary[];
  metadata?: Record<string, any>;
  subsessionId?: string; // Optional: Use telemetry subsession ID as assessmentTrackingId
  sessionId?: string; // Optional: Use telemetry session ID as attemptId
  sub_session_id?: string; // Optional: Sub session ID for F1 flow
  sub_milestone_level?: string; // Optional: Sub milestone level (e.g., "F1")
  apply_level?: string; // Optional: Apply level (e.g., "A1", "A2", "A3")
  sub_apply_level?: number; // Optional: Sub apply level (1, 2, or 3 - the level within the Apply step)
}

export interface AssessmentTrackingPayload {
  userId: string;
  courseId: string; // Using gameKey as courseId
  contentId: string; // Using gameKey + level as contentId
  attemptId: string; // Unique attempt ID
  assessmentSummary: any[]; // Array of question summaries
  totalMaxScore: number; // Maximum possible score
  totalScore: number; // User's actual score
  lastAttemptedOn: string; // ISO date string
  timeSpent: number; // Time spent in seconds
  unitId: string; // Using level as unitId
  evaluatedBy?: 'AI' | 'Online' | 'Manual';
  submitedBy?: string;
  showFlag?: boolean;
}

class TrackingAssessmentService {
  /**
   * Create an assessment tracking record
   * 
   * @param data - Assessment data from the game
   * @returns Response from the backend API
   */
  async createAssessmentTracking(data: CreateAssessmentData): Promise<any> {
    try {
      // Use session ID if provided, otherwise generate new UUID
      const attemptId = data.sessionId || generateUUID();
      // Use subsession ID if provided, otherwise generate new UUID
      const assessmentTrackingId = data.subsessionId || generateUUID();

      // Calculate scores (1 point per correct answer)
      // If totalScore is explicitly provided, use it; otherwise calculate from correctAnswers
      const totalMaxScore = data.totalQuestions * 1;
      const totalScore = data.totalScore !== undefined ? data.totalScore : (data.correctAnswers * 1);

      // Prepare the payload according to backend DTO
      // Backend expects assessmentSummary in a nested structure for score detail table
      
      // Extract game name without language suffix (e.g., "combinedLetter_en" -> "combinedLetter")
      const gameName = data.gameKey.split('_')[0];
      
      // Get session_id and sub_session_id - use provided values or fallback to generated IDs
      const session_id = data.sessionId || attemptId;
      const sub_session_id = data.sub_session_id || data.subsessionId || assessmentTrackingId;

      // Ensure apply_level and sub_apply_level are always provided (required by backend)
      // For non-Apply steps, use default values
      const apply_level = data.apply_level && data.apply_level.trim() !== "" ? data.apply_level : "N/A";
      const sub_apply_level = data.sub_apply_level !== undefined && data.sub_apply_level !== null ? data.sub_apply_level : 0;
      
      const payload: any = {
        assessmentTrackingId: assessmentTrackingId, // Required by database
        userId: data.userId,
        courseId: gameName, // Just game name without language (e.g., "combinedLetter")
        contentId: `level${data.level}`, // Format: level1, level2, level10
        attemptId: attemptId,
        session_id: session_id, // Required by backend
        sub_session_id: sub_session_id, // Required by backend
        apply_level: apply_level, // Required by backend - "N/A" for non-Apply steps
        sub_apply_level: sub_apply_level, // Required by backend - 0 for non-Apply steps
        assessmentSummary: [{
          sectionId: gameName, // Game name as section (e.g., "combinedLetter", "letterGame")
          data: data.assessmentSummary.map((q, index) => ({
            item: {
              id: q.questionId,
              sectionId: q.questionType, // Game mechanic type (letterHunt, quickSight, memoryChallenge)
              maxscore: 1,
              title: `Question ${index + 1}`
            },
            pass: q.isCorrect ? 'Yes' : 'No',
            resvalues: [
              {
                userAnswer: q.userAnswer,
                correctAnswer: q.correctAnswer
              }
            ],
            duration: q.responseTime, // Duration in milliseconds
            score: q.isCorrect ? 1 : 0
          }))
        }],
        totalMaxScore: totalMaxScore,
        totalScore: totalScore,
        lastAttemptedOn: new Date().toISOString(),
        timeSpent: data.timeSpent,
        unitId: data.language, // Language code (e.g., 'en', 'te', 'kn')
        submitedBy: 'Online', // Backend defaults to 'Online' if not provided
      };

      // Add sub_milestone_level - required by backend
      // For F1 flow: "F1", For F2 flow: "F2", For other flows: use provided value or "N/A"
      payload.sub_milestone_level = data.sub_milestone_level || "N/A";

      // Get API token from localStorage
      const apiToken = typeof window !== 'undefined' ? localStorage.getItem('apiToken') : null;

      // Send POST request to backend
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'tenantId': 'default-tenant', // You may want to make this configurable
      };
      
      // Add Authorization header if apiToken is available
      if (apiToken) {
        headers['Authorization'] = `Bearer ${apiToken}`;
      }
      
      const response = await fetch(TRACKING_API_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Failed to create assessment tracking:', errorData);
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Assessment tracking created successfully:',payload );

      return result;
    } catch (error) {
      console.error('❌ Error creating assessment tracking:', error);
      // Don't throw error - we don't want to break the game flow if tracking fails
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Search for assessment tracking records
   * Returns highest score and most recent attempt for given filters
   * 
   * @param filters - Search filters
   * @returns Highest score record and recent record
   */
  async searchAssessmentTracking(filters: {
    userId?: string;
    courseId?: string;
    contentId?: string;
    unitId?: string;
  }): Promise<any> {
    // API call disabled - return empty result
    console.log('⚠️ searchAssessmentTracking API call is disabled');
    return {
      success: true,
      data: null,
      highestScore: null,
      recentRecord: null,
    };
    
    /* DISABLED - Original API call code
    try {
      const searchEndpoint = `${TRACKING_API_BASE_URL}/assessment/search`;
      
      // Get API token from localStorage
      const apiToken = typeof window !== 'undefined' ? localStorage.getItem('apiToken') : null;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'tenantId': 'default-tenant',
      };
      
      // Add Authorization header if apiToken is available
      if (apiToken) {
        headers['Authorization'] = `Bearer ${apiToken}`;
      }
      
      const response = await fetch(searchEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new Error(`Search request failed: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Error searching assessment tracking:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
    */
  }

  /**
   * Get assessment tracking details by ID
   * 
   * @param assessmentTrackingId - The assessment tracking ID
   * @returns Assessment tracking details
   */
  async getAssessmentTrackingDetails(assessmentTrackingId: string): Promise<any> {
    try {
      const detailsEndpoint = `${TRACKING_API_BASE_URL}/assessment/read/${assessmentTrackingId}`;

      // Get API token from localStorage
      const apiToken = typeof window !== 'undefined' ? localStorage.getItem('apiToken') : null;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'tenantId': 'default-tenant',
      };
      
      // Add Authorization header if apiToken is available
      if (apiToken) {
        headers['Authorization'] = `Bearer ${apiToken}`;
      }

      const response = await fetch(detailsEndpoint, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Get details request failed: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Error getting assessment tracking details:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Export singleton instance
export const trackingAssessmentService = new TrackingAssessmentService();

