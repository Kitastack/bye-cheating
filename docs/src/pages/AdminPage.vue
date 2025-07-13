<script setup lang="ts">
import {
  NText,
  NCard,
  NButton,
  NSpace,
  NH1,
  useThemeVars,
  NDivider,
  NTable,
  useMessage,
  NEmpty,
  NSpin,
  NPagination,
  NEllipsis,
  NTag,
  NTabs,
  NTabPane,
  NScrollbar,
  NTab,
  NCollapseTransition,
  NForm,
  NFormItem,
  NInput,
  NImage,
  NFlex,
} from 'naive-ui'
import { getCurrentInstance, nextTick, onMounted, reactive, ref } from 'vue'
import { IconArrowUpRight, IconPhotoX, IconRefresh } from '@tabler/icons-vue'
import { useBreakpoint } from '@/composables/breakpoint'
import { useUserStore } from '@/stores/user.store'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@/composables/api'
import { storeToRefs } from 'pinia'
import ReportDetailDrawer from '@/features/ReportDetailDrawer.vue'
import moment from 'moment'
import { useCustomLoading } from '@/composables/loading'
import useVuelidate from '@vuelidate/core'
import { email, helpers, minLength, required } from '@vuelidate/validators'

const paginationLimit = 5
const router = useRouter()
const theme = useThemeVars()
const message = useMessage()
const userStore = useUserStore()
const breakpoint = useBreakpoint()
const loading = useCustomLoading()
const utils = getCurrentInstance()?.proxy?.$utils
const tabList = ['Authentication', 'User', 'Stream', 'Live', 'Report', 'System'] as const
type tabType = (typeof tabList)[number]
const currentTab = ref<tabType>('Authentication')
const currentOpenedReportDetailRef = ref<reportDataType | null>(null)
const { userSigninData, userFullData } = storeToRefs(userStore)
const stateAuthenticationPagination = ref<number>(1)
const stateAuthenticationTotalData = ref<number>(0)
const stateAuthenticationData = ref<authenticationDataType[] | null>(null)
const authenticationSectionLoadingRef = ref<boolean>(false)
const stateUserPagination = ref<number>(1)
const stateUserTotalData = ref<number>(0)
const stateUserData = ref<userDataType[] | null>(null)
const userSectionLoadingRef = ref<boolean>(false)
const stateStreamPagination = ref<number>(1)
const stateStreamTotalData = ref<number>(0)
const stateStreamData = ref<streamDataType[] | null>(null)
const streamSectionLoadingRef = ref<boolean>(false)
const stateLivePagination = ref<number>(1)
const stateLiveTotalData = ref<number>(0)
const stateLiveData = ref<liveDataType[] | null>(null)
const liveSectionLoadingRef = ref<boolean>(false)
const stateReportPagination = ref<number>(1)
const stateReportTotalData = ref<number>(0)
const stateReportData = ref<reportDataType[] | null>(null)
const reportSectionLoadingRef = ref<boolean>(false)
const stateSignup = reactive<{
  name: string | null
  email: string | null
  password: string | null
}>({
  name: null,
  email: null,
  password: null,
})

const formSignup = useVuelidate(
  {
    name: {
      required: helpers.withMessage(() => `Please fill the field`, required),
    },
    email: {
      required: helpers.withMessage(() => `Please fill the field`, required),
      email: helpers.withMessage(() => `Email tidak valid`, email),
    },
    password: {
      required: helpers.withMessage(() => `Please fill the field`, required),
      minLength: helpers.withMessage(() => `8 chars minimum`, minLength(8)),
    },
  },
  stateSignup,
)

