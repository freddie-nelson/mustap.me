<template>
  <div class="category__setting">
    <vue-range-slider
      v-if="this.title === 'volume'"
      :value="$store.getters.soundVolume"
      :max="1"
      :min="0"
      :step="0.01"
      :height="12"
      :dot-size="20"
      :tooltip="false"
      class="settings-slider"
      @slide-end="$store.dispatch('changeVolumeSlider', $event)"
    />
    <div v-else>
      <h3>{{ this.capatilizedTitle }}</h3>
      <p>{{ this.data.description }}</p>
      <Dropdown
        v-if="data.options && typeof data.options === 'object'"
        :options="data.options"
        :selected="data.selected"
        @clicked-option="$emit('clicked-option', $event)"
      />
      <Checkbox v-else @checked="$emit('checked', $event)" :checked="data.options" />
    </div>
  </div>
</template>

<script>
import Dropdown from "@/components/Dropdown";
import Checkbox from "@/components/Checkbox";

export default {
  name: "SettingsItem",
  components: {
    Dropdown,
    Checkbox
  },
  props: ["title", "data"],
  computed: {
    capatilizedTitle() {
      return this.title.charAt(0).toUpperCase() + this.title.slice(1, this.title.length);
    }
  },
  methods: {}
};
</script>

<style lang="scss">
.settings-slider {
  display: block;
  padding: 0 !important;
  margin: 0;
  cursor: pointer;
  min-width: 280px;
}
</style>
