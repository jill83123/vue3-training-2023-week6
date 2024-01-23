<template>
  <UserNavbar />
  <div style="min-height: calc(100vh - 120px)">
    <RouterView />
  </div>
  <UserFooter />
</template>

<script>
import UserNavbar from '@/components/user/UserNavbar.vue';
import UserFooter from '@/components/user/UserFooter.vue';

export default {
  components: { UserNavbar, UserFooter },
};
</script>
