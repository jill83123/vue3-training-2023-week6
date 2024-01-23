<template>
  <nav
    class="navbar navbar-expand-lg bg-white bg-opacity-25"
    style="box-shadow: rgb(0 0 0 / 3%) 1px 1px 6px 0px"
  >
    <div class="container">
      <a class="navbar-brand fw-light fs-5" style="letter-spacing: 0.08rem" href="#"
        >FLOS
        <span class="fw-bold" style="font-family: 'Segoe UI Symbol'; font-size: 1.35rem">✿ </span>
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0 d-flex gap-4" style="font-size: 15px">
          <li class="nav-item">
            <RouterLink class="nav-link" aria-current="page" to="/product">商品列表</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/cart" class="nav-link"> 購物車 </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style lang="scss">
.router-link-active {
  font-weight: 800;
  &::after{
    content: ' ⁺₊';
  }
}
</style>
