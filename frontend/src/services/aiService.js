import api from '@/services/api'

export const aiService = {
  /**
   * Chat with the AI Tutor
   * @param {Object} params
   * @param {string} params.message - Question or message text
   * @param {Array} [params.history] - Array of recent chat turns [{role, content}]
   * @param {string} [params.courseId] - Active course ID
   * @param {string} [params.courseTitle] - Active course title
   * @param {string} [params.lessonId] - Active lesson ID
   * @param {string} [params.lessonTitle] - Active lesson title
   * @param {string} [params.topic] - Active topic
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

  /** Ask the AI tutor (simple question endpoint) */
  askTutor: (question, lessonId = null, courseId = null) =>
    api.post('/ai/tutor', { question, lesson_id: lessonId, course_id: courseId }).then(r => r.data),

  /** Generate quiz questions */
  generateQuiz: (topic, numQuestions = 5, difficulty = 'INTERMEDIATE') =>
    api.post('/ai/generate-quiz', { topic, num_questions: numQuestions, difficulty }).then(r => r.data),

  /** Request an explanation of content */
  explain: (content, targetLevel = 'BEGINNER') =>
    api.post('/ai/explain', { content, target_level: targetLevel }).then(r => r.data),

  /** Generate a study plan */
  studyPlan: (courseId, hoursPerWeek = 5) =>
    api.post('/ai/study-plan', { course_id: courseId, available_hours_per_week: hoursPerWeek }).then(r => r.data),
}

export default aiService
