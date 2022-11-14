<template>
  <div class="col-lg-12 col-md-12 mb-md-0 mb-4">
    <div class="card">
      <div class="card-header pb-0">
        <div class="row">
          <div class="col-lg-12">
            <div class="row">
              <div class="col-md-6">
                <h6>{{ name }}</h6>
              </div>

              <div class="col-md-6 text-end">
                <component
                    v-for="component in headerActions"
                    :key="component.name"
                    :is="component.name"
                />
                <router-link v-if="createRoute" :to="{ name: createRoute }">
                  <button class="btn btn-sm btn-success">
                    {{ createLabel }}
                  </button>
                </router-link>
              </div>
            </div>
            <div class="row">
              <component
                  v-for="f in filters"
                  :key="f.name"
                  :is="f.name"
                  :options="f.options"
                  @submit="submitFilter"
              ></component>
              <div class="col">
                <ul class="pagination float-end">
                  <li class="page-item disabled" v-if="meta.current_page === 1">
                    <a class="page-link text-black">
                      <fa icon="chevron-left"></fa>
                    </a>
                  </li>

                  <li
                      class="page-item"
                      @click="previousPage"
                      v-if="meta.current_page > 1"
                  >
                    <a class="page-link text-black">
                      <fa icon="chevron-left"></fa>
                    </a>
                  </li>

                  <li
                      class="page-item"
                      @click="nextPage()"
                      v-if="meta.current_page < meta.last_page"
                  >
                    <a class="page-link text-black">
                      <fa icon="chevron-right"/>
                    </a>
                  </li>

                  <li
                      class="page-item disabled"
                      v-if="meta.current_page === meta.last_page"
                  >
                    <a class="page-link text-black">
                      <fa icon="chevron-right"/>
                    </a>
                  </li>
                </ul>

                <select
                    class="form-control max-width-100 d-inline float-end me-2"
                    name="per-page"
                    @change="submitFilter($event)"
                    v-model="filterValues.per_page"
                >
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>

                <div v-if="meta.total > 0" class="float-end mt-2 me-2">
                  {{ meta.from }} - {{ meta.to }} / {{ meta.total }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body px-0 pb-2">
        <div class="table-responsive">
          <table class="motor-nx-grid table align-items-center mb-0">
            <thead>
            <tr>
              <th
                  v-for="column in columns"
                  :key="column.name"
                  class="
                    text-uppercase text-secondary text-xxs
                    font-weight-bolder
                    opacity-7
                  "
                  :style="column.columnStyle"
              >
                {{ column.name }}
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="meta.total === 0">
              <td :colspan="columns.length">
                <h3 class="p-8 text-lg font-bold text-center">
                  {{ $t('global.no_records_found') }}
                </h3>
              </td>
            </tr>
            <template v-if="rows.length === 0 && isLoading">
              <tr
                  v-for="index in 5"
                  :key="index"
                  :class="index % 2 === 1 ? 'bg-gray-100' : ''"
              >
                <td
                    v-for="column in columns"
                    :key="column.name"
                    class="align-middle text-sm text-wrap"
                    :class="column.rowClass"
                >
                  <div
                      class="d-flex px-3 py-1"
                      :class="column.rowWrapperClass"
                  >
                    <Skeletor
                        height="30"
                        :width="Math.random() * 20 + 80 + '%'"
                    />
                  </div>
                </td>
              </tr>
            </template>
            <tr
                v-for="(row, index) in rows"
                :key="row.id"
                :class="index % 2 === 0 ? 'bg-gray-100' : ''"
            >
              <td
                  v-for="column in columns"
                  :key="column.name"
                  class="align-middle text-sm text-wrap"
                  :class="column.rowClass"
              >
                <div class="d-flex px-3 py-1" :class="column.rowWrapperClass">
                  <component
                      v-for="component in column.components"
                      :key="component.name"
                      :is="component.name"
                      :options="component.options"
                      :record="row"
                      :prop="column.prop"
                      :resource="resource"
                      :index="index"
                      @submit="submitCell"
                  />
                  <template v-if="column.renderer">
                    <div
                        v-html="
                          renderer(
                            column.renderer,
                            getPropertyValue(row, column.prop)
                          )
                        "
                    ></div>
                  </template>
                  <template v-if="!column.renderer && !column.components">
                    {{ getPropertyValue(row, column.prop) }}
                  </template>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Component, computed, defineComponent, nextTick, onMounted, reactive, ref} from 'vue'
import SearchFilter from '../filters/SearchFilter.vue'
import SelectFilter from '../filters/SelectFilter.vue'
import moment from 'moment'
import {Skeletor} from 'vue-skeletor'
import 'vue-skeletor/dist/vue-skeletor.css'
import {useStore} from "vuex";
import {useI18n} from "vue-i18n";

export default defineComponent({
  components: {
    SearchFilter,
    SelectFilter,
    Skeletor,
  },
  props: {
    name: {
      type: String,
      default: 'Grid',
    },
    columns: {
      type: Array,
      default: ref([]),
    },
    rows: {
      type: Array,
      default: ref([]),
    },
    meta: {
      type: Object,
      default: () => {
        return {}
      },
    },
    resource: {
      type: String,
      default: '',
    },
    filters: {
      type: Array,
      default: ref([]),
    },
    loadComponents: {
      type: Array,
      default: () => [],
    },
    createLabel: {
      type: String,
      default: 'New record',
    },
    createRoute: {
      type: String,
      default: '',
    },
    headerActions: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, ctx) {
    const store = useStore();
    const {t} = useI18n()
    const filterValues = reactive({per_page: 25, page: 1});
    const isLoading = computed(() => {
      return store.state.motor.loading
    });

    const submitFilter = (data: { parameter: string; value: string }) => {
      // Reset page when filtering or searching
      filterValues.page = 1
      if (data.parameter) {
        filterValues[data.parameter] = data.value
      }
      ctx.emit('submit', filterValues)
    };

    const previousPage = () => {
      filterValues.page--
      ctx.emit('submit', filterValues)
    };

    const nextPage = () => {
      filterValues.page++
      ctx.emit('submit', filterValues)
    };

    const renderer = (
            renderer: {
              type: string
              path: string
              format: string
              property: string
            },
            value: any
        ): string => {
          switch (renderer.type) {
            case 'translation':
              return t(renderer.path + '.' + value)
            case 'boolean':
              return value ? t('global.yes') : t('global.no')
            case 'date':
              if (!value) {
                return
              }
              if (renderer.format) {
                return moment(value).format(renderer.format)
              }
              return moment(value).toString()
            case 'count':
              return value.length ? value.length.toString() : 'ß'
            case 'list':
              return value.map((object: any) => {
                return ' ' + object[renderer.property]
              })
            case 'currency':
          return value.toFixed(2) + ' ' + renderer.format
            default:
              return value
          }
        }
        const submitCell = (params: any) => {
          ctx.emit('submitCell', {
            componentParams: params,
            filterValues,
          })
        }

    const getPropertyValue = (object: any, property: string): string => {
      property = property.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '') // convert indexes to properties and strip leading dot
      let a = property.split('.')
      for (let i = 0, n = a.length; i < n; ++i) {
        var k = a[i]
        if (object && k in object) {
          object = object[k]
        } else {
          return
        }
      }
      return object
    }

        return {
          filterValues,
          isLoading,
          nextPage,
          previousPage,
          submitFilter,
          renderer,
          submitCell,
          getPropertyValue
        }
  },
})
</script>
