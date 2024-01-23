import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';

export default {
  data() {
    return {
      modal: null,
    };
  },
  methods: {
    showModal() {
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },
};
