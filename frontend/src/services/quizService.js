import api from '@/services/api'

export const quizService = {
  getQuiz: (quizId) => api.get(`/quizzes/${quizId}`).then(r => r.data),
  submitAttempt: (data) => api.post('/quizzes/attempt', data).then(r => r.data),
}
