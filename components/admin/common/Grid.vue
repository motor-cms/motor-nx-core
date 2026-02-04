<template>
  <div class="col-lg-12 col-md-12 mb-md-0 mb-4">
    <div class="card">
      <div class="card-header pb-0">
        <div class="row">
          <div class="col-lg-12">
            <div class="row">
              <div class="col-md-6">
                <div class="d-flex flex-row align-items-center">
                  <h6
                    v-if="!loading"
                    class="m-0"
                  >
                    {{ name }}
                  </h6>
                  <SpinnerSmall v-if="updatingInBackground" />
                </div>
              </div>

              <div class="col-md-6 text-end">
                <component
                  :is="markRaw(components[component.name])"
                  v-for="component in headerActions"
                  :key="component.name"
                />
                <NuxtLink
                  v-if="hasBackButton && backRoute?.length > 0"
                  :to="goBackRoute"
                >
                  <button
                    class="btn btn-outline-primary border-radius-sm text-capitalize text-base mb-4 me-1"
                  >
                    {{ $t("global.back") }}
                  </button>
                </NuxtLink>
                <NuxtLink
                  v-if="hasTriggerTableActionButton && triggerTableActionButtonLabel"
                >
                  <a
                    class="btn bg-gradient-primary border-radius-sm text-capitalize text-base mb-4 me-1"
                    @click="$emit('triggerTableAction')"
                  >
                    {{ triggerTableActionButtonLabel }}
                  </a>
                </NuxtLink>
                <NuxtLink v-if="!withoutCreate && createRecordRoute && hasPermissionToRenderComponent('CreateButton')" :to="createRecordRoute">
                  <a class="btn bg-gradient-primary border-radius-sm text-capitalize text-base mb-4 me-1">
                    {{ createLabel }}
                  </a>
                </NuxtLink>
                <div v-if="withoutCreate" style="height: 80px"></div>
              </div>
            </div>
            <div class="row align-items-center">
              <component
                :is="markRaw(components[f.name])"
                v-for="f in filters"
                :key="f.name"
                :options="f.options"
                :name="f.name"
                :default-value="$route.query[f.options.parameter]"
                @submit="submitFilter"
              />
              <div
                v-if="hasGridActions && selectedItemsLength"
                class="col"
              >
                <div class="d-flex">
                  <select
                    v-model="gridAction"
                    class="form-control max-width-100 d-inline me-2"
                    name="per-page"
                  >
                    <option
                      v-for="action in gridActions"
                      :key="action.label"
                      :value="action"
                    >
                      {{ action.label }}
                    </option>
                  </select>
                  <button
                    type="button"
                    class="accordion-button"
                    @click="processGridAction"
                  >
                    <fa icon="play" />
                  </button>
                </div>
              </div>
              <div
                v-if="!loading"
                class="col"
              >
                <ul class="pagination float-end m-0">
                  <li
                    v-if="meta.current_page === 1"
                    class="page-item disabled"
                  >
                    <a class="page-link text-black">
                      <fa icon="chevron-left" />
                    </a>
                  </li>
                  <li
                    v-if="meta.current_page > 1"
                    class="page-item"
                    @click="firstPage"
                  >
                    <a class="page-link text-black">
                      <fa icon="chevron-left" />
                      <fa icon="chevron-left" />
                    </a>
                  </li>
                  <li
                    v-if="meta.current_page > 1"
                    class="page-item"
                    @click="previousPage"
                  >
                    <a class="page-link text-black">
                      <fa icon="chevron-left" />
                    </a>
                  </li>
                  <li>
                    <select
                      v-model="filterValues.page"
                      class="form-control"
                      name="per-page"
                      @change="goToPage"
                    >
                      <option
                        v-for="option in pageOptions"
                        :key="option"
                        :value="option"
                      >
                        Seite {{ option }} von
                        {{ meta.last_page }}
                      </option>
                    </select>
                  </li>
                  <li
                    v-if="meta.current_page < meta.last_page"
                    class="page-item"
                    @click="nextPage()"
                  >
                    <a class="page-link text-black">
                      <fa icon="chevron-right" />
                    </a>
                  </li>
                  <li
                    v-if="meta.current_page < meta.last_page"
                    class="page-item"
                    @click="lastPage()"
                  >
                    <a class="page-link text-black">
                      <fa icon="chevron-right" />
                      <fa icon="chevron-right" />
                    </a>
                  </li>
                  <li
                    v-if="meta.current_page === meta.last_page"
                    class="page-item disabled"
                  >
                    <a class="page-link text-black">
                      <fa icon="chevron-right" />
                    </a>
                  </li>
                </ul>
                <select
                  v-model="filterValues.per_page"
                  class="form-control max-width-100 d-inline float-end me-2"
                  name="per-page"
                  @change="submitFilter"
                >
                  <option value="25">
                    25
                  </option>
                  <option value="50">
                    50
                  </option>
                  <option value="100">
                    100
                  </option>
                </select>
                <div
                  v-if="meta.total > 0"
                  class="float-end mt-2 me-2"
                >
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
                <th v-if="hasGridActions">
                  <div style="position: relative">
                    <div
                      class="form-check d-flex align-items-center"
                      @click.prevent="selectPopoverActive = !selectPopoverActive"
                    >
                      <input
                        type="checkbox"
                        class="form-check-input"
                        :checked="allSelected || pageSelected"
                      >
                      <p
                        v-if="!allSelected"
                        class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 m-0 mx-1"
                      >
                        {{ selectedItemsLength }} {{ t("global.selected") }}
                      </p>
                      <p v-else class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 m-0 mx-1">
                        {{ meta.total }} {{ t("global.selected") }}
                      </p>
                    </div>
                    <Popover v-if="selectPopoverActive">
                      <div class="form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          :checked="pageSelected"
                          @input="setPageSelected"
                        >
                        <p
                          class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 m-0 mx-1"
                        >
                          {{ t("global.select_this_page") }}
                        </p>
                      </div>
                      <div class="form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          :checked="allSelected"
                          @input="setAllSelected"
                        >
                        <p
                          class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 m-0 mx-1"
                        >
                          {{ t("global.select_all_pages") }}
                        </p>
                      </div>
                      <div
                        v-if="selectedItemsLength"
                        class="form-check"
                        @click="deselect"
                      >
                        <fa icon="xmark" />
                        <p
                          class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 m-0 mx-1"
                        >
                          {{ t("global.unselect_all_pages") }}
                        </p>
                      </div>
                    </Popover>
                  </div>
                </th>
                <th
                  v-for="column in columns"
                  :key="column.name"
                  class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                  :style="column.columnStyle"
                >
                  <a
                    v-if="column.sortable"
                    class="text-uppercase text-xxs font-weight-bolder"
                    :class="[
                      (sortcol == column.prop) ? 'text-primary' : 'text-secondary',
                    ]"
                    href="javascript:void(0)"
                    @click="sort(column.prop)"
                  >
                    {{ column.name }}
                    <fa
                      :icon="sortcol == column.prop ? (sortasc ? 'sort-up' : 'sort-down') : 'sort'"
                      class="table__column-title-sort-icon"
                      :class="[
                        (sortcol == column.prop) ? 'text-primary' : 'text-secondary',
                      ]"
                    />
                  </a>
                  <template v-else>
                    {{ column.name }}
                  </template>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="meta.total === 0">
                <td :colspan="columns.length">
                  <h3 class="p-8 text-lg font-bold text-center">
                    {{ $t("global.no_records_found") }}
                  </h3>
                </td>
              </tr>
              <template
