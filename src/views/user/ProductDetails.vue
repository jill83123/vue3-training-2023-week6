<template>
  <Loading v-model:active="isLoading" />

  <div class="container pt-5">
    <div class="row">
      <div class="col-4">
        <img :src="productDetails.imageUrl" :alt="productDetails.title" />
      </div>

      <div class="col-8 ps-5 d-flex flex-column">
        <div>
          <h2 class="mb-2 d-inline-block">{{ productDetails.title }}</h2>
          <p class="d-inline-block ms-2">
            <span
              class="d-inline-block fw-bold fs-5"
              :class="{ 'text-success': productDetails.origin_price !== productDetails.price }"
              >NT {{ productDetails.price }}</span
            >
            <del
              v-if="productDetails.origin_price !== productDetails.price"
              class="d-inline-block ms-1 opacity-50"
              >NT {{ productDetails.origin_price }}</del
            >
          </p>
          <p class="mb-4">{{ productDetails.description }}</p>
          <h3 class="fs-6">【內容】</h3>
          <p v-if="productDetails.content">{{ productDetails.content }}</p>
          <p v-else>此商品無內容描述</p>
        </div>
        <div class="mt-auto d-flex gap-2">
          <div class="input-group input-group-sm w-50">
            <div class="input-group">
              <input min="1" type="number" class="form-control" v-model.number="tempNum" />
              <span class="input-group-text" id="basic-addon2">{{ productDetails.unit }}</span>
            </div>
          </div>
          <button
            class="btn btn-primary d-block position-relative"
            style="font-size: 14px; font-weight: 600; z-index: 10"
            @click="addToCart(productDetails.id, tempNum)"
            :disabled="currentLoadingId === productDetails.id"
          >
            <span class="text-primary-dark">
              <div
                class="spinner-border spinner-border-sm me-1"
                role="status"
                style="--bs-spinner-width: 0.8rem; --bs-spinner-height: 0.8rem"
                v-if="currentLoadingId === productDetails.id"
              >
                <span class="visually-hidden">Loading...</span>
              </div>
              加入購物車</span
            >
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import cartStore from '@/stores/cartStore';
import swalMixin from '@/mixins/swalMixin';

export default {
  data() {
    return {
      isLoading: false,
      tempNum: 1,
      productDetails: {},
    };
  },

  computed: {
    ...mapState(cartStore, ['currentLoadingId']),
  },

  methods: {
    async getProductDetails() {
      this.isLoading = true;

      try {
        const { id } = this.$route.params;
        const res = await this.axios.get(
          `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_API_PATH}/product/${id}`,
        );
        this.productDetails = res.data.product;
      } catch (err) {
        this.showToast({
          title: err.response?.data?.message || '發生錯誤，請稍後再試',
          icon: 'error',
        });
      }

      this.isLoading = false;
    },

    ...mapActions(cartStore, ['addToCart']),
  },

  mounted() {
    this.getProductDetails();
  },

  mixins: [swalMixin],
};
</script>
