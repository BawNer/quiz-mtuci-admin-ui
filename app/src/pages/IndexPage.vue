<template>
  <q-page padding>
    <q-table
      title="Опросы"
      :columns="columns"
      :rows="quizzes"
      :pagination="{
        rowsPerPage: 0
      }"
      no-data-label="Нет доступных опросов"
    >
      <template v-slot:top>
        <div class="q-table__title text-h3">
          Опросы
        </div>

        <q-space></q-space>
        <q-btn
          color="primary"
          dense
          unelevated
          no-caps
          label="Создать опрос"
          @click="() => openCreateQuizDialog = true"
        ></q-btn>
        <q-btn
          color="grey"
          flat
          dense
          icon="refresh"
          label="Обновить"
          class="q-ml-sm"
          @click="onUpdateQuizData"
        ></q-btn>
      </template>

      <template v-slot:body-cell-accessFor="props">
        <q-td :props="props">
          <q-badge
            v-for="group in props.row.accessFor"
            :key="group.id"
            :label="group.name"
            color="primary"
            class="q-mx-sm"
          ></q-badge>
        </q-td>
      </template>

      <template v-slot:body-cell-active="props">
        <q-td :props="props">
          <q-badge
            :color="props.row.active ? 'positive' : 'negative'"
            :label="props.row.active ? 'Доступен' : 'Недоступен'"
          ></q-badge>
        </q-td>
      </template>
      <template v-slot:body-cell-questions="props">
        <q-td :props="props">
          {{props.row.questions.length}}
        </q-td>
      </template>
      <template v-slot:body-cell-author="props">
        <q-td :props="props">
          {{props.row.author.name}}
        </q-td>
      </template>
      <template v-slot:body-cell-createdAt="props">
        <q-td :props="props">
          {{DateHelper.getLocale(props.row.createdAt)}}
        </q-td>
      </template>
      <template v-slot:body-cell-link="props">
        <q-td :props="props">
          <q-btn
            label="Получить ссылку"
            flat
            dense
            no-caps
            color="primary"
            @click="() => CopyContent.rawData(`http://localhost:9000/quiz/${props.row.quizHash}`)"
          ></q-btn>
        </q-td>
      </template>
      <template
        v-slot:body-cell-rules="props"
      >
        <q-td :props="props">
          <q-btn
            icon="delete"
            flat
            dense
            color="negative"
            @click="onDeleteQuiz(props.row.id)"
          ></q-btn>
        </q-td>
      </template>
    </q-table>

    <q-dialog
      v-model="openCreateQuizDialog"
      persistent
    >
      <q-card style="min-width: 800px">
        <q-card-section class="row justify-between">
          <div class="text-h6 q-pb-none">
            Создание опроса
          </div>
          <q-btn
            label="Добавить вопрос"
            dense
            unelevated
            color="primary"
            no-caps
            @click="onAddQuestionHandler"
          ></q-btn>
        </q-card-section>
        <q-card-section class="column q-col-gutter-sm">
          <div class="col">
            <q-input
              label="Название опроса"
              outlined
              dense
              v-model="quiz.title"
            ></q-input>
          </div>
          <div class="col">
            <q-select
              label="Для кого опрос"
              outlined
              dense
              v-model="quiz.accessFor"
              :options="groups"
              multiple
              :option-value="option => option.id"
              :option-label="option => option.name"
              emit-value
              map-options
            ></q-select>
          </div>
          <div class="column q-col-gutter-sm">
            <div
              class="column q-col-gutter-sm"
            >
              <div class="row items-center">
                <div class="column">
                  <span class="text-overline">Вопрос {{quizQuestionID + 1}} из {{quiz.questions.length}}</span>
                  <div>
                    <q-btn
                      dense
                      outline
                      class="q-mr-md"
                      icon="arrow_left"
                      :disable="quizQuestionID === 0"
                      @click="() => quizQuestionID--"
                    ></q-btn>
                    <q-btn
                      dense
                      outline
                      class="q-mr-md"
                      icon="arrow_right"
                      :disable="quiz.questions.length - 1 <= quizQuestionID"
                      @click="() => quizQuestionID++"
                    ></q-btn>
                  </div>
                </div>
                <q-space></q-space>
                <q-btn
                  label="Добавить ответ"
                  dense
                  no-caps
                  unelevated
                  color="primary"
                  class="q-mr-md"
                  @click="onAddAnswersHandler(quizQuestionID)"
                ></q-btn>
                <q-btn
                  label="Удалить вопрос"
                  dense
                  flat
                  no-caps
                  color="negative"
                  :disable="quiz.questions.length === 1"
                  @click="onDeleteQuestionHandler(quizQuestionID)"
                ></q-btn>
              </div>
              <div class="col">
                <q-input
                  label="Название вопроса"
                  v-model="quiz.questions[quizQuestionID].label"
                  outlined
                  dense
                ></q-input>
              </div>
              <div class="col">
                <q-input
                  label="Описание вопроса"
                  v-model="quiz.questions[quizQuestionID].description"
                  outlined
                  dense
                  type="textarea"
                ></q-input>
              </div>
              <div
                class="column q-col-gutter-sm"
                v-for="(a, i) in quiz.questions[quizQuestionID].answersOptions"
                :key="i"
              >
                <div class="row justify-between items-center">
                  <div class="column">
                    <span class="text-overline">Ответ на вопрос {{i+1}} из {{quiz.questions[quizQuestionID].answersOptions.length}}</span>
                  </div>
                  <q-btn
                    label="Удалить ответ"
                    dense
                    flat
                    no-caps
                    color="negative"
                  ></q-btn>
                </div>
                <div class="col">
                  <q-input
                    label="Название ответа"
                    dense
                    outlined
                    v-model="a.label"
                  ></q-input>
                </div>
                <div class="col">
                  <q-input
                    label="Описание ответа"
                    dense
                    outlined
                    v-model="a.description"
                    type="textarea"
                  ></q-input>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            label="Создать"
            dense
            unelevated
            no-caps
            color="primary"
            @click="onSaveQuiz"
          ></q-btn>
          <q-btn
            label="Отмена"
            flat
            dense
            no-caps
            color="negative"
            v-close-popup
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { computed, defineComponent, reactive, ref } from "vue";
import { useQuizStore } from "stores/quizzes";
import DateHelper from "../helpers/date";
import CopyContent from "src/helpers/copyContent";
import { useMtuciStore } from "stores/mtuci";
import { Dialog } from "quasar";

