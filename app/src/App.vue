<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'
import { Cookies } from "quasar";
import { api } from "boot/axios";
console.log('Hello')
export default defineComponent({
  name: 'App',
  preFetch() {
    if (Cookies.has('token')) {
      api.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get('token')}`
    }
  }
})
</script>
