<template>
  <main class="profile">
    <SignInForm />
  </main>
</template>

<script>
import SignInForm from "./components/SignInForm"

export default {
    name: 'Profile',
    components: {
        SignInForm
    }
}
</script>

<style lang="scss">
    .profile {
        display: flex;
        width: 100%;
        height: 100%;
    }
</style>