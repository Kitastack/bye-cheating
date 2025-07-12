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
} from 'naive-ui'
import { useUserStore } from '@/stores/user.store'
import { IconRefresh } from '@tabler/icons-vue'
import { storeToRefs } from 'pinia'
import { getCurrentInstance, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@/composables/api'
import moment from 'moment'
import { useBreakpoint } from '@/composables/breakpoint'

const paginationLimit = 5
const router = useRouter()
const theme = useThemeVars()
const message = useMessage()
const userStore = useUserStore()
const breakpoint = useBreakpoint()
const utils = getCurrentInstance()?.proxy?.$utils
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
    <br />
    <NDivider>
      <NH1>Admin Page</NH1>
    </NDivider>
    <NCard title="Authentication Log" @vue:mounted="onGetAuthentication">
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
                  <td>{{ stateAuthenticationDataItem.id }}</td>
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
                    IP Address
                  </td>
                  <td>{{ stateAuthenticationDataItem.ipAddress ?? '-' }}</td>
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
                <th>IP Address</th>
                <th>Description</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(
                  stateAuthenticationDataItem, stateAuthenticationDataItemIdx
                ) in stateAuthenticationData"
                :key="stateAuthenticationDataItemIdx"
              >
                <td>{{ stateAuthenticationDataItem.id }}</td>
                <td>{{ stateAuthenticationDataItem.user?.name }}</td>
                <td>{{ stateAuthenticationDataItem.ipAddress ?? '-' }}</td>
                <td>{{ stateAuthenticationDataItem.description ?? '-' }}</td>
                <td>
                  {{
                    moment(stateAuthenticationDataItem.createdDate).format('DD MMMM YYYY, HH:mm A')
                  }}
                </td>
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
    <NCard title="User List" @vue:mounted="onGetUser">
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
                  <td>{{ stateUserDataItem.id }}</td>
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
                  <td>{{ stateUserDataItem.roles?.length > 0 ? stateUserDataItem.roles : '-' }}</td>
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
                <td>{{ stateUserDataItem.id }}</td>
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
    <NCard title="Stream List" @vue:mounted="onGetStream">
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
                  <td>{{ stateStreamDataItem.id }}</td>
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
                <td>{{ stateStreamDataItem.id }}</td>
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
    <NCard title="Live List" @vue:mounted="onGetLive">
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
                  <td>{{ stateLiveDataItem.id }}</td>
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
                <td>{{ stateLiveDataItem.id }}</td>
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
    <NCard title="Report List" @vue:mounted="onGetReport">
      <template #header-extra
        ><NButton @click="onGetReport"
          >Refresh<template #icon><IconRefresh /></template></NButton
      ></template>
      <NSpin :show="reportSectionLoadingRef">
        <template #description> Loading... </template>
        <section v-if="stateReportData && stateReportData?.length > 0">
          <div
            v-if="breakpoint.mdAndDown"
            v-for="(stateReportDataItem, stateReportDataItemIdx) in stateReportData"
            :key="stateReportDataItemIdx"
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
                  <td>{{ stateReportDataItem.id }}</td>
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
                v-for="(stateReportDataItem, stateReportDataItemIdx) in stateReportData"
                :key="stateReportDataItemIdx"
              >
                <td>{{ stateReportDataItem.id }}</td>
                <td>{{ stateReportDataItem.expiryTimeInMinutes }}</td>
                <td>{{ stateReportDataItem.user?.name ?? '-' }}</td>
                <td>{{ moment(stateReportDataItem.createdDate).format('DD MMMM YYYY') }}</td>
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
  </NSpace>
</template>
