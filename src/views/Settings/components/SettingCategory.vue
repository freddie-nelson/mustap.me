<template>
  <div>
    <h2>{{ this.title }}</h2>
    <SettingsItem
      v-for="(setting, index) in Object.keys(data)"
      :key="index"
      :title="setting"
      :data="data[setting]"
      @clicked-option="$emit('clicked-option', { setting: setting, index: $event })"
      @checked="$emit('checked', { setting: setting, value: $event })"
    />
  </div>
</template>

<script>
import SettingsItem from "./SettingsItem";

export default {
  name: "SettingCategory",
  components: {
    SettingsItem
  },
  props: {
    title: String,
    data: Object
  }
};
</script>

<style></style>
