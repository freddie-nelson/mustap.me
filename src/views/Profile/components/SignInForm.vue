<template>
  <div class="sign-in-form">
    <img
      src="@/assets/svg/profile.svg"
      alt="Profile Icon"
      class="sign-in-form__icon"
      :style="{ filter: $store.getters.imageFilter }"
    >
    <div class="sign-in-form__inputs">
      <InputBox
        placeholder="Email..."
        :height="35"
      />
      <InputBox
        placeholder="Password..."
        :max-length="30"
        :height="35"
      />
    </div>
    <div class="sign-in-form__btn-container">
      <Button
        text="Sign up"
        :filled="true"
      />
      <Button
        text="Sign in"
        :filled="true"
      />
    </div>
  </div>
</template>

<script>
import InputBox from "@/components/InputBox";
import Button from "@/components/Button";

export default {
    name: "SignInForm",
    components: {
      InputBox,
      Button
    }
}
</script>

<style lang="scss">
  .sign-in-form {
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;

    &__icon {
      width: 70px;
    }

    &__btn-container {
      margin-top: 15px;
      align-self: flex-end;

      div:first-of-type {
        margin-right: 15px;
      }
    }
  }
</style>