async function onGetAuthentication() {
  try {
    authenticationSectionLoadingRef.value = true
    const response = await useApi('/user').api.get('/authentication', {
      params: {
        orderBy: [
          {
            createdDate: 'desc',
          },
        ],
        page: stateAuthenticationPagination.value,
        limit: paginationLimit,
      },
    })
    if (response.data.result) {
      stateAuthenticationData.value = response.data.result
      stateAuthenticationTotalData.value = response.data?.count
    }
  } catch (error: any) {
    message.error(`${error?.data?.message ?? error?.message ?? error}`)
  } finally {
    authenticationSectionLoadingRef.value = false
  }
}
async function onGetUser() {
  try {
    userSectionLoadingRef.value = true
    const response = await useApi('/user').api.get('/list', {
      params: {
        orderBy: [
          {
            createdDate: 'desc',
          },
        ],
        page: stateUserPagination.value,
        limit: paginationLimit,
      },
    })
    if (response.data.result) {
      stateUserData.value = response.data.result
      stateUserTotalData.value = response.data?.count
    }
  } catch (error: any) {
    message.error(`${error?.data?.message ?? error?.message ?? error}`)
  } finally {
    userSectionLoadingRef.value = false
  }
}
async function onGetStream() {
  try {
    streamSectionLoadingRef.value = true
    const response = await useApi('/stream').api.get('/', {
      params: {
        withUser: true,
        orderBy: [
          {
            createdDate: 'desc',
          },
        ],
        page: stateStreamPagination.value,
        limit: paginationLimit,
      },
    })
    if (response.data.result) {
      stateStreamData.value = response.data.result
      stateStreamTotalData.value = response.data?.count
    }
  } catch (error: any) {
    message.error(`${error?.data?.message ?? error?.message ?? error}`)
  } finally {
    streamSectionLoadingRef.value = false
  }
}
async function onGetLive() {
  try {
    liveSectionLoadingRef.value = true
    const response = await useApi('/live').api.get('/', {
      params: {
        withUser: true,
        orderBy: [
          {
            createdDate: 'desc',
          },
        ],
        page: stateLivePagination.value,
        limit: paginationLimit,
      },
    })
    if (response.data.result) {
      stateLiveData.value = response.data.result?.map((item: any) => {
        if (item.expiryTimeInMinutes) {
          item.expiryTimeInMinutes = utils?.secondsToClock(
            Math.round(
              Math.abs(
                new Date(item?.createdDate).getTime() - Number(item.expiryTimeInMinutes * 1000),
              ) / 1000,
            ),
          )
        }
        return item
      })
      stateLiveTotalData.value = response.data?.count
    }
  } catch (error: any) {
    message.error(`${error?.data?.message ?? error?.message ?? error}`)
  } finally {
    liveSectionLoadingRef.value = false
  }
}
async function onGetReport() {
  try {
    reportSectionLoadingRef.value = true
    const response = await useApi('/report').api.get('/', {
      params: {
        withUser: true,
        orderBy: [
          {
            createdDate: 'desc',
          },
        ],
        page: stateReportPagination.value,
        limit: paginationLimit,
      },
    })
    console.log(response.data)
    if (response.data.result) {
      stateReportData.value = response.data.result?.map((item: any) => {
        if (item.expiryTimeInMinutes) {
          item.expiryTimeInMinutes = utils?.secondsToClock(
            Math.round(
              Math.abs(
                new Date(item?.createdDate).getTime() - Number(item.expiryTimeInMinutes * 1000),
              ) / 1000,
            ),
          )
        }
        return item
      })
      stateReportTotalData.value = response.data?.count
    }
  } catch (error: any) {
    message.error(`${error?.data?.message ?? error?.message ?? error}`)
  } finally {
    reportSectionLoadingRef.value = false
  }
}
async function onSubmitSignup() {
  try {
    loading.start()
    if (!(await formSignup.value.$validate()) && !(await formSignup.value.$validate())) {
      throw new Error('Please fill email, password and name fields')
    }
    const body = JSON.parse(JSON.stringify(stateSignup))
    await userStore.userPostApi('/signup', body)
    message.success(`user ${body.email} success created`)
    formSignup.value.$reset()
    await onGetUser()
  } catch (error: any) {
    loading.error()
    message.error(`${error?.data?.message ?? error?.message ?? error}`)
  } finally {
    loading.finish()
  }
}
function isTimestampMoreThanSeconds(fromDate: Date, secondsLimit: number): boolean {
  const totalSeconds = Math.round(Math.abs(fromDate.getTime() - new Date().getTime()) / 1000)
  if (totalSeconds > secondsLimit) {
    return true
  } else {
    return false
  }
}

