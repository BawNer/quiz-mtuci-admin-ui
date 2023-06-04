import {copyToClipboard, Notify} from 'quasar';

export default class CopyContent {
  static rawData(payload) {
    copyToClipboard(payload).then(() => {
      Notify.create({
        position: 'top-right',
        message: 'Текст скопирован!',
        type: 'positive',
        icon: 'new_releases'
      })
    })
      .catch(() => {
        Notify.create({
          position: 'top-right',
          message: 'Ошибка копирования',
          type: 'negative',
          icon: 'report'
        })
      })

  }
}
