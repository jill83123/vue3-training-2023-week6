<template>
  <div class="container">
    <div class="row justify-content-center align-items-center" style="min-height: 80vh">
      <div class="col-4">
        <h1 class="text-center fw-bold mb-4 h2" style="letter-spacing: 0.2rem">請先登入</h1>

        <form class="d-flex flex-column" @submit.prevent="signIn">
          <div class="mb-3">
            <label for="email" class="form-label">帳號</label>
            <input
              type="email"
              class="form-control"
              id="email"
              placeholder="name@example.com"
              v-model="user.username"
              required
            />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">密碼</label>
            <input
              type="password"
              class="form-control"
              id="password"
              placeholder="請輸入密碼"
              v-model="user.password"
              required
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary mt-2"
            :disabled="!this.user.username || !this.user.password"
          >
            登入
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import swalMixin from '@/mixins/swalMixin';

export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    };
  },

  methods: {
    async signIn() {
      if (!this.user.username || !this.user.password) return;

      try {
        const res = await this.axios.post(`${import.meta.env.VITE_API}/admin/signin`, this.user);

        const { token, expired } = res.data;
        document.cookie = `flosToken=${token}; expires=${new Date(expired)}`;

        this.showToast({
          title: '登入成功',
          icon: 'success',
        });

        this.$router.replace('/admin/product');
      } catch (err) {
        this.showToast({
          title: err.response?.data?.message || '發生錯誤，請稍後再試',
          icon: 'error',
        });
      }
    },
  },

  mixins: [swalMixin],
};
</script>
