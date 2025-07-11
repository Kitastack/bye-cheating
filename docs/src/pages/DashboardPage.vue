<script setup lang="ts">
import {
  NCard,
  NText,
  NSpace,
  NDivider,
  NGrid,
  NGridItem,
  NForm,
  NInput,
  NFormItem,
  NAlert,
  NButton,
  NEmpty,
  useMessage,
  NAvatar,
  NFlex,
  NList,
  NListItem,
  NImage,
  NSelect,
  NInputGroup,
  useThemeVars,
  NSpin,
  NThing,
  NScrollbar,
  NCountdown,
  NIcon,
  NA,
  NDrawer,
  NDrawerContent,
  NDescriptions,
  NDescriptionsItem,
  NTable,
  NH1,
  NTag,
} from 'naive-ui'
import {
  IconMaximize,
  IconPlayerPause,
  IconPlayerPlay,
  IconRefresh,
  IconArrowsMoveVertical,
  IconPlayerRecordFilled,
  IconPlayerStop,
  IconPhotoX,
  IconArrowUpRight,
  IconVideoOff,
} from '@tabler/icons-vue'
import { required, email, minLength, helpers } from '@vuelidate/validators'
import { getCurrentInstance, nextTick, onMounted, reactive, ref } from 'vue'
import { useCustomLoading } from '@/composables/loading'
import { useBreakpoint } from '@/composables/breakpoint'
import { useThemeStore } from '@/stores/theme.store'
import { useUserStore } from '@/stores/user.store'
import { useVuelidate } from '@vuelidate/core'
import { useApi } from '@/composables/api'
import { storeToRefs } from 'pinia'
import moment from 'moment'

const mode_env = import.meta.env.MODE
const api_env = import.meta.env.VITE_API
const message = useMessage()
const userStore = useUserStore()
const loading = useCustomLoading()
const theme = useThemeVars()
const breakpoint = useBreakpoint()
const utils = getCurrentInstance()?.proxy?.$utils
const themeStore = useThemeStore()
const { isDarkTheme } = storeToRefs(themeStore)
const { userSigninData, userFullData, userAuditData, isConnectedToServer } = storeToRefs(userStore)

const reportDetailDrawerRef = ref<reportDataType | null>(null)
const reportSectionLoadingRef = ref<boolean>(false)
const streamSectionLoadingRef = ref<boolean>(false)
const userSectionRef = ref<InstanceType<typeof NSpace> | null>(null)
const streamSectionRef = ref<InstanceType<typeof NSpace> | null>(null)
const liveSectionRef = ref<InstanceType<typeof NSpace> | null>(null)
const reportSectionRef = ref<InstanceType<typeof NSpace> | null>(null)
const imageLiveContainerRef = ref<HTMLDivElement | null>(null)
const logsLiveContainerRef = ref<any | null>(null)
const logsLiveData = ref<liveDataType[] | null>(null)
const stateStreamData = ref<streamDataType[] | null>(null)
const stateReportData = ref<reportDataType[] | null>(null)
const stateLiveStreamUrl = ref<string | null>(null)
const stateLiveData = ref<liveDataType | null>(null)
const stateLiveIsPlaying = ref<boolean>(false)
const stateLiveIsPrediction = ref<boolean>(false)
const stateLiveUrl = ref<string | null>(null)
const stateLiveResponse = ref<EventSource | null>(null)
const stateLiveFullscreenToggle = ref<boolean>(false)
const stateLiveDataResponse = ref<
  | {
      success: boolean
      result: string
      message?: string
      prediction?: any
    }[]
  | null
>(null)
const stateSignin = reactive<{
  email: string | null
  password: string | null
}>({
  email: 'basic@byecheating.com',
  password: '@aBcDeFgHiJk12345',
})
const stateSignup = reactive<{
  name: string | null
}>({
  name: null,
})
const stateUserEdit = reactive<{
  name: string | null
}>({
  name: null,
})
const stateStream = reactive<{
  url: string | null
}>({
  url: null,
})

const formSignin = useVuelidate(
  {
    email: {
      required: helpers.withMessage(() => `Please fill the field`, required),
      email: helpers.withMessage(() => `Email tidak valid`, email),
    },
    password: {
      required: helpers.withMessage(() => `Please fill the field`, required),
      minLength: helpers.withMessage(() => `8 chars minimum`, minLength(8)),
    },
  },
  stateSignin,
)
const formSignup = useVuelidate(
  {
    name: {
      required: helpers.withMessage(() => `Please fill the field`, required),
    },
  },
  stateSignup,
)
const formStream = useVuelidate(
  {
    url: {
      required: helpers.withMessage(() => `Please fill the field`, required),
    },
  },
  stateStream,
)

