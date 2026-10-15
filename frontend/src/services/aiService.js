/**
 * AI Feature Service
 * ──────────────────────────────────────────────────────────────────────────
 * All AI calls route through the backend /api/v1/ai/* endpoints.
 * No AI API keys are used on the frontend.
 * The shared Axios instance handles JWT attachment and 401 token expiry.
 */
import api from '@/services/api'

export const aiService = {
  /**
   * Chat with the AI Tutor.
   * @param {Object} params
   * @param {string} params.message              - The student's question
   * @param {Array}  [params.history]            - Recent chat turns [{role, content}]
   * @param {string} [params.courseId]           - Active course UUID (resolved server-side)
   * @param {string} [params.courseTitle]        - Active course title (if already known)
   * @param {string} [params.lessonId]           - Active lesson UUID (resolved server-side)
   * @param {string} [params.lessonTitle]        - Active lesson title (if already known)
   * @param {string} [params.topic]              - Active topic
   * @returns {Promise<{success: boolean, answer: string, model_used: string}>}
   */
  chat: ({
    message,
    history = [],
    courseId = null,
    courseTitle = null,
    lessonId = null,
    lessonTitle = null,
    topic = null,
  }) =>
    api.post('/ai/chat', {
      message,
      history,
      course_id: courseId,
      course_title: courseTitle,
      lesson_id: lessonId,
      lesson_title: lessonTitle,
      topic,
    }).then(r => r.data),

  /**
   * Simple Q&A endpoint. Server resolves course/lesson context from DB.
   * @param {string} question
   * @param {string} [lessonId]
   * @param {string} [courseId]
   * @returns {Promise<{answer: string, model_used: string}>}
   */
  askTutor: (question, lessonId = null, courseId = null) =>
    api.post('/ai/tutor', {
      question,
      lesson_id: lessonId,
      course_id: courseId,
    }).then(r => r.data),

  /**
   * Generate quiz questions on a topic.
   * Returns structured questions — not a raw string.
   * @param {Object} params
   * @param {string} params.topic
   * @param {number} [params.numQuestions=5]          - 1–20
   * @param {string} [params.difficulty='INTERMEDIATE'] - EASY|INTERMEDIATE|HARD
   * @param {string} [params.questionType='MULTIPLE_CHOICE']
   * @param {string} [params.courseId]
   * @returns {Promise<{questions: Array, topic: string, difficulty: string, model_used: string, total_questions: number}>}
   */
  generateQuiz: ({
    topic,
    numQuestions = 5,
    difficulty = 'INTERMEDIATE',
    questionType = 'MULTIPLE_CHOICE',
    courseId = null,
  }) =>
    api.post('/ai/generate-quiz', {
      topic,
      num_questions: numQuestions,
      difficulty,
      question_type: questionType,
      course_id: courseId,
    }).then(r => r.data),

  /**
   * Explain lesson content at a target difficulty level.
   * When lessonId is provided, the server fetches content from the DB (access-checked).
   * @param {Object} params
   * @param {string} params.content             - Raw text to explain (fallback when no lessonId)
   * @param {string} [params.targetLevel='BEGINNER'] - BEGINNER|INTERMEDIATE|ADVANCED
   * @param {string} [params.lessonId]           - Lesson UUID for server-side DB lookup
   * @returns {Promise<{explanation: string, target_level: string, model_used: string, used_db_content: boolean}>}
   */
  explain: ({ content, targetLevel = 'BEGINNER', lessonId = null }) =>
    api.post('/ai/explain', {
      content,
      target_level: targetLevel,
      lesson_id: lessonId,
    }).then(r => r.data),

  /**
   * Generate a personalised study plan.
   * Server fetches real enrollment and progress data for the authenticated student.
   * @param {Object} params
   * @param {string} params.courseId
   * @param {number} [params.hoursPerWeek=5]          - 1–80
   * @param {number} [params.targetCompletionWeeks]    - 1–52, optional
   * @param {string} [params.goals]                    - Free-text student goals
   * @returns {Promise<{plan: string, course_id: string, hours_per_week: number, target_weeks: number|null, model_used: string}>}
   */
  studyPlan: ({ courseId, hoursPerWeek = 5, targetCompletionWeeks = null, goals = null }) =>
    api.post('/ai/study-plan', {
      course_id: courseId,
      available_hours_per_week: hoursPerWeek,
      target_completion_weeks: targetCompletionWeeks,
      goals,
    }).then(r => r.data),
}

export default aiService
