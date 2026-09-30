import api from '@/services/api'

export const aiService = {
  /** Ask the AI tutor */
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