async function onSubmitSignin() {
  try {
    loading.start()
    if (!(await formSignin.value.$validate())) {
      throw new Error('Please fill email and password')
    }
    const body = JSON.parse(JSON.stringify(stateSignin))
    await userStore.signinAction(body.email, body.password)
    formSignin.value.$reset()
  } catch (error: any) {
    loading.error()
    message.error(`${error?.data?.message ?? error?.message ?? error}`)
  } finally {
    loading.finish()
  }
}
async function onSubmitSignup() {
  try {
    loading.start()
    if (!(await formSignin.value.$validate()) && !(await formSignup.value.$validate())) {
      throw new Error('Please fill email, password and name fields')
    }
    const body = JSON.parse(
      JSON.stringify({
        ...stateSignin,
        ...stateSignup,
      }),
    )
    await userStore.userPostApi('/signup', body)
    message.success(`user ${body.email} success created`)
    await userStore.signinAction(body.email, body.password)
    formSignin.value.$reset()
    formSignup.value.$reset()
  } catch (error: any) {
    loading.error()
    message.error(`${error?.data?.message ?? error?.message ?? error}`)
  } finally {
    loading.finish()
  }
}
async function onSubmitEditUser() {
  try {
    loading.start()
    if (!(Object.values(stateUserEdit).length > 0)) {
      throw new Error('Nothing to update')
    }
    const body = JSON.parse(JSON.stringify(stateUserEdit))
    await userStore.userPatchApi('', body)
    await userStore.loadUserDataAction()
    stateUserEdit.name = userFullData.value?.name ?? null
  } catch (error: any) {
    loading.error()
    message.error(`${error?.data?.message ?? error?.message ?? error}`)
  } finally {
    loading.finish()
  }
}
async function onGetStream() {
  try {
    streamSectionLoadingRef.value = true
    const response = await useApi('/stream').api.get('')
    if (response.data.result) {
      stateStreamData.value = response.data.result
    }
  } catch (error: any) {
    message.error(`${error?.data?.message ?? error?.message ?? error}`)
  } finally {
    streamSectionLoadingRef.value = false
  }
}
async function onDeleteStream(stream: streamDataType) {
  try {
    loading.start()
    await useApi('/stream').api.delete(stream.id)
    message.success(`stream ${stream.url} deleted`)
    await onGetStream()
  } catch (error: any) {
    loading.error()
    message.error(`${error?.data?.message ?? error?.message ?? error}`)
  } finally {
    loading.finish()
  }
}
async function onSubmitStream() {
  try {
    loading.start()
    if (!(await formStream.value.$validate())) {
      throw new Error('Please fill url field')
    }
    await useApi('/stream').api.post('', {
      url: stateStream.url,
    })
    await onGetStream()
    stateStream.url = null
    formStream.value.$reset()
  } catch (error: any) {
    loading.error()
    message.error(`${error?.data?.message ?? error?.message ?? error}`)
  } finally {
    loading.finish()
  }
}
async function onSubmitLive(title?: string | null) {
  try {
    loading.start()
    if (!stateLiveStreamUrl.value) {
      throw new Error('Please select a stream')
    }
    const stream =
      (
        await useApi('/stream').api.get('/', {
          params: {
            url: stateLiveStreamUrl.value,
          },
        })
      )?.data?.result?.[0] ?? null
    if (!stream) {
      throw new Error('Stream not found')
    }
    // @deprecated need to tracking their session
    // // todo: check if live already available with the same stream id
    // stateLiveData.value =
    //   (
    //     await useApi('/live').api.get('/', {
    //       params: {
    //         streamId: stream.id,
    //       },
    //     })
    //   )?.data?.result?.[0] ?? null
    // if (!stateLiveData.value) {
    if (title) {
      stateLiveData.value = (
        await useApi('/report').api.post('/', {
          title,
          description: `Record for stream id ${stream.id} at ${moment().format('DD MMMM YYYY h:mm:ss a')}`,
          streamId: stream.id,
          expiryTimeInMinutes: 1,
        })
      )?.data?.result?.live
      onGetReport()
    } else {
      stateLiveData.value = (
        await useApi('/live').api.post('/', {
          streamId: stream.id,
          expiryTimeInMinutes: 1,
        })
      )?.data?.result
    }
    if (!stateLiveData.value) {
      throw new Error('Live not found')
    }
    await onPlayStream(stateLiveData.value)
  } catch (error: any) {
    loading.error()
    message.error(`${error?.data?.message ?? error?.message ?? error}`)
    throw error
  } finally {
    loading.finish()
  }
}
async function onPlayStream(
  liveData: liveDataType,
  isPrediction: boolean = stateLiveIsPrediction.value,
) {
  loading.start()
  onFetchLive()
  // todo: extend time first
  await useApi('/watch').api.get(`/live/${liveData.id}/extend-more-minutes`)
  // live
  if (stateLiveResponse.value?.CONNECTING != undefined) {
    stateLiveResponse.value.close()
  }
  stateLiveResponse.value = new EventSource(
    `${import.meta.env.VITE_API}/watch/live/${liveData.id}?json=true&prediction=${isPrediction}`,
  )
  stateLiveIsPlaying.value = true
  stateLiveDataResponse.value = []
  stateLiveResponse.value.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.success === false) {
      message.error(data.message)
      stateLiveIsPlaying.value = false
      stateLiveUrl.value = data?.result ?? null
      onGetReport()
    }
    if (data?.prediction) {
      data.prediction = JSON.parse(data.prediction)
    }
    if (stateLiveIsPlaying.value) {
      stateLiveUrl.value = data?.result ?? null
    }
    if (logsLiveContainerRef.value?.$el) {
      nextTick(() => {
        const el = (
          logsLiveContainerRef.value?.$el as HTMLElement
        )?.nextElementSibling?.querySelector('.n-scrollbar-container')
        if (el) {
          el.scrollTop = el.scrollHeight
        }
      })
    }
    stateLiveDataResponse.value?.push(data)
    loading.finish()
  }
  stateLiveResponse.value.onerror = (err) => {
    console.error('SSE connection error', err)
    stateLiveResponse.value?.close()
    stateLiveIsPlaying.value = false
    stateLiveIsPrediction.value = false
    loading.finish()
  }
  stateLiveResponse.value.onopen = () => {
    stateLiveIsPlaying.value = true
  }
}
function onStopStream() {
  if (stateLiveResponse.value?.CONNECTING != undefined) {
    stateLiveResponse.value?.close()
    stateLiveIsPlaying.value = false
    stateLiveIsPrediction.value = false
  }
}
async function onFetchLive() {
  // need to concat stream data
  const liveData = await useApi('/live').api.get('/', {
    params: {
      withStream: true,
    },
  })
  logsLiveData.value = liveData.data?.result ?? null
}
async function onGetReport() {
  try {
    reportSectionLoadingRef.value = true
    const response = await useApi('/report').api.get('')
    if (response.data.result) {
      stateReportData.value = response.data.result
    }
  } catch (error: any) {
    message.error(`${error?.data?.message ?? error?.message ?? error}`)
  } finally {
    reportSectionLoadingRef.value = false
  }
}
function toggleFullscreen(el: HTMLElement) {
  if (!document.fullscreenElement) {
    el.requestFullscreen?.()
    stateLiveFullscreenToggle.value = true
  } else {
    document.exitFullscreen?.()
    stateLiveFullscreenToggle.value = false
  }
}

