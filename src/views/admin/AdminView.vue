<template>
  <AdminNavbar />
  <RouterView v-if="isCheck" />
</template>

<script>
import AdminNavbar from '@/components/admin/AdminNavbar.vue';
import swalMixin from '@/mixins/swalMixin';

export default {
  data() {
    return {
      isCheck: false,
    };
  },

  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)flosToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    this.$http.defaults.headers.common.Authorization = token;
    if (!token) {
      this.showToast({
        title: '請重新登入',
        icon: 'error',
      });
      this.$router.replace('/login');
      return;
    }
    this.checkUser();
  },

  methods: {
    async checkUser() {
      try {
        this.axios.post(`${import.meta.env.VITE_API}/api/user/check`);
        this.isCheck = true;
      } catch (err) {
        this.showToast({
          title: err.response?.data?.message || '發生錯誤，請稍後再試',
          icon: 'error',
        });
        this.$router.replace('/login');
      }
    },
  },

  mixins: [swalMixin],

  components: { AdminNavbar },
};
</script>
