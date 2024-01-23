/* eslint-disable camelcase */

import { defineStore } from 'pinia';
import axios from 'axios';
import swalMixin from '@/mixins/swalMixin';

const cartStore = defineStore('cart', {
  state: () => ({
    cartList: [],
    isLoading: false,
    currentLoadingId: '',
    temp: { couponCode: '' },
    orderInfo: { user: {}, message: '' },
  }),

  actions: {
    async getCartList() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_API_PATH}/cart`,
        );
        this.cartList = res.data.data;
      } catch (err) {
        swalMixin.methods.showToast({
          title: err.response?.data?.message || '發生錯誤，請稍後再試',
          icon: 'error',
        });
      }
    },

    async addToCart(product_id, qty = 1) {
      this.currentLoadingId = product_id;

      const data = {
        product_id,
        qty,
      };

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_API_PATH}/cart`,
          { data },
        );
        swalMixin.methods.showToast({
          title: res.data.message,
          icon: 'success',
        });
      } catch (err) {
        swalMixin.methods.showToast({
          title: err.response?.data?.message || '發生錯誤，請稍後再試',
          icon: 'error',
        });
      }

      this.currentLoadingId = '';
    },

    async putCartItem(cart_id, product_id, qty) {
      if (qty <= 0) {
        const index = this.cartList.carts.findIndex((item) => item.id === cart_id);
        this.cartList.carts[index].qty = 1;
        swalMixin.methods.showToast({
          title: '請輸入大於 0 的數字',
          icon: 'error',
        });
        return;
      }

      const data = {
        product_id,
        qty,
      };

      try {
        const res = await axios.put(
          `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_API_PATH}/cart/${cart_id}`,
          { data },
        );

        this.getCartList();

        swalMixin.methods.showToast({
          title: res.data.message,
          icon: 'success',
        });
      } catch (err) {
        swalMixin.methods.showToast({
          title: err.response?.data?.message || '發生錯誤，請稍後再試',
          icon: 'error',
        });
      }
    },

    async deleteCartItem(id) {
      this.currentLoadingId = id;

      try {
        const res = await axios.delete(
          `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_API_PATH}/cart/${id}`,
        );

        this.getCartList();

        swalMixin.methods.showToast({
          title: res.data.message,
          icon: 'success',
        });
      } catch (err) {
        swalMixin.methods.showToast({
          title: err.response?.data?.message || '發生錯誤，請稍後再試',
          icon: 'error',
        });
      }

      this.currentLoadingId = '';
    },

    async deleteCartAll() {
      try {
        const res = await axios.delete(
          `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_API_PATH}/carts`,
        );

        this.cartList = [];

        swalMixin.methods.showToast({
          title: res.data.message,
          icon: 'success',
        });
      } catch (err) {
        swalMixin.methods.showToast({
          title: err.response?.data?.message || '發生錯誤，請稍後再試',
          icon: 'error',
        });
      }
    },

    async postOrder() {
      if (!this.cartList.carts || this.cartList.carts.length <= 0) {
        swalMixin.methods.showToast({
          title: '購物車目前沒有商品',
          icon: 'warring',
        });
        return;
      }

      const data = this.orderInfo;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_API_PATH}/order`,
          { data },
        );

        this.cartList = [];
        this.orderInfo = { user: {}, message: '' };
        this.temp.couponCode = '';

        swalMixin.methods.showToast({
          title: res.data.message,
          icon: 'success',
        });
      } catch (err) {
        swalMixin.methods.showToast({
          title: err.response?.data?.message || '發生錯誤，請稍後再試',
          icon: 'error',
        });
      }
    },

    async applyCoupon(code) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_API_PATH}/coupon`,
          { data: { code } },
        );

        this.getCartList();

        swalMixin.methods.showToast({
          title: res.data.message,
          icon: 'success',
        });
      } catch (err) {
        swalMixin.methods.showToast({
          title: err.response?.data?.message || '發生錯誤，請稍後再試',
          icon: 'error',
        });
      }
    },
  },
});

export default cartStore;
