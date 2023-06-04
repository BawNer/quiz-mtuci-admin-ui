import { defineStore } from "pinia";
import httpRequestHandler from "stores/httpRequestHandler";
import { api } from "boot/axios";

export const useMtuciStore = defineStore('mtuci', {
  state: () => ({
    groups: []
  }),
  getters: {
    getAllGroups: state => state.groups
  },
  actions: {
    fetchGroups() {
      httpRequestHandler(api.get('/users/groups')).then(response => {
        this.groups = response.groups
      })
    }
  }
})
