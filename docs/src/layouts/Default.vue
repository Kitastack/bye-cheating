<script setup lang="ts">
import type { DropdownOption } from 'naive-ui/es/dropdown/src/interface'
import {
  IconMoonFilled,
  IconSunFilled,
  IconDevices,
  IconHome,
  IconCode,
  IconLink,
  IconBell,
} from '@tabler/icons-vue'
import {
  NButton,
  NButtonGroup,
  NCard,
  NDropdown,
  NFlex,
  NH1,
  NSpace,
  NText,
  NAlert,
  useMessage,
  useNotification,
} from 'naive-ui'
import { getCurrentInstance, h, onMounted, reactive, watch } from 'vue'
import { useBreakpoint } from '@/composables/breakpoint'
import { useThemeStore } from '@/stores/theme.store'
import { useUserStore } from '@/stores/user.store'
import Container from '@/shared/ui/Container.vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const mode_env = import.meta.env.MODE
const router = useRouter()
const message = useMessage()
const breakpoint = useBreakpoint()
const themeStore = useThemeStore()
const notification = useNotification()
const userStore = useUserStore()
const { isLoggedIn, currentNotificationLiveData, userSigninData, userFullData } =
  storeToRefs(userStore)
const { toggleTheme } = storeToRefs(themeStore)
const utils = getCurrentInstance()?.proxy?.$utils
const data: {
  selectedButtonOptions: DropdownOption | null
  themeButtonOptions: DropdownOption[] &
    { key: typeof toggleTheme.value; label: typeof toggleTheme.value }[]
} = reactive({
  themeButtonOptions: [
    {
      key: 'light',
      label: 'light',
      icon: utils?.renderIcon(IconSunFilled),
      props: {
        onClick: () => {
          themeStore.setCookieThemeAction('light')
        },
      },
    },
    {
      key: 'dark',
      label: 'dark',
      icon: utils?.renderIcon(IconMoonFilled),
      props: {
        onClick: () => {
          themeStore.setCookieThemeAction('dark')
        },
      },
    },
    {
      key: 'device',
      label: 'device',
      icon: utils?.renderIcon(IconDevices),
      props: {
        onClick: () => {
          themeStore.setCookieThemeAction('device')
        },
      },
    },
  ],
  selectedButtonOptions: null,
})

function handleSelectedButtonOptions(key: string | number) {
  const findButtonOption = data.themeButtonOptions.find((themeButton) => themeButton.key == key)
  if (!findButtonOption) return
  data.selectedButtonOptions = findButtonOption
}

watch(
  () => toggleTheme.value,
  (value) => {
    handleSelectedButtonOptions(value)
  },
  { immediate: true },
)
watch(
  () => isLoggedIn.value,
  () => {
    userStore.subscribeNotificationAction()
  },
)
watch(
  () => currentNotificationLiveData.value,
  () => {
    if (currentNotificationLiveData.value) {
      notification.create({
        title: currentNotificationLiveData.value?.title,
        content: currentNotificationLiveData.value?.description,
        type: (currentNotificationLiveData.value?.type as any) ?? 'default',
        duration: 5000,
      })
      // userStore.$patch((state) => {
      //   if (isNotificationLiveDataExist) {
      //     state.notificationLiveData = notificationLiveData.value!.map(
      //       (notificationLiveDataItem) => {
      //         if (notificationLiveDataItem.id == currentNotification?.id) {
      //           return {
      //             ...notificationLiveDataItem,
      //             isReaded: true,
      //           }
      //         }
      //         return notificationLiveDataItem
      //       },
      //     )
      //   }
      // })
    }
  },
  {
    deep: true,
  },
)

onMounted(() => {
  userStore.pingServerAction().catch(() => {
    message.loading(
      () =>
        h(NFlex, { align: 'center' }, [
          h(NText, {}, { default: () => 'Failed to connect, server unreachable.' }),
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              onClick: () => {
                window.location.reload()
              },
            },
            { default: () => 'Try again' },
          ),
        ]),
      {
        duration: 0,
      },
    )
  })
  // load cached sign-in session
  userStore.loadSigninAction().finally(() => {
    userStore.loadUserDataAction().finally(() => {
      if (userFullData.value?.email) {
        message.success(
          `${userFullData.value?.roles?.includes('Admin') ? 'Welcome [admin]' : 'Welcome'} ${userFullData.value.email}`,
        )
      }
    })
  })
})
</script>
<template>
  <Container>
    <br />
    <NFlex justify="center">
      <NButton v-if="isLoggedIn" @click="router.push({ path: '/' })" circle
        ><template #icon><IconBell /> </template
      ></NButton>
      <NButton @click="router.push({ path: '/' })" circle
        ><template #icon><IconHome /> </template
      ></NButton>
      <NButtonGroup>
        <NDropdown
          :options="data.themeButtonOptions"
          @select="handleSelectedButtonOptions"
          :render-label="
            (option) =>
              h('span', { style: { textTransform: 'capitalize' } }, { default: () => option.label })
          "
        >
          <NButton>
            <template #icon> <data.selectedButtonOptions?.icon /> </template>
            <span style="text-transform: capitalize">{{
              data.selectedButtonOptions?.key
            }}</span></NButton
          >
        </NDropdown>
      </NButtonGroup>
    </NFlex>
    <br />
    <NSpace
      vertical
      :style="{
        zIndex: 1,
      }"
      size="large"
    >
      <NCard>
        <NFlex justify="space-between" align="center" :vertical="breakpoint.mdAndDown" size="large">
          <NH1>Byecheating API</NH1>
          <NSpace align="center" justify="center">
            <NButton
              @click="() => router.push('/docs')"
              type="primary"
              :render-icon="utils?.renderIcon(IconCode)"
              >API Docs</NButton
            >
            <NButton @click="() => router.push('/about')" icon-placement="right">About</NButton>
            <NButton
              :render-icon="utils?.renderIcon(IconLink)"
              @click="
                () => {
                  utils?.appWindow.open('https://linkedin.com/in/dinta-syaifuddin', '_blank')
                }
              "
              >Dev</NButton
            >
          </NSpace>
        </NFlex>
      </NCard>
      <NAlert type="warning">
        <NText
          >This intended for academic research, so please be certain that you do not disclose any
          sensitive information here!
        </NText>
      </NAlert>
      <NAlert v-if="mode_env == 'production'" type="info">
        <NText>Production mode, means all data is static for demonstration only </NText>
      </NAlert>
      <slot />
    </NSpace>
    <br />
    <br />
  </Container>
</template>
