import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

const swalMixin = {
  methods: {
    showToast({ icon, title }) {
      Swal.fire({
        icon,
        title,
        toast: true,
        position: 'top',
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
        width: 'auto',
      });
    },

    showCheck({ title, text, fn }) {
      Swal.fire({
        icon: 'question',
        title,
        text,
        showCancelButton: true,
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          fn();
        }
      });
    },
  },
};

export default swalMixin;
