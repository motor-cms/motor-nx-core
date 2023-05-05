<template>
  <AdminPartialsSpinner v-if="loading" />
  <div v-if="!loading && !attemptLoginFromStorage">
    <section>
      <div class="page-header section-height-75">
        <div class="container">
          <div class="row">
            <div class="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
              <div class="card card-plain mt-8">
                <div class="card-header pb-0 text-left bg-transparent">
                  <div class="d-flex justify-content-center align-items-center">
                    <img
                      src="~/assets/images/logo.png"
                      class="navbar-brand-img"
                      :alt="$t('global.logo.alt')"
                    />
                  </div>
                  <h3 v-if="showProjectName" class="font-weight-bolder text-info text-gradient">
                    {{ $t('global.project') }}
                  </h3>
                </div>
                <div class="card-body">
                  <form role="form text-left">
                    <label>Email</label>
                    <div class="mb-3">
                      <input
                          v-model="login.email"
                          type="email"
                          class="form-control"
                          placeholder="Email"
                          aria-label="Email"
                          aria-describedby="email-addon"
                      />
                    </div>
                    <label>Password</label>
                    <div class="mb-3">
                      <input
                          v-model="login.password"
                          type="password"
                          class="form-control"
                          placeholder="Password"
                          aria-label="Password"
                          aria-describedby="password-addon"
                      />
                    </div>
<!--                    <div class="form-check form-switch">-->
<!--                      <input-->
<!--                          v-model="login.remember"-->
<!--                          class="form-check-input"-->
<!--                          type="checkbox"-->
<!--                          id="rememberMe"-->
<!--                          checked=""-->
<!--                      />-->
<!--                      <label class="form-check-label" for="rememberMe"-->
<!--                      >Remember me</label-->
<!--                      >-->
<!--                    </div>-->
                    <div class="text-center">
                      <button
                          @click="userStore.signIn(login)"
                          type="button"
                          class="btn bg-gradient-primary text-capitalize w-100 mt-4 mb-0"
                      >
                        {{ $t('global.sign_in') }}
                      </button>
                    </div>
                    <div
                        v-if="signInError"
                        class="alert alert-danger text-white mt-1"
                        role="alert"
                    >
                      <strong>Error!</strong> {{ signInError }}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/user'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../../store/app'
const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore();
const { loading } = storeToRefs(appStore)
const { authenticated, signInError } = storeToRefs(userStore)
const attemptLoginFromStorage = ref(true);
let login = ref({
  email: '',
  password: '',
  remember: false,
})

const runtimeConfig = useRuntimeConfig();
const showProjectName = computed(() => runtimeConfig.public.showProjectName);

onMounted(async () => {
  if (!authenticated.value) {
    const loginSuccess = await userStore.loginFromStorage();
    if (!loginSuccess) {
      attemptLoginFromStorage.value =false;
      await router.push('/');
    }
  }
  attemptLoginFromStorage.value =false;
})
</script>
