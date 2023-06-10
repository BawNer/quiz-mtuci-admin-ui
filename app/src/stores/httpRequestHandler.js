import {Cookies, Dialog, Notify} from 'quasar'

export default (request) => {
  const noty = Notify.create({
    position: 'bottom-right',
    message: 'Получение данных',
    timeout: 0,
    group: false,
    spinner: true,
    color: 'primary'
  })
  return request
    .then((response) => {
      if (response.data.description) {
        noty({
          timeout: 2500,
          message: response.data.description,
          color: 'positive',
          spinner: false,
          icon: 'done'
        })
      } else {
        noty()
      }

      return Promise.resolve(response.data)
    })
    .catch((err) => {
      if (err.response?.status === 403) {
        Dialog.create({
          title: 'Ошибка доступа',
          message: `${err.response.data.description}.`,
          html: true,
          persistent: true
        }).onOk(() => {
          Cookies.remove('token')
          window.location.href = `${window.origin}/security`
        })
      }

      if (err.response?.status === 401) {
        Dialog.create({
          title: 'Ошибка сессии',
          message: 'Ваша сессия истекла, необходимо авторизоваться!',
          persistent: true
        }).onOk(() => {
          Cookies.remove('token')
          window.location.href = `${window.origin}/security`
        })
      }

      noty({
        icon: 'report',
        message: err.response?.data.description ? err.response.data.description : `Ошибка: ${err.message}`,
        color: 'negative',
        timeout: 2500,
        spinner: false
      })
      return Promise.reject(err)
    })

}