onMounted(() => {
  userStore.loadSigninAction().then(() => {
    if (userSigninData.value?.email) {
      message.success(`Welcome ${userSigninData.value.email}`)
    }
    userStore.loadUserDataAction().then(() => {
      if (userFullData.value?.name) {
        stateUserEdit.name = userFullData.value.name
      }
    })
  })
  document.addEventListener('fullscreenchange', () => {
    const isFullscreen = document.fullscreenElement !== null
    if (!isFullscreen && imageLiveContainerRef) {
      // Wait a bit to ensure layout is stable before scrolling
      nextTick(() => {
        const el = imageLiveContainerRef.value as HTMLElement
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
      })
    }
  })
  onFetchLive()
})
</script>
<template>
  <NSpace vertical size="large">
    <NAlert type="info">
      <NText
        >The API is part of a system built to track, monitor, and record suspicious behavior during
        remote sessions through RTSP protocol. On this page, you can walkthrough the features<br
      /></NText>
    </NAlert>
    <NDivider><NText>Authentication Story</NText></NDivider>
    <NGrid cols="1 l:2" responsive="screen" x-gap="20" y-gap="10">
      <NGridItem>
        <NCard
          :style="{
            height: '100%',
          }"
        >
          <NSpace
            vertical
            align="center"
            justify="center"
            :style="{
              height: '100%',
            }"
          >
            <NEmpty v-if="!userFullData?.id" description="User not logged in" />
            <NFlex v-else size="large">
              <NAvatar
                :src="
                  userFullData?.photo ??
                  `https://api.dicebear.com/9.x/adventurer/svg?seed=${userFullData?.name}`
                "
                :size="100"
              />
              <NSpace vertical size="large">
                <NText>[Name]: {{ userFullData.name }}</NText>
                <NText>[Email]: {{ userFullData.email }}</NText>
                <NText
                  >[Joined Date]:
                  {{ moment(userFullData.createdDate).format('DD MMMM YYYY') }}</NText
                >
              </NSpace>
              <NButton
                type="primary"
                style="width: 100%"
                :loading="loading.isLoading.value"
                :disabled="loading.isLoading.value"
                @click="
                  () => {
                    loading.start()
                    userStore.loadUserDataAction().finally(() => loading.finish())
                  }
                "
                :render-icon="utils?.renderIcon(IconRefresh)"
                >Refresh</NButton
              >
            </NFlex>
          </NSpace>
        </NCard>
      </NGridItem>
      <NGridItem>
        <NForm @submit.prevent="onSubmitSignin">
          <NSpace vertical space="large">
            <NFormItem
              path="email"
              :feedback="formSignin.email.$errors.map(($error) => $error.$message).toString()"
            >
              <template #label>
                <strong> Email </strong>
              </template>
              <NInput
                type="text"
                v-model:value="stateSignin.email"
                placeholder="ex: email@website.com"
                :loading="loading.isLoading.value"
                :disabled="loading.isLoading.value || !!userSigninData?.id"
              />
            </NFormItem>
            <NFormItem
              path="password"
              :feedback="formSignin.password.$errors.map(($error) => $error.$message).toString()"
            >
              <template #label>
                <strong> Password </strong>
              </template>
              <NInput
                type="password"
                show-password-on="mousedown"
                :loading="loading.isLoading.value"
                :disabled="loading.isLoading.value || !!userSigninData?.id"
                v-model:value="stateSignin.password"
                placeholder="8 digit alphanumeric with 1 symbol"
              />
            </NFormItem>
            <NButton
              attr-type="submit"
              type="primary"
              style="width: 100%"
              :loading="loading.isLoading.value"
              :disabled="loading.isLoading.value || !!userSigninData?.id"
              >Sign in</NButton
            >
          </NSpace>
        </NForm>
        <br />
        <section v-if="!userSigninData?.id">
          <NDivider><NText italic>Or if you dont have an account</NText></NDivider>
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
        </section>
        <NButton
          v-else
          type="error"
          style="width: 100%"
          @click="userStore.signoutUserAction"
          :loading="loading.isLoading.value"
          :disabled="loading.isLoading.value"
          >Sign out</NButton
        >
      </NGridItem>
    </NGrid>
    <NGrid v-if="userFullData?.id" cols="12" responsive="screen" x-gap="20" y-gap="10">
      <NGridItem :span="breakpoint.mdAndDown ? 12 : 9">
        <section>
          <NSpace ref="userSectionRef" vertical size="large">
            <NDivider><NText>User Story</NText></NDivider>
            <NCard title="Edit user data">
              <NForm @submit.prevent="onSubmitEditUser">
                <NSpace vertical space="large">
                  <NFormItem path="name">
                    <template #label>
                      <strong> Name </strong>
                    </template>
                    <NInput
                      type="text"
                      v-model:value="stateUserEdit.name"
                      placeholder="ex: Dinta Wondervaal"
                      :loading="loading.isLoading.value"
                      :disabled="loading.isLoading.value"
                    />
                  </NFormItem>
                  <NFormItem path="email">
                    <template #label>
                      <strong> Email</strong>
                    </template>
                    <NInput
                      disabled
                      type="text"
                      :value="userFullData?.email"
                      placeholder="ex: email@website.com"
                      :loading="loading.isLoading.value"
                    />
                  </NFormItem>
                  <NButton
                    attr-type="submit"
                    type="primary"
                    style="width: 100%"
                    :loading="loading.isLoading.value"
                    :disabled="loading.isLoading.value"
                    >Save</NButton
                  >
                </NSpace>
              </NForm>
            </NCard>
            <NCard title="User Audit Logs">
              <NList v-if="userAuditData && userAuditData?.length > 0" hoverable bordered>
                <NListItem v-for="(item, itemIdx) in userAuditData" :key="itemIdx">
                  <NFlex justify="space-between">
                    <NText
                      ><strong>{{ item.user?.name }}</strong> made changes at
                      {{ moment(item.createdDate).format('DD MMMM YYYY') }}</NText
                    >
                    <NText>{{ moment(item.createdDate).format('HH:mm A') }}</NText>
                  </NFlex>
                </NListItem>
              </NList>
              <NEmpty v-else description="Logs not found" />
            </NCard>
          </NSpace>
          <NSpace ref="streamSectionRef" vertical size="large" @vue:mounted="onGetStream">
            <NDivider><NText>Stream Story</NText></NDivider>
            <NCard title="Add stream">
              <NForm @submit.prevent="onSubmitStream">
                <NSpace vertical space="large">
                  <NFormItem
                    path="url"
                    :feedback="formStream.url.$errors.map(($error) => $error.$message).toString()"
                  >
                    <template #label>
                      <strong> URL </strong>
                    </template>
                    <NInput
                      type="text"
                      v-model:value="stateStream.url"
                      placeholder="rtsp://0.0.0.0:8554/live or rtsp://host.docker.internal:8554/live"
                      :loading="loading.isLoading.value"
                      :disabled="loading.isLoading.value"
                    />
                  </NFormItem>
                  <NButton
                    attr-type="submit"
                    type="primary"
                    style="width: 100%"
                    :loading="loading.isLoading.value"
                    :disabled="loading.isLoading.value"
                    >Save</NButton
                  >
                </NSpace>
              </NForm>
            </NCard>
            <NSpin :show="streamSectionLoadingRef">
              <template #description> Loading... </template>
              <NCard title="Stream Data">
                <template #header-extra
                  ><NButton @click="onGetStream"
                    >Refresh<template #icon><IconRefresh /></template></NButton
                ></template>
                <NList v-if="stateStreamData && stateStreamData?.length > 0" hoverable bordered>
                  <NListItem v-for="(item, itemIdx) in stateStreamData" :key="itemIdx">
                    <NFlex justify="space-between" align="center">
                      <NText
                        ><strong>{{ item.url }}</strong></NText
                      >
                      <NSpace align="center">
                        <NText>{{ moment(item.createdDate).format('DD MMMM YYYY') }}</NText>
                        <NButton
                          :disabled="loading.isLoading.value"
                          :loading="loading.isLoading.value"
                          size="small"
                          @click="
                            () => {
                              utils?.appWindow.navigator.clipboard
                                .writeText(item.id)
                                .then(() => message.success('ID copied'))
                                .catch(() => message.error('Clipboard not supported'))
                            }
                          "
                          >Copy ID</NButton
                        >
                        <NButton
                          :disabled="loading.isLoading.value"
                          :loading="loading.isLoading.value"
                          size="small"
                          type="error"
                          @click="onDeleteStream(item)"
                          >Delete</NButton
                        >
                      </NSpace>
                    </NFlex>
                  </NListItem>
                </NList>
                <NEmpty v-else description="Logs not found" />
              </NCard>
            </NSpin>
          </NSpace>
          <NSpace ref="liveSectionRef" vertical size="large">
            <NDivider><NText>Live Story</NText></NDivider>
            <NCard title="Streaming">
              <template #header-extra>
                <NText>[{{ isConnectedToServer ? 'Ready' : 'Not Ready' }}]</NText>
              </template>
              <NForm @submit.prevent="onSubmitLive(null)">
                <NSpace vertical space="large">
                  <NFormItem path="streamId">
                    <template #label>
                      <strong> Stream </strong>
                    </template>
                    <NInputGroup>
                      <NSelect
                        filterable
                        placeholder="Please select a stream"
                        v-model:value="stateLiveStreamUrl"
                        :options="
                          stateStreamData?.map((item) => ({
                            label: item.url,
                            value: item.url,
                          })) ?? []
                        "
                      />
                      <NButton
                        attr-type="submit"
                        type="primary"
                        :loading="loading.isLoading.value"
                        :disabled="loading.isLoading.value"
                        icon-placement="right"
                        >Play <template #icon><IconPlayerPlay /></template
                      ></NButton>
                      <NButton
                        type="warning"
                        icon-placement="right"
                        :loading="loading.isLoading.value"
                        :disabled="loading.isLoading.value"
                        @click="
                          () => {
                            let title = utils?.appWindow.prompt('Record title')
                            if (!title || !(title?.length > 0)) {
                              title = `Record ${moment().format('DD-MM-YYYY h:mm:ss a')}`
                            }
                            onSubmitLive(title)
                          }
                        "
                        >Record <template #icon><IconPlayerRecordFilled /></template
                      ></NButton>
                    </NInputGroup>
                  </NFormItem>
                  <NText>[Live ID]: {{ stateLiveData?.id ?? '-' }}</NText>
                  <NSpin :show="loading.isLoading.value">
                    <template #description> Loading... </template>
                    <div
                      ref="imageLiveContainerRef"
                      :style="{
                        position: 'relative',
                        backgroundColor: theme.placeholderColorDisabled,
                        borderRadius: '15px',
                        overflow: 'hidden',
                      }"
                    >
                      <div
                        :style="{
                          width: '100%',
                          height: stateLiveFullscreenToggle ? '100vh' : 'auto',
                          minHeight: '500px',
                          position: 'relative',
                          background: isDarkTheme ? theme.bodyColor : theme.actionColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }"
                      >
                        <img
                          v-if="stateLiveUrl"
                          :src="stateLiveUrl"
                          :style="{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }"
                        />
                        <div v-else><IconVideoOff /></div>
                      </div>

                      <NFlex
                        gap="large"
                        justify="space-between"
                        :style="{
                          width: '100%',
                          position: 'absolute',
                          boxSizing: 'border-box',
                          padding: '0.5rem',
                          left: 0,
                          bottom: 0,
                          background: `rgba(30, 30, 30, 0.2)`,
                          zIndex: 10,
                        }"
                      >
                        <NFlex>
                          <NButton
                            circle
                            type="primary"
                            @click="
                              () => {
                                if (stateLiveData && stateLiveIsPlaying) {
                                  stateLiveIsPlaying = !stateLiveIsPlaying
                                } else if (stateLiveData && !stateLiveIsPlaying) {
                                  onPlayStream(stateLiveData)
                                } else {
                                  onSubmitLive()
                                }
                              }
                            "
                          >
                            <IconPlayerPause v-if="stateLiveIsPlaying" />
                            <IconPlayerPlay v-else />
                          </NButton>
                          <NButton
                            circle
                            :disabled="!stateLiveIsPlaying"
                            type="primary"
                            @click="
                              () => {
                                onStopStream()
                              }
                            "
                            ><IconPlayerStop />
                          </NButton>
                          <NButton
                            circle
                            :disabled="!stateLiveIsPlaying && !stateLiveData"
                            type="primary"
                            @click="
                              () => {
                                if (stateLiveData) {
                                  onPlayStream(stateLiveData)
                                } else {
                                  onSubmitLive()
                                }
                              }
                            "
                            ><IconRefresh
                          /></NButton>
                          <NButton
                            :disabled="!stateLiveIsPlaying"
                            type="primary"
                            @click="
                              () => {
                                if (stateLiveData) {
                                  stateLiveIsPrediction = !stateLiveIsPrediction
                                  onPlayStream(stateLiveData, stateLiveIsPrediction)
                                }
                              }
                            "
                          >
                            {{ stateLiveIsPrediction ? 'Prediction: [On]' : 'Prediction: [Off]' }}
                          </NButton>
                        </NFlex>
                        <NButton
                          circle
                          type="primary"
                          @click="toggleFullscreen(imageLiveContainerRef as HTMLElement)"
                        >
                          <IconMaximize />
                        </NButton>
                      </NFlex>
                    </div>
                  </NSpin>
                  <NScrollbar
                    v-if="stateLiveDataResponse"
                    ref="logsLiveContainerRef"
                    :style="{
                      maxHeight: '250px',
                      borderRadius: '15px',
                      overflow: 'hidden',
                    }"
                  >
                    <NList
                      hoverable
                      :style="{
                        backgroundColor: isDarkTheme ? theme.bodyColor : theme.actionColor,
                      }"
                    >
                      <NListItem
                        v-for="(
                          stateLiveDataResponseItem, stateLiveDataResponseIdx
                        ) in stateLiveDataResponse"
                        :key="stateLiveDataResponseIdx"
                        @click="
                          () => {
                            stateLiveUrl = stateLiveDataResponseItem.result
                          }
                        "
                      >
                        <NThing
                          :title="`Frame ${utils?.secondsToClock(stateLiveDataResponseIdx + 1)}`"
                        >
                          <template #description>
                            <NText v-if="!stateLiveDataResponseItem.prediction"
                              >Non prediction frame</NText
                            >
                            <NText v-else>{{
                              stateLiveDataResponseItem.prediction
                                ?.map(
                                  (predictionItem: any) =>
                                    `[${predictionItem.track_id}]: ${predictionItem.name}`,
                                )
                                ?.join(', ')
                            }}</NText>
                          </template>
                        </NThing>
                      </NListItem>
                    </NList>
                  </NScrollbar>
                </NSpace>
              </NForm>
            </NCard>
          </NSpace>
          <NSpace ref="reportSectionRef" vertical size="large" @vue:mounted="onGetReport">
            <NDrawer
              :show="Boolean(reportDetailDrawerRef)"
              placement="bottom"
              height="80vh"
              @update:show="
                () => {
                  reportDetailDrawerRef = null
                }
              "
            >
              <NDrawerContent mask-closable closable>
                <template #header>
                  <NText> Summary Report </NText>
                </template>
                <NCard>
                  <NFlex size="large">
                    <video controls height="200px" style="background: black; border-radius: 15px">
                      <source :src="reportDetailDrawerRef?.recordUrl" type="video/mp4" />
                      <a :href="reportDetailDrawerRef?.recordUrl">MP4</a>
                    </video>

                    <NSpace size="large" vertical justify="center">
                      <NText style="text-transform: capitalize"
                        ><strong>[Status]:</strong> {{ reportDetailDrawerRef?.status }}</NText
                      >
                      <NText
                        ><strong>[Created Date]:</strong>
                        {{
                          moment(reportDetailDrawerRef?.createdDate).format('DD MMMM YYYY, H:mm A')
                        }}</NText
                      >
                      <NText
                        ><strong>[Thumbnail URL]: </strong>
                        <NA :href="reportDetailDrawerRef?.thumbnailUrl" target="_blank">{{
                          reportDetailDrawerRef?.thumbnailUrl
                        }}</NA></NText
                      >
                      <NText
                        ><strong>[Record URL]: </strong>
                        <NA :href="reportDetailDrawerRef?.recordUrl" target="_blank">{{
                          reportDetailDrawerRef?.recordUrl
                        }}</NA></NText
                      >
                      <NText
                        ><strong>[Description]:</strong>
                        {{ reportDetailDrawerRef?.description ?? '-' }}</NText
                      >
                    </NSpace>
                  </NFlex>
                </NCard>
                <br />
                <NSpace vertical>
                  <NTable :single-line="true" size="small">
                    <thead>
                      <tr>
                        <th>Identifier (ID)</th>
                        <th>Class (Avg)</th>
                        <th>Class (Most)</th>
                      </tr>
                    </thead>
                    <tbody v-if="reportDetailDrawerRef?.calculatedClass">
                      <tr
                        v-for="(calculatedItem, calculatedItemIdx) in Object.entries(
                          JSON.parse(reportDetailDrawerRef?.calculatedClass),
                        ).map(([key, value]) => ({
                          ...(value as any),
                          id: key,
                        }))"
                        :key="calculatedItemIdx"
                      >
                        <td>{{ calculatedItem?.id }}</td>
                        <td>{{ calculatedItem?.mean }}</td>
                        <td>{{ calculatedItem?.mode }}</td>
                      </tr>
                    </tbody>
                  </NTable>
                </NSpace>
              </NDrawerContent>
            </NDrawer>
            <NDivider><NText>Report Story</NText></NDivider>
            <NSpin :show="reportSectionLoadingRef">
              <template #description> Loading... </template>
              <NCard title="Report Data">
                <template #header-extra
                  ><NButton @click="onGetReport"
                    >Refresh<template #icon><IconRefresh /></template></NButton
                ></template>
                <NScrollbar
                  v-if="stateReportData && stateReportData?.length > 0"
                  trigger="none"
                  :style="{
                    maxHeight: '500px',
                  }"
                >
                  <NList hoverable bordered>
                    <NListItem v-for="(item, itemIdx) in stateReportData" :key="itemIdx">
                      <NThing :title="item.title">
                        <template #header-extra>
                          <NButton
                            @click="
                              () => {
                                reportDetailDrawerRef = item
                              }
                            "
                            icon-placement="right"
                            >Detail <template #icon><IconArrowUpRight /></template
                          ></NButton>
                        </template>
                        <template #description>
                          <NText>{{ item.description }}</NText>
                        </template>
                        <section>
                          <NFlex>
                            <NImage
                              :src="item.thumbnailUrl"
                              :width="150"
                              :height="100"
                              style="background: black; border-radius: 15px"
                            >
                              <template #error>
                                {{ item.thumbnailUrl ?? '-' }}
                                <NIcon :size="100" color="lightGrey">
                                  <IconPhotoX />
                                </NIcon> </template
                            ></NImage>

                            <NSpace size="large" vertical>
                              <NA v-if="item.recordUrl" :href="item.recordUrl" target="_blank"
                                >[Record URL]: {{ item.recordUrl }}</NA
                              >
                              <NText
                                >[Created]:
                                {{ moment(item.createdDate).format('DD MMMM YYYY') }} ({{
                                  moment(item.createdDate).fromNow()
                                }})</NText
                              >
                              <NText
                                :style="{
                                  color:
                                    item.status == 'error'
                                      ? 'red'
                                      : item.status == 'finished'
                                        ? 'green'
                                        : 'orange',
                                }"
                                >[Status]: {{ item.status }}</NText
                              >
                              <!-- {{ item }} -->
                            </NSpace>
                          </NFlex>
                        </section>
                      </NThing>
                    </NListItem>
                  </NList>
                </NScrollbar>
                <NEmpty v-else description="Report not found" />
              </NCard>
            </NSpin>
          </NSpace>
        </section>
      </NGridItem>
      <NGridItem v-if="!breakpoint.mdAndDown" :span="breakpoint.mdAndDown ? 12 : 3">
        <NSpace
          vertical
          :size="25"
          :style="{
            position: 'sticky',
            top: '0px',
            paddingTop: '25px',
          }"
        >
          <NCard title="Shortcut">
            <NSpace vertical>
              <NButton
                icon-placement="right"
                @click="
                  () => {
                    userSectionRef?.$el?.scrollIntoView({
                      behavior: 'smooth',
                    })
                  }
                "
                >User Section <template #icon><IconArrowsMoveVertical /></template
              ></NButton>
              <NButton
                icon-placement="right"
                @click="
                  () => {
                    streamSectionRef?.$el?.scrollIntoView({
                      behavior: 'smooth',
                    })
                  }
                "
                >Stream Section <template #icon><IconArrowsMoveVertical /></template
              ></NButton>
              <NButton
                icon-placement="right"
                @click="
                  () => {
                    liveSectionRef?.$el?.scrollIntoView({
                      behavior: 'smooth',
                    })
                  }
                "
                >Live Section <template #icon><IconArrowsMoveVertical /></template
              ></NButton>
              <NButton
                icon-placement="right"
                @click="
                  () => {
                    reportSectionRef?.$el?.scrollIntoView({
                      behavior: 'smooth',
                    })
                  }
                "
                >Report Section <template #icon><IconArrowsMoveVertical /></template
              ></NButton>
            </NSpace>
          </NCard>
          <NCard title="Status Server">
            <NSpace vertical>
              <NText>[IP]: {{ api_env }}</NText>
              <NText>[Mode]: {{ mode_env }}</NText>
              <NText
                :style="{
                  color: isConnectedToServer ? 'green' : 'red',
                }"
                >[Status]: {{ isConnectedToServer ? 'Connected' : 'Disconnected' }}</NText
              >
            </NSpace>
          </NCard>
          <NCard title="Status Session">
            <NSpace v-if="userSigninData" vertical>
              <NText>[User ID]: {{ userSigninData.id }}</NText>
              <NText
                >[Created]:
                {{ userSigninData?.iat ? moment.unix(userSigninData.iat).fromNow() : '-' }}</NText
              >
              <NText
                >[Expired]:
                {{ userSigninData?.exp ? moment.unix(userSigninData.exp).fromNow() : '-' }}
                (<NCountdown
                  v-if="userSigninData?.exp"
                  :duration="Number(utils?.timestampToSeconds(userSigninData.exp) ?? 0) * 1000"
                  active
                />)
                <!-- {{ userSigninData?.exp ? ` (${expCountdownRef} remaining)` : `` }} -->
              </NText>
              <!--  -->
            </NSpace>
            <NEmpty v-else></NEmpty>
          </NCard>
          <NCard title="Live log">
            <NScrollbar
              v-if="logsLiveData && logsLiveData?.length > 0"
              :style="{
                maxHeight: '300px',
                borderRadius: '15px',
                overflow: 'hidden',
              }"
            >
              <NList
                hoverable
                :style="{
                  backgroundColor: isDarkTheme ? theme.bodyColor : theme.actionColor,
                }"
              >
                <NListItem
                  v-for="(logsLiveDataItem, logsLiveDataIdx) in logsLiveData"
                  :key="logsLiveDataIdx"
                >
                  <NThing :title="`Live ID ${logsLiveDataItem.id}`">
                    <template #description>
                      <NSpace vertical>
                        <NText>[URL]: {{ logsLiveDataItem.stream?.url ?? '-' }}</NText>
                        <NText
                          >[Created]: {{ moment(logsLiveDataItem.createdDate).fromNow() }}</NText
                        >
                      </NSpace>
                    </template>
                  </NThing>
                </NListItem>
              </NList>
            </NScrollbar>
            <NEmpty v-else></NEmpty>
          </NCard>
        </NSpace>
      </NGridItem>
    </NGrid>
  </NSpace>
</template>
