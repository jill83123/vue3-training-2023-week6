<template>
  <Loading v-model:active="isLoading"></Loading>

  <div class="container">
    <div class="mt-4 row">
      <!-- 購物車列表 -->
      <div class="text-end mb-3">
        <button
          class="btn border-1 border-dark border-opacity-50"
          type="button"
          @click="
            showCheck({ fn: () => deleteCartAll(), title: '清空購物車', text: '清空後將無法復原' })
          "
          :disabled="!cartList.carts || cartList.carts.length <= 0"
        >
          <span style="font-size: 14px; font-weight: 600">清空購物車</span>
        </button>
      </div>
      <table
        class="table align-middle"
        style="--bs-table-bg: transparent; --bs-table-border-color: #5762874a"
      >
        <thead>
          <tr>
            <th style="width: 200px"></th>
            <th>品名</th>
            <th style="width: 150px">數量/單位</th>
            <th>單價</th>
            <th>小計</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="cartList.carts?.length > 0">
            <tr v-for="cartItem in cartList.carts" :key="cartItem.id">
              <td>
                <button
                  type="button"
                  class="btn"
                  @click="
                    showCheck({
                      fn: () => deleteCartItem(cartItem.id),
                      title: '刪除商品',
                      text: '刪除後將無法復原',
                    })
                  "
                  :disabled="currentLoadingId === cartItem.id"
                >
                  <span class="material-symbols-outlined"> close </span>
                </button>
                <img
                  :src="cartItem.product.imageUrl"
                  :alt="cartItem.product.title"
                  style="max-width: 100px"
                />
              </td>
              <td>
                {{ cartItem.product.title }}
                <div class="text-success" v-if="cartList.total !== cartList.final_total">
                  已套用優惠券
                </div>
              </td>
              <td>
                <div class="input-group input-group-sm">
                  <div class="input-group">
                    <input
                      min="1"
                      type="number"
                      class="form-control"
                      v-model.number="cartItem.qty"
                      @input="
                        debounce(() => putCartItem(cartItem.id, cartItem.product_id, cartItem.qty))
                      "
                    />
                    <span class="input-group-text" id="basic-addon2">{{
                      cartItem.product.unit
                    }}</span>
                  </div>
                </div>
              </td>
              <td class="text-end">{{ cartItem.product.price }}</td>
              <td class="text-end">
                <p class="mb-0" v-if="cartList.total === cartList.final_total">
                  {{ cartItem.total }}
                </p>
                <template v-else>
                  <span class="text-decoration-line-through">{{ cartItem.total }}</span>
                  <br />
                  <small class="text-success">折扣價：{{ cartItem.final_total.toFixed(0) }}</small>
                </template>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="5">
              <p class="text-center my-5">購物車目前沒有商品</p>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4" class="text-end">總計</td>
            <td class="text-end">NT {{ cartList.total }}</td>
          </tr>
          <tr v-if="cartList.total !== cartList.final_total">
            <td colspan="4" class="text-end text-success">折扣價</td>
            <td class="text-end text-success">{{ cartList.final_total.toFixed(0) }}</td>
          </tr>
        </tfoot>
      </table>

      <div class="input-group mb-3 d-flex">
        <input
          type="text"
          class="form-control ms-auto"
          style="max-width: 300px"
          placeholder="請輸入優惠碼"
          aria-label="請輸入優惠碼"
          aria-describedby="button-addon2"
          v-model="temp.couponCode"
        />
        <button
          class="btn btn-primary"
          type="button"
          id="button-addon2"
          @click="applyCoupon(temp.couponCode)"
          :disabled="!temp.couponCode"
        >
          <span class="text-primary-dark" style="font-size: 14px; font-weight: 600"
            >套用優惠券</span
          >
        </button>
      </div>
    </div>

    <div class="my-5 row justify-content-center">
      <v-form
        ref="form"
        class="col-md-6"
        v-slot="{ errors }"
        @submit="
          showCheck({
            fn: () => postOrder(),
            title: '送出訂單',
            text: '請確認訂單內容是否正確',
          })
        "
      >
        <div class="mb-3">
          <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
          <v-field
            id="email"
            name="email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': errors['email'] }"
            placeholder="請輸入 Email"
            rules="required|email"
            v-model="orderInfo.user.email"
          ></v-field>
          <error-message name="email" class="invalid-feedback"></error-message>
        </div>

        <div class="mb-3">
          <label for="name" class="form-label">收件人姓名 <span class="text-danger">*</span></label>
          <v-field
            id="name"
            name="姓名"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors['姓名'] }"
            placeholder="請輸入姓名"
            rules="required"
            v-model="orderInfo.user.name"
          ></v-field>
          <error-message name="姓名" class="invalid-feedback"></error-message>
        </div>

        <div class="mb-3">
          <label for="tel" class="form-label">收件人電話 <span class="text-danger">*</span></label>
          <v-field
            id="tel"
            name="電話"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors['電話'] }"
            placeholder="請輸入電話"
            :rules="{ required: true, regex: /^09\d{2}-?\d{3}-?\d{3}$/ }"
            v-model="orderInfo.user.tel"
          ></v-field>
          <error-message name="電話" class="invalid-feedback"></error-message>
        </div>

        <div class="mb-3">
          <label for="address" class="form-label"
            >收件人地址 <span class="text-danger">*</span></label
          >
          <v-field
            id="address"
            name="地址"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors['地址'] }"
            placeholder="請輸入地址"
            rules="required"
            v-model="orderInfo.user.address"
          ></v-field>
          <error-message name="地址" class="invalid-feedback"></error-message>
        </div>

        <div class="mb-3">
          <label for="message" class="form-label">留言</label>
          <textarea
            id="message"
            class="form-control"
            cols="30"
            rows="10"
            v-model="orderInfo.message"
          ></textarea>
        </div>
        <div class="text-end">
          <button type="submit" class="btn btn-primary text-white">
            <span class="text-primary-dark" style="font-size: 14px; font-weight: 600"
              >送出訂單</span
            >
          </button>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import cartStore from '@/stores/cartStore';
import swalMixin from '@/mixins/swalMixin';
import debounce from '@/utils/debounce';

export default {
  data() {
    return {
      isLoading: false,
    };
  },

  computed: {
    ...mapState(cartStore, ['cartList', 'orderInfo', 'temp', 'currentLoadingId']),
  },

  watch: {
    orderInfo: {
      handler(newValue) {
        if (!newValue.user.email) {
          this.$refs.form.resetForm();
        }
      },
      deep: true,
    },
  },

  methods: {
    ...mapActions(cartStore, [
      'getCartList',
      'putCartItem',
      'deleteCartItem',
      'deleteCartAll',
      'postOrder',
      'applyCoupon',
    ]),

    debounce,
  },

  async mounted() {
    this.isLoading = true;
    await this.getCartList();
    this.isLoading = false;
  },

  mixins: [swalMixin],
};
</script>
