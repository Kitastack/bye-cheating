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
} from 'naive-ui'
import { useUserStore } from '@/stores/user.store'
import { IconRefresh } from '@tabler/icons-vue'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@/composables/api'
import moment from 'moment'
import { useBreakpoint } from '@/composables/breakpoint'

const router = useRouter()
const userStore = useUserStore()
const theme = useThemeVars()
const message = useMessage()
const breakpoint = useBreakpoint()
const { userSigninData } = storeToRefs(userStore)
const stateReportData = ref<reportDataType[] | null>(null)
const reportSectionLoadingRef = ref<boolean>(false)
const stateUserData = ref<userDataType[] | null>(null)
const userSectionLoadingRef = ref<boolean>(false)

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
      },
    })
    if (response.data.result) {
      stateUserData.value = response.data.result
    }
  } catch (error: any) {
    message.error(`${error?.data?.message ?? error?.message ?? error}`)
  } finally {
    userSectionLoadingRef.value = false
  }
}

async function onGetReport() {
  try {
    reportSectionLoadingRef.value = true
    const response = await useApi('/report').api.get('/', {
      params: {
        orderBy: [
          {
            createdDate: 'desc',
          },
        ],
      },
    })
    if (response.data.result) {
      stateReportData.value = response.data.result
    }
  } catch (error: any) {
    message.error(`${error?.data?.message ?? error?.message ?? error}`)
  } finally {
    reportSectionLoadingRef.value = false
  }
}

onMounted(() => {
  userStore.loadSigninAction().finally(() => {
    if (!userSigninData || !userSigninData.value?.roles?.includes('Admin')) {
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
    <NCard title="Authentication Log">
      <template #header-extra
        ><NButton
          >Refresh<template #icon><IconRefresh /></template></NButton
      ></template>
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
    </NCard>
    <NCard title="Stream List">
      <template #header-extra
        ><NButton
          >Refresh<template #icon><IconRefresh /></template></NButton
      ></template>
    </NCard>
    <NCard title="Live List">
      <template #header-extra
        ><NButton
          >Refresh<template #icon><IconRefresh /></template></NButton
      ></template>
    </NCard>
    <NCard title="Report List">
      <template #header-extra
        ><NButton
          >Refresh<template #icon><IconRefresh /></template></NButton
      ></template>
    </NCard>
  </NSpace>
</template>
