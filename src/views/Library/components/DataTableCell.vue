<template>
  <div class="cell created" :id="id" @click="$emit('clicked', index)">
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
import { v4 as uuidv4 } from "uuid";

export default {
  name: "DataTableCell",
  data() {
    return {
      id: uuidv4()
    };
  },
  props: {
    data: Object,
    index: Number,
    forPlaylists: Boolean
  },
  mounted() {
    if (this.index >= 0) {
      document.getElementById(this.id).classList.remove("created");
    } else {
      setTimeout(() => {
        if (!document.getElementById(this.id)) {
          return;
        } else {
          document.getElementById(this.id).classList.remove("created");
        }
      }, 100 + this.index * 100);
    }
  }
};
</script>

<style lang="scss">
.created {
  transform: translateX(30px) !important;
  opacity: 0 !important;
}

.cell {
  max-width: 100%;
  height: 64px;
  margin: 12px 0;
  background-color: var(--main-bg);
  border-radius: 10px;
  display: flex;
  cursor: pointer;
  transition: background-color 0.3s ease-in, color 0.2s ease-in,
    transform 0.4s ease-out, opacity 0.4s ease-out;
  transform: translateX(0);
  opacity: 1;

  &.clicked {
    color: var(--accent-color);

    & .cell__right-text-top {
      color: var(--accent-color);
    }
  }

  &:hover {
    background-color: var(--lighter-bg);
  }

  &__index {
    margin: auto 0;
    font-family: helvetica;
    font-size: 16px;
    color: var(--primary-text);
    opacity: 0.3;
    width: 40px;
    text-align: center;
  }

  &__left-text {
    font-weight: 500;
    margin: auto 0;

    &-top {
      font-size: 18px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 350px;
    }

    &-bottom {
      font-size: 14px;
      color: var(--secondary-text);
      margin-top: -2px;
    }
  }

  &__right-text {
    font-weight: 400;
    margin: 8px 12px 0 auto;

    &-top {
      font-size: 16px;
      color: var(--secondary-text);
    }
  }
}
</style>