v-if="
                  (loading && rows.length === 0) ||
                    (updatingInBackground && rows.length === 0)
                "
              >
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
                  v-if="hasGridActions"
                  class="align-items-center text-sm"
                >
                  <div class="form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      :disabled="allSelected"
                      :name="name"
                      :value="name"
                      :checked="gridStore.isSelected(row) || allSelected"
                      @input="gridStore.selectItem(row)"
                    >
                  </div>
                </td>
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
                    <template
                      v-for="component in column.components"
                      :key="component.name"
                    >
                      <component
                        :is="markRaw(components[component.name])"
                        v-if="hasPermissionToRenderComponent(component.name)"
                        :class="{invisible: typeof component.visible == 'function' && !component.visible(row)}"
                        :options="component.options"
                        :record="row"
                        :prop="column.prop"
                        :resource="resource"
                        :index="index"
                        @submit="submitCell"
                      />
                    </template>
                    <template v-if="column.renderer">
                      <fa
                        v-if="
                          column.renderer.type === 'boolIcon' &&
                            getPropertyValue(row, column.prop) == true
                        "
                        class="text-success"
                        :icon="column.renderer.trueIcon"
                      />
                      <fa
                        v-else-if="
                          column.renderer.type === 'boolIcon' &&
                            getPropertyValue(row, column.prop) == false
                        "
                        class="text-danger"
                        :icon="column.renderer.falseIcon"
                      />
                      <div
                        v-else-if="column.renderer.type === 'boolIconWithText'"
                        class="d-flex align-items-center gap-2"
                      >
                        <fa
                          v-if="getPropertyValue(row, column.prop) == true"
                          class="text-success"
                          :icon="column.renderer.trueIcon"
                        />
                        <template v-else-if="column.renderer.falseRenderer && column.renderer.falseRenderer(row)">
                          <fa
                            :class="column.renderer.falseRenderer(row).iconClass || 'text-danger'"
                            :icon="column.renderer.falseRenderer(row).icon || column.renderer.falseIcon"
                          />
                          <span v-if="column.renderer.falseRenderer(row).text" class="text-xs text-secondary ms-2">
                            {{ column.renderer.falseRenderer(row).text }}
                          </span>
                        </template>
                        <fa
                          v-else
                          class="text-danger"
                          :icon="column.renderer.falseIcon"
                        />
                        <span
                          v-if="getPropertyValue(row, column.textProp)"
                          class="text-xs text-secondary ms-2"
                        >
                          {{ renderTransformedText(column, row) }}
                        </span>
                      </div>
                      <div
                        v-else-if="column.renderer.type === 'linkLabelId'"
                        v-html="
                          renderer(column.renderer, {
                            label: getPropertyValue(row, column.label),
                            id: getPropertyValue(row, column.id),
                          })
                        "
                      />
                      <div
                        v-else
                        v-html="
                          renderer(column.renderer, getPropertyValue(row, column.prop))
                        "
                      />
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
<script setup lang="ts">
import {
  computed,
  onMounted,
  reactive,
  ref,
} from 'vue'
import SearchFilter from '../filters/SearchFilter.vue'
import SelectFilter from '../filters/SelectFilter.vue'
import moment from 'moment'
import { Skeletor } from 'vue-skeletor'
import 'vue-skeletor/dist/vue-skeletor.css'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia';
import Button from "@zrm/motor-nx-core/components/admin/cell/Button.vue";
import StatusIcon from "@zrm/motor-nx-core/components/admin/cell/StatusIcon.vue";
import EditButton from "@zrm/motor-nx-core/components/admin/cell/EditButton.vue";
import ActionButton from "@zrm/motor-nx-core/components/admin/cell/ActionButton.vue";
import CustomActionButton from "@zrm/motor-nx-core/components/admin/cell/CustomActionButton.vue";
import DeleteButton from "@zrm/motor-nx-core/components/admin/cell/DeleteButton.vue";
import CellTree from "@zrm/motor-nx-core/components/admin/cell/Tree.vue";
import useRouteParser from "@zrm/motor-nx-core/composables/route/parse";
import SpinnerSmall from "@zrm/motor-nx-core/components/admin/partials/SpinnerSmall.vue";
import CheckboxField from "@zrm/motor-nx-core/components/forms/CheckboxField.vue";
import Popover from "@zrm/motor-nx-core/components/admin/cell/Popover.vue";
import { useFilterStore } from "@zrm/motor-nx-core/stores/filter";
import useRolesAndPermissions from "@zrm/motor-nx-core/composables/auth/rolesAndPermissions";
import {PERMISSIONS} from "@zrm/motor-nx-core/types/roles_and_permissions";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { faSitemap } from "@fortawesome/free-solid-svg-icons";

