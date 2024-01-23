function debounce(fn, delay = 500) {
  if (this.debounceTimer != null) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = null;
  }

  this.debounceTimer = setTimeout(() => {
    fn.call(this);
  }, delay);
}

export default debounce;