onMounted(() => {
  userStore.loadSigninAction().finally(() => {
    if (
      !userSigninData.value ||
      !userFullData.value ||
      !userSigninData.value?.roles?.includes('Admin')
    ) {
      router.push('/')
    }
  })
})
</script>
<template>
  <NSpace vertical size="large">
    <NDivider>
      <NH1>Admin Page</NH1>
    </NDivider>
    <NScrollbar x-scrollable>
      <NTabs
        animated
        type="segment"
        v-model:value="currentTab"
        :tab-style="{
          padding: '1.5rem !important',
        }"
      >
        <NTab :name="String('Authentication' as tabType)">
          <NText>{{ String('Authentication' as tabType) }}</NText>
        </NTab>
        <NTab :name="String('User' as tabType)">
          <NText>{{ String('User' as tabType) }}</NText>
        </NTab>
        <NTab :name="String('Stream' as tabType)">
          <NText>{{ String('Stream' as tabType) }}</NText>
        </NTab>
        <NTab :name="String('Live' as tabType)">
          <NText>{{ String('Live' as tabType) }}</NText>
        </NTab>
        <NTab :name="String('Report' as tabType)">
          <NText>{{ String('Report' as tabType) }}</NText>
        </NTab>
      </NTabs>
    </NScrollbar>
    <section v-if="currentTab == 'Authentication'">
      <NCard title="List" @vue:mounted="onGetAuthentication">
        <template #header-extra
          ><NButton @click="onGetAuthentication"
            >Refresh<template #icon><IconRefresh /></template></NButton
        ></template>
        <NSpin :show="authenticationSectionLoadingRef">
          <template #description> Loading... </template>
          <section v-if="stateAuthenticationData && stateAuthenticationData?.length > 0">
            <div
              v-if="breakpoint.mdAndDown"
              v-for="(
                stateAuthenticationDataItem, stateAuthenticationDataItemIdx
              ) in stateAuthenticationData"
              :key="stateAuthenticationDataItemIdx"
            >
              <NTable :single-line="true">
                <tbody>
                  <tr>
                    <td
                      :style="{
                        background: theme.actionColor,
                      }"
                    >
                      Identifier (ID)
                    </td>
                    <td>
                      <NEllipsis style="max-width: 150px">{{
                        stateAuthenticationDataItem.id
                      }}</NEllipsis>
                    </td>
                  </tr>
                  <tr>
                    <td
                      :style="{
                        background: theme.actionColor,
                      }"
                    >
                      User
                    </td>
                    <td>{{ stateAuthenticationDataItem.user?.name }}</td>
                  </tr>
                  <tr>
                    <td
                      :style="{
                        background: theme.actionColor,
                      }"
                    >
                      Status
                    </td>
                    <td>
                      {{
                        stateAuthenticationDataItem.updatedDate &&
                        !isTimestampMoreThanSeconds(
                          new Date(stateAuthenticationDataItem.updatedDate),
                          7 * 60,
                        )
                          ? !isTimestampMoreThanSeconds(
                              new Date(stateAuthenticationDataItem.updatedDate),
                              5 * 60,
                            )
                            ? 'Online'
                            : 'Idle'
                          : 'Offline'
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      :style="{
                        background: theme.actionColor,
                      }"
                    >
                      IP Address
                    </td>

                    <td>
                      <NEllipsis style="max-width: 150px">{{
                        stateAuthenticationDataItem.ipAddress ?? '-'
                      }}</NEllipsis>
                    </td>
                  </tr>
                  <tr>
                    <td
                      :style="{
                        background: theme.actionColor,
                      }"
                    >
                      Description
                    </td>
                    <td>{{ stateAuthenticationDataItem.description ?? '-' }}</td>
                  </tr>
                  <tr>
                    <td
                      :style="{
                        background: theme.actionColor,
                      }"
                    >
                      Created At
                    </td>
                    <td>
                      {{
                        moment(stateAuthenticationDataItem.createdDate).format(
                          'DD MMMM YYYY, HH:mm A',
                        )
                      }}
                    </td>
                  </tr>
                </tbody>
              </NTable>
              <br />
            </div>
            <NTable v-else:single-line="true">
              <thead>
                <tr>
                  <th>Identifier (ID)</th>
                  <th>User</th>
                  <th>Status</th>
                  <th>IP Address</th>
                  <th>Description</th>
                  <th>Created At</th>
                  <!-- <th>Updated At</th> -->
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(
                    stateAuthenticationDataItem, stateAuthenticationDataItemIdx
                  ) in stateAuthenticationData"
                  :key="stateAuthenticationDataItemIdx"
                >
                  <td>
                    <NEllipsis style="max-width: 150px">{{
                      stateAuthenticationDataItem.id
                    }}</NEllipsis>
                  </td>
                  {{}}
                  <td>{{ stateAuthenticationDataItem.user?.name }}</td>
                  <td>
                    {{
                      stateAuthenticationDataItem.id == userSigninData?.authenticationId ||
                      (stateAuthenticationDataItem.updatedDate &&
                        !isTimestampMoreThanSeconds(
                          new Date(stateAuthenticationDataItem.updatedDate),
                          7 * 60,
                        ))
                        ? stateAuthenticationDataItem.updatedDate &&
                          !isTimestampMoreThanSeconds(
                            new Date(stateAuthenticationDataItem.updatedDate),
                            5 * 60,
                          )
                          ? 'Online'
                          : 'Idle'
                        : 'Offline'
                    }}
                  </td>
                  <td>
                    <NEllipsis style="max-width: 150px">{{
                      stateAuthenticationDataItem.ipAddress ?? '-'
                    }}</NEllipsis>
                  </td>
                  <td>{{ stateAuthenticationDataItem.description ?? '-' }}</td>
                  <td>
                    {{
                      moment(stateAuthenticationDataItem.createdDate).format(
                        'DD MMMM YYYY, HH:mm A',
                      )
                    }}
                  </td>
                  <!-- <td>
                    {{
                      stateAuthenticationDataItem.updatedDate
                        ? moment(stateAuthenticationDataItem.updatedDate).format(
                            'DD MMMM YYYY, HH:mm A',
                          )
                        : '-'
                    }}
                  </td> -->
                </tr>
              </tbody>
            </NTable>
          </section>
          <NEmpty v-else description="No one sign in currently" />
          <br />
          <NPagination
            @update:page="
              () => {
                nextTick(onGetAuthentication)
              }
            "
            v-model:page="stateAuthenticationPagination"
            :page-count="Math.ceil(stateAuthenticationTotalData / paginationLimit)"
          />
        </NSpin>
      </NCard>
    </section>
    <section v-if="currentTab == 'User'">
      <NCard title="Register a user">
        <NForm @submit.prevent="onSubmitSignup">
          <NSpace vertical space="large">
            <NFormItem
              path="name"
              :feedback="formSignup.name.$errors.map(($error) => $error.$message).toString()"
            >
              <template #label>
                <strong> Name </strong>
              </template>
              <NInput
                type="text"
                v-model:value="stateSignup.name"
                :loading="loading.isLoading.value"
                :disabled="loading.isLoading.value"
                placeholder="ex: Dinta Wonderwaal"
              />
            </NFormItem>
            <NFormItem
              path="email"
              :feedback="formSignup.email.$errors.map(($error) => $error.$message).toString()"
            >
              <template #label>
                <strong> Email </strong>
              </template>
              <NInput
                type="text"
                v-model:value="stateSignup.email"
                placeholder="ex: email@website.com"
                :loading="loading.isLoading.value"
              />
            </NFormItem>
            <NFormItem
              path="password"
              :feedback="formSignup.password.$errors.map(($error) => $error.$message).toString()"
            >
              <template #label>
                <strong> Password </strong>
              </template>
              <NInput
                type="password"
                show-password-on="mousedown"
                :loading="loading.isLoading.value"
                :disabled="loading.isLoading.value"
                v-model:value="stateSignup.password"
                placeholder="8 digit alphanumeric with 1 symbol"
              />
            </NFormItem>
            <NButton
              attr-type="submit"
              type="primary"
              style="width: 100%"
              :loading="loading.isLoading.value"
              :disabled="loading.isLoading.value"
              >Sign up</NButton
            >
          </NSpace>
        </NForm>
      </NCard>
      <br />
      <NCard title="List" @vue:mounted="onGetUser">
        <template #header-extra
          ><NButton @click="onGetUser"
            >Refresh<template #icon><IconRefresh /></template></NButton
        ></template>
        <NSpin :show="userSectionLoadingRef">
          <template #description> Loading... </template>
          <section v-if="stateUserData && stateUserData?.length > 0">
            <div
              v-if="breakpoint.mdAndDown"
              v-for="(stateUserDataItem, stateUserDataItemIdx) in stateUserData"
              :key="stateUserDataItemIdx"
            >
              <NTable :single-line="true">
                <tbody>
                  <tr>
                    <td
                      :style="{
                        background: theme.actionColor,
                      }"
                    >
                      Identifier (ID)
                    </td>
                    <td>
                      <NEllipsis style="max-width: 150px">{{ stateUserDataItem.id }}</NEllipsis>
                    </td>
                  </tr>
                  <tr>
                    <td
                      :style="{
                        background: theme.actionColor,
                      }"
                    >
                      Name
                    </td>
                    <td>{{ stateUserDataItem.name }}</td>
                  </tr>
                  <tr>
                    <td
                      :style="{
                        background: theme.actionColor,
                      }"
                    >
                      Email
                    </td>
                    <td>{{ stateUserDataItem.email }}</td>
                  </tr>
                  <tr>
                    <td
                      :style="{
                        background: theme.actionColor,
                      }"
                    >
                      Roles
                    </td>
                    <td>
                      {{ stateUserDataItem.roles?.length > 0 ? stateUserDataItem.roles : '-' }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      :style="{
                        background: theme.actionColor,
                      }"
                    >
                      Created Date
                    </td>
                    <td>{{ moment(stateUserDataItem.createdDate).format('DD MMMM YYYY') }}</td>
                  </tr>
                </tbody>
              </NTable>
              <br />
            </div>
            <NTable v-else:single-line="true">
              <thead>
                <tr>
                  <th>Identifier (ID)</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Roles</th>
                  <th>Created Date</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(stateUserDataItem, stateUserDataItemIdx) in stateUserData"
                  :key="stateUserDataItemIdx"
                >
                  <td>
                    <NEllipsis style="max-width: 150px">{{ stateUserDataItem.id }}</NEllipsis>
                  </td>
                  <td>{{ stateUserDataItem.name }}</td>
                  <td>{{ stateUserDataItem.email }}</td>
                  <td>{{ stateUserDataItem.roles?.length > 0 ? stateUserDataItem.roles : '-' }}</td>
                  <td>{{ moment(stateUserDataItem.createdDate).format('DD MMMM YYYY') }}</td>
                </tr>
              </tbody>
            </NTable>
          </section>
          <NEmpty v-else description="Users not found" />
        </NSpin>
        <br />
        <NPagination
          @update:page="
            () => {
              nextTick(onGetUser)
            }
          "
          v-model:page="stateUserPagination"
          :page-count="Math.ceil(stateUserPagination / paginationLimit)"
        />
      </NCard>
    </section>
    <section v-if="currentTab == 'Stream'">
      <NCard title="List" @vue:mounted="onGetStream">
        <template #header-extra
          ><NButton @click="onGetStream"
            >Refresh<template #icon><IconRefresh /></template></NButton
        ></template>
        <NSpin :show="streamSectionLoadingRef">
          <template #description> Loading... </template>
          <section v-if="stateStreamData && stateStreamData?.length > 0">
            <div
              v-if="breakpoint.mdAndDown"
              v-for="(stateStreamDataItem, stateStreamDataItemIdx) in stateStreamData"
              :key="stateStreamDataItemIdx"
            >
              <NTable :single-line="true">
                <tbody>
                  <tr>
                    <td
                      :style="{
                        background: theme.actionColor,
                      }"
                    >
                      Identifier (ID)
                    </td>
                    <td>
                      <NEllipsis style="max-width: 150px">{{ stateStreamDataItem.id }}</NEllipsis>
                    </td>
                  </tr>
                  <tr>
                    <td
                      :style="{
                        background: theme.actionColor,
                      }"
                    >
                      URL
                    </td>
                    <td>{{ stateStreamDataItem.url }}</td>
                  </tr>
                  <tr>
                    <td
                      :style="{
                        background: theme.actionColor,
                      }"
                    >
                      User
                    </td>
                    <td>{{ stateStreamDataItem.user?.name }}</td>
                  </tr>
                  <tr>
                    <td
                      :style="{
                        background: theme.actionColor,
                      }"
                    >
                      Created Date
                    </td>
                    <td>{{ moment(stateStreamDataItem.createdDate).format('DD MMMM YYYY') }}</td>
                  </tr>
                </tbody>
              </NTable>
              <br />
            </div>
            <NTable v-else:single-line="true">
              <thead>
                <tr>
                  <th>Identifier (ID)</th>
                  <th>URL</th>
                  <th>User</th>
                  <th>Created Date</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(stateStreamDataItem, stateStreamDataItemIdx) in stateStreamData"
                  :key="stateStreamDataItemIdx"
                >
                  <td>
                    <NEllipsis style="max-width: 150px">{{ stateStreamDataItem.id }}</NEllipsis>
                  </td>
                  <td>{{ stateStreamDataItem.url }}</td>
                  <td>{{ stateStreamDataItem.user?.name ?? '-' }}</td>
                  <td>{{ moment(stateStreamDataItem.createdDate).format('DD MMMM YYYY') }}</td>
                </tr>
              </tbody>
            </NTable>
          </section>
          <NEmpty v-else description="Stream not found" />
          <br />
          <NPagination
            @update:page="
              () => {
                nextTick(onGetStream)
              }
            "
            v-model:page="stateStreamPagination"
            :page-count="Math.ceil(stateStreamTotalData / paginationLimit)"
          />
        </NSpin>
      </NCard>
    </section>
    <section v-if="currentTab == 'Live'">
      <NCard title="List" @vue:mounted="onGetLive">
        <template #header-extra
          ><NButton @click="onGetLive"
            >Refresh<template #icon><IconRefresh /></template></NButton
        ></template>
        <NSpin :show="liveSectionLoadingRef">
          <template #description> Loading... </template>
          <section v-if="stateLiveData && stateLiveData?.length > 0">
            <div
              v-if="breakpoint.mdAndDown"
              v-for="(stateLiveDataItem, stateLiveDataItemIdx) in stateLiveData"
              :key="stateLiveDataItemIdx"
            >
              <NTable :single-line="true">
                <tbody>
                  <tr>
                    <td
                      :style="{
                        background: theme.actionColor,
                      }"
                    >
                      Identifier (ID)
                    </td>
                    <td>
                      <NEllipsis style="max-width: 150px">{{ stateLiveDataItem.id }}</NEllipsis>
                    </td>
                  </tr>
                  <tr>
                    <td
                      :style="{
                        background: theme.actionColor,
                      }"
                    >
                      Duration
                    </td>
                    <td>{{ stateLiveDataItem.expiryTimeInMinutes }}</td>
                  </tr>
                  <tr>
                    <td
                      :style="{
                        background: theme.actionColor,
                      }"
                    >
                      User
                    </td>
                    <td>{{ stateLiveDataItem.user?.name }}</td>
                  </tr>
                  <tr>
                    <td
                      :style="{
                        background: theme.actionColor,
                      }"
                    >
                      Created Date
                    </td>
                    <td>{{ moment(stateLiveDataItem.createdDate).format('DD MMMM YYYY') }}</td>
                  </tr>
                </tbody>
              </NTable>
              <br />
            </div>
            <NTable v-else:single-line="true">
              <thead>
                <tr>
                  <th>Identifier (ID)</th>
                  <th>Duration</th>
                  <th>User</th>
                  <th>Created Date</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(stateLiveDataItem, stateLiveDataItemIdx) in stateLiveData"
                  :key="stateLiveDataItemIdx"
                >
                  <td>
                    <NEllipsis style="max-width: 150px">{{ stateLiveDataItem.id }}</NEllipsis>
                  </td>
                  <td>{{ stateLiveDataItem.expiryTimeInMinutes }}</td>
                  <td>{{ stateLiveDataItem.user?.name ?? '-' }}</td>
                  <td>{{ moment(stateLiveDataItem.createdDate).format('DD MMMM YYYY') }}</td>
                </tr>
              </tbody>
            </NTable>
          </section>
          <NEmpty v-else description="Live not found" />
          <br />
          <NPagination
            @update:page="
              () => {
                nextTick(onGetLive)
              }
            "
            v-model:page="stateLivePagination"
            :page-count="Math.ceil(stateLiveTotalData / paginationLimit)"
          />
        </NSpin>
      </NCard>
    </section>
    <section v-if="currentTab == 'Report'">
      <NCard title="List" @vue:mounted="onGetReport">
        <template #header-extra
          ><NButton @click="onGetReport"
            >Refresh<template #icon><IconRefresh /></template></NButton
        ></template>
        <ReportDetailDrawer
          :data="currentOpenedReportDetailRef ?? undefined"
          @closed="currentOpenedReportDetailRef = null"
        />
        <NSpin :show="reportSectionLoadingRef">
          <template #description> Loading... </template>
          <section v-if="stateReportData && stateReportData?.length > 0">
            <div
              v-if="breakpoint.mdAndDown"
              v-for="(stateReportDataItem, stateReportDataItemIdx) in stateReportData"
              :key="stateReportDataItemIdx"
            >
              <NImage
                :src="stateReportDataItem.thumbnailUrl ?? 'foo'"
                width="100%"
                object-fit="cover"
                style="
                  width: 100%;
                  background: black;
                  border-radius: 15px;
                  overflow: hidden;
                  margin-bottom: 5px;
                "
              >
                <template #error>
                  <NFlex align="center" justify="center" style="width: 100%; height: 150px">
                    <IconPhotoX />
                  </NFlex> </template
              ></NImage>
              <NTable :single-line="true">
                <tbody>
                  <tr>
                    <td
                      :style="{
                        background: theme.actionColor,
                      }"
                    >
                      Identifier (ID)
                    </td>
                    <td>
                      <NEllipsis style="max-width: 150px">{{ stateReportDataItem.id }}</NEllipsis>
                    </td>
                  </tr>
                  <tr>
                    <td
                      :style="{
                        background: theme.actionColor,
                      }"
                    >
                      Status
                    </td>
                    <td>
                      <NTag
                        :type="
                          stateReportDataItem.status == 'error'
                            ? 'error'
                            : stateReportDataItem.status == 'finished'
                              ? 'success'
                              : 'warning'
                        "
                        style="text-transform: capitalize"
                        >{{ stateReportDataItem.status }}</NTag
                      >
                    </td>
                  </tr>
                  <tr>
                    <td
                      :style="{
                        background: theme.actionColor,
                      }"
                    >
                      Duration
                    </td>
                    <td>{{ stateReportDataItem.expiryTimeInMinutes }}</td>
                  </tr>
                  <tr>
                    <td
                      :style="{
                        background: theme.actionColor,
                      }"
                    >
                      User
                    </td>
                    <td>{{ stateReportDataItem.user?.name }}</td>
                  </tr>
                  <tr>
                    <td
                      :style="{
                        background: theme.actionColor,
                      }"
                    >
                      Created Date
                    </td>
                    <td>{{ moment(stateReportDataItem.createdDate).format('DD MMMM YYYY') }}</td>
                  </tr>
                  <tr>
                    <td>
                      <NButton
                        :disabled="stateReportDataItem.status == 'error'"
                        icon-placement="right"
                        @click="currentOpenedReportDetailRef = stateReportDataItem"
                        >Detail <template #icon><IconArrowUpRight /></template
                      ></NButton>
                    </td>
                  </tr>
                </tbody>
              </NTable>
              <br />
            </div>
            <NTable v-else:single-line="true">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Identifier (ID)</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>User</th>
                  <th>Created Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(stateReportDataItem, stateReportDataItemIdx) in stateReportData"
                  :key="stateReportDataItemIdx"
                >
                  <td>
                    <NImage
                      :src="stateReportDataItem.thumbnailUrl ?? 'foo'"
                      :width="100"
                      :height="75"
                      object-fit="cover"
                      style="background: black; border-radius: 15px"
                    >
                      <template #error>
                        <NFlex align="center" justify="center" style="width: 100px; height: 75px">
                          <IconPhotoX />
                        </NFlex> </template
                    ></NImage>
                  </td>
                  <td>
                    <NEllipsis style="max-width: 150px">{{ stateReportDataItem.id }}</NEllipsis>
                  </td>
                  <td>
                    <NTag
                      :type="
                        stateReportDataItem.status == 'error'
                          ? 'error'
                          : stateReportDataItem.status == 'finished'
                            ? 'success'
                            : 'warning'
                      "
                      style="text-transform: capitalize"
                      >{{ stateReportDataItem.status }}</NTag
                    >
                  </td>
                  <td>{{ stateReportDataItem.expiryTimeInMinutes }}</td>
                  <td>{{ stateReportDataItem.user?.name ?? '-' }}</td>
                  <td>{{ moment(stateReportDataItem.createdDate).format('DD MMMM YYYY') }}</td>
                  <td>
                    <NButton
                      icon-placement="right"
                      :disabled="stateReportDataItem.status == 'error'"
                      @click="currentOpenedReportDetailRef = stateReportDataItem"
                      >Detail <template #icon><IconArrowUpRight /></template
                    ></NButton>
                  </td>
                </tr>
              </tbody>
            </NTable>
          </section>
          <NEmpty v-else description="Report not found" />
          <br />
          <NPagination
            @update:page="
              () => {
                nextTick(onGetReport)
              }
            "
            v-model:page="stateReportPagination"
            :page-count="Math.ceil(stateReportTotalData / paginationLimit)"
          />
        </NSpin>
      </NCard>
    </section>
  </NSpace>
</template>
