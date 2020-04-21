<template>
  <div class="checkbox" @click="clicked">
    <transition name="fade">
      <img v-if="checkedBool" src="../assets/svg/tick.svg" alt="" />
    </transition>
  </div>
</template>

<script>
export default {
  name: "Checkbox",
  data() {
    return {
      checkedBool: this.checked
    };
  },
  props: {
    checked: Boolean
  },
  methods: {
    clicked() {
      this.checkedBool = !this.checkedBool;
      this.$emit("checked", this.checkedBool);
    }
  }
};
</script>

<style lang="scss">
.checkbox {
  margin-top: 5px;
  width: 30px;
  height: 30px;
  background-color: var(--lighter-bg);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;

  img {
    width: 58%;
    height: 50%;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
