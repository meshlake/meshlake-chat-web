<template>
  <NConfigProvider
    :locale="zhCN"
    :theme="getDarkTheme"
    :theme-overrides="getThemeOverrides"
    :date-locale="dateZhCN"
    :language="language"
  >
    <NaiveProvider>
      <RouterView />
    </NaiveProvider>
  </NConfigProvider>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { zhCN, dateZhCN, darkTheme } from 'naive-ui';
  // import { AppProvider } from '@/components/Application';
  import { NaiveProvider } from '@/components/common';
  import { useDesignSettingStore } from '@/store/modules/designSetting';
  import { lighten } from '@/utils/index';
  import { useLanguage } from '@/hooks/useLanguage';

  const { language } = useLanguage();

  const designStore = useDesignSettingStore();

  /**
   * @type import('naive-ui').GlobalThemeOverrides
   */
  const getThemeOverrides = computed(() => {
    const appTheme = designStore.appTheme;
    const lightenStr = lighten(designStore.appTheme, 6);
    return {
      common: {
        primaryColor: appTheme,
        primaryColorHover: lightenStr,
        primaryColorPressed: lightenStr,
        primaryColorSuppl: appTheme,
      },
      LoadingBar: {
        colorLoading: appTheme,
      },
    };
  });

  const getDarkTheme = computed(() => (designStore.darkTheme ? darkTheme : undefined));
</script>

<style lang="less">
  @import 'styles/index.less';
</style>
