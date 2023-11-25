<template>
  <form @submit="submit">
    <div class="col-lg-12 col-md-12 mb-md-0 mb-4">
      <div class="card">
        <div class="card-header pb-0">
          <div class="row">
            <div class="col-lg-12">
              <div class="row">
                <div class="col-md-6">
                  <div class="d-flex flex-row align-items-center">
                    <h6 class="m-0" v-if="!loading">{{ title }}</h6>
                    <div v-if="updatingInBackground" class="mx-4 spinner-header"><div></div><div></div><div></div><div></div></div>
                  </div>
                </div>
                <div class="col-md-6 text-end">
                  <NuxtLink :to="route" v-if="route.length">
                    <button class="btn btn-outline-primary">
                      {{ $t('global.back') }}
                    </button>
                  </NuxtLink>
                  <button v-if="withSaving" class="btn bg-gradient-primary ms-2" type="submit" :disabled="loading || updatingInBackground || !saveable">
                    {{ $t('global.save') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-body px-4 pb-2">
          <slot></slot>
        </div>
      </div>
    </div>
  </form>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import useRouteParser from "@zrm/motor-nx-core/composables/route/parse";

import {storeToRefs} from "pinia";

export default defineComponent({
  emits: ['submit'],
  props: {
    title: {
      type: String,
      default: 'Form',
    },
    backRoute: {
      type: String,
      default: '',
    },
    withSaving: {
      type: Boolean,
      default: true
    }
  },
  setup(props,ctx) {
    const submit = (e: Event) => {
      e.preventDefault()
      ctx.emit('submit');
    }
    const routeParser = useRouteParser();
    const route = props.backRoute.length ? routeParser.routeDottedToSlash(props.backRoute): '';
    const appStore = useAppStore();
    const { loading, updatingInBackground} = storeToRefs(appStore);
    const formStore = useFormStore();
    const { form } = storeToRefs(formStore);
    const saveable = computed(() => {
      return form.value.meta.valid;
    })

    return {
      submit,
      form,
      route,
      loading,
      updatingInBackground,
      saveable
    }
  },
})
</script>
<style scoped lang="scss">
	form {
		width: 100%;
	}
</style>
