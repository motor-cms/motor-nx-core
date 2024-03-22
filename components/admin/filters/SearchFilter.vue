<template>
  <div class="col-md-3">
    <input
      id="motor-grid-search"
      v-model="term"
      @blur="submitSearch"
      @keyup.enter="$event.target.blur()"
      :placeholder="$t('global.press_enter_to_serach')"
      class="form-control form-control-alternative"
    />
  </div>
</template>
<script setup lang="ts">

const term = ref("");
const router = useRouter();
const route = useRoute();
const emits = defineEmits(['submit'])

watch(() => route.query, () => {
  term.value = route.query.search || ''
}, { immediate: true })

const submitSearch = async () => {
  emits('submit', { parameter: 'search', value: term })
}
</script>
