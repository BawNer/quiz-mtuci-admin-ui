import { defineStore } from "pinia";
import httpRequestHandler from "stores/httpRequestHandler";
import { api } from "boot/axios";

export const useQuizStore = defineStore('quizzes', {
  state: () => ({
    quizzes: []
  }),
  getters: {
    getQuizzes: state => state.quizzes
  },
  actions: {
    fetchQuizzes() {
      httpRequestHandler(api.get('/quiz/')).then(response => {
        this.quizzes = response.quizzes
      })
    },
    deleteQuiz(id) {
      httpRequestHandler(api.delete(`/quiz/${id}`)).then(() => {
        this.quizzes = this.quizzes.filter((q) => q.id !== id)
      })
    },
    addQuiz(payload) {
      payload.active = true
      payload.accessFor = payload.accessFor.toString()
      return httpRequestHandler(api.post('/quiz/', payload)).then((response) => {
        this.quizzes.unshift(response.quiz)
      })
    }
  }
})
