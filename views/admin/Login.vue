<template>
  <div>
    <section>
      <div class="page-header section-height-75">
        <div class="container">
          <div class="row">
            <div class="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
              <div class="card card-plain mt-8">
                <div class="card-header pb-0 text-left bg-transparent">
                  <h3 class="font-weight-bolder text-info text-gradient">
                    {{ $t('global.project') }}
                  </h3>
                  <p class="mb-0">Enter your email and password to sign in</p>
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
                    <div class="form-check form-switch">
                      <input
                        v-model="login.remember"
                        class="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                        checked=""
                      />
                      <label class="form-check-label" for="rememberMe"
                        >Remember me</label
                      >
                    </div>
                    <div class="text-center">
                      <button
                        @click="signIn(login)"
                        type="button"
                        class="btn bg-gradient-info w-100 mt-4 mb-0"
                      >
                        Sign in
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
<script lang="ts">
import { computed, defineComponent, watch } from 'vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/user';
import { storeToRefs } from 'pinia';

export default defineComponent({
  name: 'admin.login',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const { authenticated, signInError } = storeToRefs(userStore)

    let login = ref({
      email: '',
      password: '',
      remember: false,
    })


    if (authenticated.value) {
      router.push({ name: 'admin.dashboard' })
    }

    watch(authenticated, (newValue) => {
      if (newValue) {
        router.push({ name: 'admin.dashboard' })
      }
      console.log(newValue)
    })

    watch(signInError, (newValue) => {
      console.log("hier", newValue)
    })

    return { ...userStore, signInError, login }
  },
})
</script>
