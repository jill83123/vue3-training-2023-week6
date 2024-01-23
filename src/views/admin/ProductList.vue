<template>
  <Loading v-model:active="isLoading"></Loading>

  <div class="container pt-5" style="height: calc(100vh - 170px)">
    <h2>商品列表</h2>
    <div class="text-end">
      <button class="btn btn-primary" style="font-size: 14px" @click="openModal('new')">
        建立新的產品
      </button>
    </div>

    <div class="p-2 mt-4 bg-white bg-opacity-75 rounded-2">
      <table class="table table-hover" style="--bs-table-bg: transparent">
        <thead>
          <tr>
            <th width="120">分類</th>
            <th>產品名稱</th>
            <th width="120">原價</th>
            <th width="120">售價</th>
            <th width="100">是否啟用</th>
            <th width="120">編輯</th>
          </tr>
        </thead>
        <tbody v-if="!isLoading">
          <tr v-for="product in products" :key="product.id" class="align-middle">
            <td class="py-2">{{ product.category }}</td>
            <td>
              <img
                :src="product.imageUrl"
                style="width: 30px; height: 30px; object-fit: cover"
                v-if="product.imageUrl"
              />
              <p class="d-inline ms-2 align-middle">{{ product.title }}</p>
            </td>
            <td>{{ product.origin_price }}</td>
            <td>{{ product.price }}</td>
            <td>
              <span v-if="product.is_enabled" class="text-success">啟用</span>
              <span v-else>未啟用</span>
            </td>
            <td>
              <div class="btn-group">
                <button type="button" class="btn btn-sm" @click="openModal('edit', product)">
                  編輯
                </button>
                <button type="button" class="btn btn-sm" @click="openModal('del', product)">
                  <span class="text-danger">刪除</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <Pagination :pagination="pagination" @change-page="getProducts"></Pagination>

  <p class="text-center text-secondary my-5" v-if="!products && !isLoading">沒有商品</p>

  <!-- Modal -->
  <Product-Modal
    ref="productModal"
    :product="tempProduct"
    :is-new-product="isNewProduct"
    @update="updateProduct"
  ></Product-Modal>

  <Del-Modal ref="delModal" :product="tempProduct" @delete="deleteProduct"></Del-Modal>
</template>

<script>
import swalMixin from '@/mixins/swalMixin';

import Pagination from '@/components/admin/Pagination.vue';
import ProductModal from '@/components/admin/ProductModal.vue';
import DelModal from '@/components/admin/DelModal.vue';

export default {
  data() {
    return {
      products: {},
      tempProduct: {},
      isNewProduct: false,
      isLoading: true,
      currentModal: null,
      pagination: {},
    };
  },

  methods: {
    async getProducts(page = 1) {
      this.isLoading = true;

      try {
        const res = await this.axios.get(
          `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_API_PATH}/admin/products/?page=${page}`,
        );
        this.products = res.data.products;
        this.pagination = res.data.pagination;
      } catch (err) {
        this.showToast({
          title: err.response?.data?.message || '發生錯誤，請稍後再試',
          icon: 'error',
        });
      }

      this.isLoading = false;
    },

    openModal(action, product) {
      this.tempImgUrl = '';
      this.isNewProduct = action === 'new';

      if (action === 'edit' || action === 'del') {
        this.tempProduct = JSON.parse(JSON.stringify(product));
      } else if (action === 'new') {
        this.tempProduct = {};
      }
      this.currentModal = 'productModal';

      if (action === 'del') {
        this.currentModal = 'delModal';
      }

      this.$refs[this.currentModal].showModal();
    },

    async updateProduct(product) {
      const { id } = product;
      const data = product;

      let api = `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_API_PATH}/admin/product`;
      let methods = 'post';

      if (!this.isNewProduct) {
        api += `/${id}`;
        methods = 'put';
      }

      try {
        const res = await this.axios[methods](api, { data });

        this.getProducts();
        this.$refs[this.currentModal].hideModal();

        swalMixin.methods.showToast({
          title: res.data.message,
          icon: 'success',
        });
      } catch (err) {
        const message = (err.response?.data?.message || []).join(' 、 ');
        this.showToast({
          title: message || '發生錯誤，請稍後再試',
          icon: 'error',
        });
      }
    },

    async deleteProduct(product) {
      const { id } = product;

      try {
        const res = await this.axios.delete(
          `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_API_PATH}/admin/product/${id}`,
        );

        this.getProducts();
        this.$refs[this.currentModal].hideModal();

        swalMixin.methods.showToast({
          title: res.data.message,
          icon: 'success',
        });
      } catch (err) {
        this.showToast({
          title: err.response?.data?.message || '發生錯誤，請稍後再試',
          icon: 'error',
        });
      }
    },
  },

  mounted() {
    this.getProducts();
  },

  mixins: [swalMixin],

  components: { Pagination, ProductModal, DelModal },
};
</script>
