<template>
    <main class="settings">
        <h1>Settings</h1>
        <section class="settings__main">
            <div class="settings__category">
                    <h2>Appearance</h2>

                    <div class="category__setting">
                        <h3>Default font</h3>
                        <p>Controls the default font family</p>
                        <Dropdown :options="settings.fonts" :selected="settings.currentFont" />
                    </div>
            </div>
        </section>
    </main>
</template>

<script>
import Dropdown from '@/components/Dropdown'

export default {
    name: 'Settings',
    components: {
        Dropdown
    },
    data() {
        return {
            settings: {
                volume: 0.5,
                fonts: ['Poppins', 'Arial', 'sans-serif'],
                currentFont: 0,
            }
        }
    }
}
</script>

<style lang="scss">
    .settings {
        width: 100%;
        height: 100%;
        color: var(--primary-text);

        h1 {
            font-size: 36px;
            margin: 60px 0 5px 60px;
            font-weight: 600;
        }

        &__main {
            display: flex;
            width: 100%;
            padding: 10px 60px 40px 60px;
        }
        
        &__category {
            margin-left: 20px;

            &:not(:first-of-type) {
                margin-top: 30px;
            }

            h2 {
                font-size: 24px;
                font-weight: 500;
                margin-bottom: 15px;
            }

            .category {
                &__setting {
                    max-width: 600px;
                    width: 100%;
                    margin-bottom: 20px;
                    margin-left: 20px;

                    h3 {
                        font-size: 18px;
                        font-weight: 500;
                    }

                    p {
                        font-size: 14px;
                        color: var(--secondary-text);
                    }
                }
            }
        }
    }
</style>