export default defineComponent({
  name: 'IndexPage',
  computed: {
    CopyContent() {
      return CopyContent
    },
    DateHelper() {
      return DateHelper
    }
  },
  preFetch() {
    const quizStore = useQuizStore()
    const mtuciStore = useMtuciStore()

    mtuciStore.fetchGroups()
    quizStore.fetchQuizzes()
  },
  setup() {
    const quizStore = useQuizStore()
    const mtuciStore = useMtuciStore()
    const quizzes = computed(() => quizStore.getQuizzes)
    const groups = computed(() => mtuciStore.getAllGroups)

    const columns = [
      { name: 'id', label: 'ID', field: 'id', align: 'center' },
      { name: 'active', label: 'Доступность', field: 'active', align: 'center' },
      { name: 'title', label: 'Название', field: 'title', align: 'left' },
      { name: 'accessFor', label: 'Опрос для', field: 'accessFor', align: 'center' },
      { name: 'questions', label: 'Вопросов', field: 'questions', align: 'center' },
      { name: 'author', label: 'Автор', field: 'author', align: 'left' },
      { name: 'link', label: 'Ссылка на опрос', field: 'link', align: 'center' },
      { name: 'createdAt', label: 'Создан', field: 'createdAt', align: 'center' },
      { name: 'rules', label: 'Управление', field: 'rules', align: 'center' }
    ]
    const openCreateQuizDialog = ref(false)

    const quiz = reactive({
        title: 'Опрос',
        accessFor: [],
        questions: [
          {
            label: "Вопрос 1",
            description: 'Описание вопроса 1',
            answersOptions: [
              {
                label: 'Ответ 1',
                description: 'Описание ответа 1'
              }
            ]
          }
        ]
      })
    const questionDTO = {
      label: '',
      description: '',
      answersOptions: []
    }
    const answerDTO = {
      label: '',
      description: ''
    }
    const quizQuestionID = ref(0)

    const onAddQuestionHandler = () => {
      quiz.questions.push(JSON.parse(JSON.stringify(questionDTO)))
    }

    const onDeleteQuestionHandler = (id) => {
      quiz.questions = quiz.questions.filter((q, i) => i !== id)
      quizQuestionID.value > quiz.questions.length - 1 ?
        quizQuestionID.value = quiz.questions.length - 1 : null
    }

    const onAddAnswersHandler = (questionID) => {
      quiz.questions[questionID].answersOptions.push(JSON.parse(JSON.stringify(answerDTO)))
    }

    const onSaveQuiz = () => {
      quizStore.addQuiz(quiz).then(() => {
        openCreateQuizDialog.value = false
      })
    }

    const onDeleteQuiz = id => {
      Dialog.create({
        title: "Удаление опроса",
        message: "Вы дейсвительно хотите удалить опрос?",
        ok: {
          flat: true,
          color: 'primary',
          label: "Да"
        },
        cancel: {
          flat: true,
          color: 'negative',
          label: 'Отмена'
        }
      }).onOk(() => {
        quizStore.deleteQuiz(id)
      })
    }

    const onUpdateQuizData = () => {
      quizStore.fetchQuizzes()
    }

    return {
      quizzes,
      columns,
      openCreateQuizDialog,
      quiz,
      quizQuestionID,
      onAddQuestionHandler,
      onDeleteQuestionHandler,
      onAddAnswersHandler,
      groups,
      onSaveQuiz,
      onDeleteQuiz,
      onUpdateQuizData
    }
  }
})
</script>
