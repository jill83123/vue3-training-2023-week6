<template>
  <Loading v-model:active="isLoading" />

  <div class="container py-5">
    <h2 class="text-center mb-5" style="font-size: 36px">商品一覽</h2>
    <div class="d-flex flex-wrap">
      <div
        class="card bg-opacity-25 bg-white m-3"
        style="width: 18rem"
        v-for="product in productList"
        :key="product.id"
      >
        <img class="card-img-top" :src="product.imageUrl" :alt="product.title" />
        <div class="card-body h-100 d-flex flex-column">
          <h5>{{ product.title }}</h5>
          <p class="card-text mb-1" style="font-size: 14px">
            {{ product.description }}
          </p>
          <div class="mt-auto mb-2">
            <span
              class="d-inline-block me-2"
              :class="{ 'text-success fw-bold': product.origin_price !== product.price }"
              >NT {{ product.price }} 元</span
            >
            <del
              v-if="product.origin_price !== product.price"
              class="d-inline-block"
              style="font-size: 12px"
              >NT {{ product.origin_price }} 元</del
            >
          </div>
          <button
            class="btn btn-primary rounded-5 d-block position-relative"
            style="font-size: 14px; font-weight: 600; z-index: 10"
            @click="cartStore.addToCart(product.id)"
            :disabled="cartStore.currentLoadingId === product.id"
          >
            <span class="text-primary-dark">
              <div
                class="spinner-border spinner-border-sm me-1"
                role="status"
                style="--bs-spinner-width: 0.8rem; --bs-spinner-height: 0.8rem"
                v-if="cartStore.currentLoadingId === product.id"
              >
                <span class="visually-hidden">Loading...</span>
              </div>
              加入購物車</span
            >
          </button>
          <RouterLink :to="'product/' + product.id" class="stretched-link" style="z-index: 5" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import cartStore from '@/stores/cartStore';
import swalMixin from '@/mixins/swalMixin';

export default {
  data() {
    return {
      productList: [],
      isLoading: false,
    };
  },

  computed: {
    ...mapStores(cartStore),
  },

  methods: {
    async getProducts() {
      this.isLoading = true;

      try {
        const res = await this.axios.get(
          `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_API_PATH}/products/all`,
        );
        this.productList = res.data.products;
      } catch (err) {
        this.showToast({
          title: err.response?.data?.message || '發生錯誤，請稍後再試',
          icon: 'error',
        });
      }

      this.isLoading = false;
    },
  },

  mounted() {
    this.getProducts();
  },

  mixins: [swalMixin],
};
</script>
