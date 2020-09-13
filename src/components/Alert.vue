<template>
  <div class="alert">
    <div class="alert__text-container">
      <div
        v-if="warning"
        class="alert__text--warning"
      >
        ⓧ
      </div>
      <div
        v-if="alert"
        class="alert__text--alert"
      >
        🛈
      </div>
      <div
        v-if="success"
        class="alert__text--success"
      >
        🛈 
      </div>
      <p class="alert__text">
        {{ this.text }}
      </p>
    </div>
    <Button
      @clicked="$emit('close')"
      class="alert__btn"
      :text="'Close'"
    />
  </div>
</template>

<script>
import Button from "./Button";

export default {
  name: "Alert",
  components: {
    Button
  },
  props: {
    warning: Boolean,
    alert: Boolean,
    success: Boolean,
    text: String,
    autoClose: Boolean
  },
  mounted() {
    if (this.autoClose) {
      setTimeout(() => {
        this.$emit("close");
      }, 5000);
    }
  }
};
</script>

<style lang="scss">
.alert {
  margin-top: 10px;
  display: flex;
  width: 320px;
  background-color: var(--alert-hover-color);
  color: var(--secondary-text);
  font-size: 13px;
  font-weight: 400;
  padding: 10px;
  border-radius: 5px;
  flex-direction: column;
  cursor: pointer;

  &:first-of-type {
    margin-top: 0px;
  }

  &__text-container {
    display: flex;
    text-overflow: ellipsis;
    word-break: break-all;
  }

  &__btn {
    align-self: flex-end;
  }

  &__text {
    margin-left: 5px;
    margin-top: -1px;

    &--warning {
      color: var(--accent-color-secondary);
      font-size: 15px;
      font-weight: 600;
    }

    &--alert {
      color: var(--accent-color);
    }

    &--success {
      color: #28a745;
    }
  }
}
</style>
