import api from '@/services/api'

export const courseService = {
  /** Get all published courses (public) */
  list: (params = {}) => api.get('/courses', { params }).then(r => r.data),

  /** Get a single course by ID */
  get: (id) => api.get(`/courses/${id}`).then(r => r.data),

  /** Create a new course (Instructor only) */
  create: (data) => api.post('/courses', data).then(r => r.data),

  /** Update a course */
  update: (id, data) => api.patch(`/courses/${id}`, data).then(r => r.data),

  /** Delete a course */
  delete: (id) => api.delete(`/courses/${id}`),

  /** Enroll the current student in a course */
  enroll: (courseId) => api.post(`/enrollments`, { course_id: courseId }).then(r => r.data),
}
