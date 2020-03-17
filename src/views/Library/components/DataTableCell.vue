<template>
  <div class="cell">
    <span class="cell__index">{{ index }}</span>
    <div class="cell__left-text">
      <p class="cell__left-text-top">{{ data.leftTop }}</p>
      <p class="cell__left-text-bottom">{{ data.leftBottom }}</p>
    </div>

    <div class="cell__right-text">
      <p class="cell__right-text-top">{{ data.rightTop }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "DataTableCell",
  props: {
      data: Object,
      index: Number
  }
};
</script>

<style lang="scss">
.cell {
  width: 100%;
  height: 64px;
  margin: 12px 0;
  background: none;
  border-radius: 10px;
  display: flex;
  cursor: pointer;
  transition: background .3s ease-in;

  &:hover {
      background: #242424;
  }

  &__index {
    margin: auto 0;
    font-family: helvetica;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.404);
    width: 40px;
    text-align: center;
  }

  &__left-text {
    font-weight: 500;
    margin: auto 0;

    &-top {
      font-size: 18px;
    }

    &-bottom {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      margin-top: -2px;
    }
  }

  &__right-text {
    font-weight: 400;
    margin: 8px 12px 0 auto;

    &-top {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.7);
    }
  }
}
</style>