interface GridAction {
  label: string,
  action: string,
  func: () => Promise<null>
}

const components = {
  Popover,
  CheckboxField,
  SearchFilter,
  SelectFilter,
  Button,
  EditButton,
  ActionButton,
  CustomActionButton,
  DeleteButton,
  StatusIcon,
  CellTree,
};
const props = defineProps({
  name: {
    type: String,
    default: 'Grid',
  },
  columns: {
    type: Array<Record<string, object>>,
    default: ref([]),
  },
  rows: {
    type: Array<Record<string, object>>,
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
  withoutCreate: {
    type: Boolean,
    default: false
  },
  hasBackButton: {
    type: Boolean,
    default: false,
  },
  backRoute: {
    type: String,
    default: '',
  },
  withSelection: {
    type: Boolean,
    default: true,
  },
  gridActions: {
    type: Array<GridAction>,
    default: () => [],
  },
    hasTriggerTableActionButton: {
    type: Boolean,
    default: false
  },
    triggerTableActionButtonLabel: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['submit', 'submitCell', 'gridActionProcessed', 'triggerTableAction']);

if (props.loadComponents.length) {
  props.loadComponents.forEach((component) => {
    components[component.name] = component.object;
  })
}

const appStore = useAppStore()
const {loading, updatingInBackground} = storeToRefs(appStore)

const gridStore = useGridStore();
gridStore.init(props.meta);
const router = useRouter();
const route = useRoute();
const filterStore = useFilterStore();

const {selectedItemsLength, selectedPageMap, pageSelected, allSelected} = storeToRefs(gridStore);
const {t} = useI18n()
const filterValues = reactive({per_page: route.query.per_page ? route.query.per_page : 25, page: route.query.page ? route.query.page : 1})

const createRecordRoute = ref(useRouteParser().routeDottedToSlash(props.createRoute))

const goBackRoute = ref(useRouteParser().routeDottedToSlash(props.backRoute))

Object.assign(filterValues, filterStore.getFilterValuesForGrid(route.name));
router.replace({query: filterStore.getFilterValuesForGrid(route.name)})

const sortcol = ref();
const sortasc = ref(true);
const sort = (prop: string) => {
  // Reset sorting completely
  if (sortcol.value !== null && sortasc.value === false) {
    submitFilter( {
      parameter: "sort",
      value: ""
    });
    sortcol.value = null;
    return;
  }
  // Handle sorting
  sortasc.value = sortcol.value == prop ? !sortasc.value : true;
  sortcol.value = prop;
  submitFilter({
    parameter: "sort",
    value: sortcol.value + (sortasc.value ? "" : ":desc"),
  });
};

// Handle sorting
if (filterValues.sort) {
  const tempSort = filterValues.sort.split(':');

  if (tempSort[0]) {
    sortcol.value = tempSort[0];
  }

  if (tempSort[1]) {
    sortasc.value = false;
  }
}

const submitFilter = (data: { parameter: string; value: string }) => {

  if (data instanceof Event) {
    data = ref({
      parameter: 'per-page',
      value: filterValues.perPage
    });
  }
  // Add search filter
  filterValues[data.parameter] = data.value.value;

  // Reset page when filtering or searching
  filterValues.page = 1
  if (data.parameter) {
    filterValues[data.parameter] = data.value
  }

  // Save current filter values
  filterStore.setFilterValuesForGrid(route.name, filterValues);

  router.replace({query: filterStore.getFilterValuesForGrid(route.name)})
  emit('submit', filterValues)
}

const previousPage = () => {
  props.meta.current_page--;
  filterValues.page--
  filterStore.setFilterValuesForGrid(route.name, filterValues);
  router.replace({query: filterStore.getFilterValuesForGrid(route.name)})
  emit('submit', filterValues)
}

const nextPage = () => {
  props.meta.current_page++;
  filterValues.page++
  filterStore.setFilterValuesForGrid(route.name, filterValues);
  router.replace({query: filterStore.getFilterValuesForGrid(route.name)})
  emit('submit', filterValues)
}

const renderer = (
    renderer: {
      type: string
      path: string
      format: string
      property: string
    },
    value: object
): string => {
  switch (renderer.type) {
    case 'translation':
      return t(renderer.path + '.' + value)
    case 'boolean':
      return value ? t('global.yes') : t('global.no');
    case 'array':
      if (!value.length) return '-'
      return value.map((object: Record<string, object>) => {
        if (object.name.length) {
          return ' ' + object.name
        }
        return ' ' + object.label
      })
    case 'date':
      if (!value) {
        return
      }
      if (renderer.format) {
        return moment(value).format(renderer.format)
      }
      return moment(value).toString()
    case 'datetime':
      if (!value) {
        return '-'
      }
      return moment(value).format('DD.MM.YYYY HH:mm')
    case 'count':
      return value.length ? value.length.toString() : 'ß'
    case 'list':
      return value.map((object: object) => {
        return ' ' + object[renderer.property]
      })
    case 'currency':
      return value.toFixed(2) + ' ' + renderer.format
    case 'links':
      if (value && value.length) {
        return value.map((object: Record<string, object>) => {
          return '<a href="' + renderer.route.replace('{id}', object.id).replace('{root_node}', object.root_node) + '">' + object.full_slug + '</a></br>'
        }).join('')
          } else {
        // Return fontawesome icon
        return '-'
      }
    case 'linksWithTree':
      if (value && value.length) {
        const sitemapIconHtml = icon(faSitemap, { styles: { width: '10px', height: '10px' } }).html[0]
        return '<div class="d-flex flex-column">' + value.map((object: Record<string, object>) => {
          const link = '<a href="' + renderer.route.replace('{id}', object.id).replace('{root_node}', object.root_node) + '" class="text-decoration-none">' + object.full_slug + '</a>'
          const treeName = object.root_node_name || ''
          if (treeName) {
            return '<div class="navigation-item-wrapper mb-1 position-relative"><span class="badge bg-gradient-primary d-inline-flex align-items-center navigation-tree-badge" style="font-size: 0.65rem; padding: 0.25rem 0.5rem; position: absolute; bottom: 100%; left: 0; margin-bottom: 0.25rem; opacity: 0; pointer-events: none; transition: opacity 0.2s; z-index: 10; white-space: nowrap;"><span class="me-1 d-inline-flex align-items-center">' + sitemapIconHtml + '</span>' + treeName + '</span>' + link + '</div>'
          }
          return '<div class="mb-1">' + link + '</div>'
        }).join('') + '</div>'
      } else {
        return '-'
      }
    case 'linkLabelId':
      if (value.label) {
        return '<a href="' + renderer.route.replace('{id}', value.id) + '">' + value.label + '</a>'
          } else {
        return '-'
      }
    case 'text':
      if (renderer.textTransform && typeof renderer.textTransform === 'function') {
        return renderer.textTransform(value);
      }
      return value || '';
    default:
      return value
  }
}
const submitCell = (params: object) => {
  emit('submitCell', {
    componentParams: params,
    filterValues,
  })
}

const getPropertyValue = (object: object, property: string): string => {
  property = property.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '') // convert indexes to properties and strip leading dot
  let a = property.split('.')
  for (let i = 0, n = a.length; i < n; ++i) {
    var k = a[i]
    if (object && k in object) {
      object = object[k]
    } else {
      return;
    }
  }
  return object
}

const renderTransformedText = (column: Record<string, object>, row: Record<string, object>): string => {
  const textValue = getPropertyValue(row, column.textProp);

  if (!textValue) {
    return '';
  }

  // If a custom transform function is provided, use it
  if (column.renderer.textTransform && typeof column.renderer.textTransform === 'function') {
    return column.renderer.textTransform(textValue);
  }

  // If it's a date format transformation
  if (column.renderer.textFormat) {
    switch (column.renderer.textFormat.type) {
      case 'date':
        return moment(textValue).format(column.renderer.textFormat.format || 'DD.MM.YYYY HH:mm');
      default:
        return textValue;
    }
  }

  // Return raw text if no transformation specified
  return textValue;
}

// GridActions
const hasGridActions = computed(() => props.gridActions.length)
const gridAction = ref<GridAction>(null);

const firstPage = () => {
  props.meta.current_page = 1;
  filterValues.page = 1;
  filterStore.setFilterValuesForGrid(route.name, filterValues);
  router.replace({query: filterStore.getFilterValuesForGrid(route.name)})
  emit('submit', filterValues)
}
const lastPage = () => {
  props.meta.current_page = props.meta.last_page;
  filterValues.page = props.meta.last_page;
  filterStore.setFilterValuesForGrid(route.name, filterValues);
  router.replace({query: filterStore.getFilterValuesForGrid(route.name)})
  emit('submit', filterValues)
}

const pageOptions = computed(() => Array(props.meta.last_page).fill(1).map((_, i) => i + 1))

const goToPage = () => {
  filterStore.setFilterValuesForGrid(route.name, filterValues);
  router.replace({query: filterStore.getFilterValuesForGrid(route.name)})
  emit('submit', filterValues)
}

const selectPopoverActive = ref(false);
const setPageSelected = () => {
  if (pageSelected.value) {
    props.rows.forEach(row => {
      gridStore.removeSelectedItem(row);
    })
  } else {
    props.rows.forEach(row => {
      if (!gridStore.isSelected(row)) {
        gridStore.addSelectedItem(row);
      }
    })
  }
  selectedPageMap.value.set(props.meta.current_page, !selectedPageMap.value.get(props.meta.current_page));
  selectPopoverActive.value = !selectPopoverActive.value;
}

const setAllSelected = () => {
  if (allSelected.value) {
    gridStore.setSelectedItems([]);
  } else {
    gridStore.setSelectedItems(JSON.parse(JSON.stringify(props.rows)))
  }
  allSelected.value = !allSelected.value;
  selectPopoverActive.value = !selectPopoverActive.value;
}

const deselect = () => {
  gridStore.deselectAll();
  selectPopoverActive.value = !selectPopoverActive.value;
}

watchEffect(() => {
  gridStore.init(props.meta);
})

const {$toast} = useNuxtApp();
const processGridAction = async () => {
  try {
    appStore.isLoading(true)
    await gridAction.value.func();
    $toast.success(t('global.action_processed'))
  } catch (e) {
    console.error("Error occured while processing grid action: " + e)
    $toast.error(t('global.error_occurred'))
  } finally {
    appStore.isLoading(false)
    emit('gridActionProcessed')
  }
}

onMounted(() => {
  gridAction.value = hasGridActions.value ? props.gridActions[0] : null;
});

const rolesAndPermissions = useRolesAndPermissions();
const hasPermissionToRenderComponent = (componentName: string) => {
  let permissionNeeded = route.fullPath.split('/').pop();
  // Replace "-" with "_" in permissionNeeded to match the permission name from the backend
  // e.g. "motor-nx-core.admin.grid" => "motor_nx_core.admin.grid"
  permissionNeeded = permissionNeeded.replace(/-/g, '_');
  switch (componentName) {
    case 'EditButton':
      return rolesAndPermissions.hasPermissionTo(permissionNeeded + '.' + PERMISSIONS.WRITE);
    case 'DeleteButton':
      return rolesAndPermissions.hasPermissionTo(permissionNeeded + '.' + PERMISSIONS.DELETE);
    case 'CreateButton':
      return rolesAndPermissions.hasPermissionTo(permissionNeeded + '.' + PERMISSIONS.WRITE);
    default:
      return true
  }
}
</script>

<style scoped lang="scss">
.pagination {
  gap: 8px;

  .page-item .page-link,
  .page-item span {
    margin: 0;
  }
}
</style>
<style lang="scss">
.navigation-item-wrapper:hover .navigation-tree-badge {
  opacity: 1 !important;
}
</style>
