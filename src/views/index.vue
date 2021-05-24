<template>
<div id="manage" v-loading="loading">
  <div class="app-logo-box">
      <!-- <img src="@/assets/img/g7_logo.png" alt=""> -->
      <span>后台管理</span>

  </div>
  <div class="app-wrapper">
    <div :class="['app-side', {'app-side-fold': isSideFold}]">
      <div class="app-menu-box">
         <el-menu
          :collapse="isSideFold"
          :default-active="defaultActiveMenu"
          background-color="#001529"
          text-color="#fff"
          active-text-color="#ffd04b"
          :router="true">

          <el-menu-item index="/classfiy">
              <i class="iconfont icon-gongyezujian-yibiaopan"></i>
              <span slot="title">分类管理</span>
          </el-menu-item>
          <el-menu-item index="/course">
              <i class="iconfont icon-gongyezujian-yibiaopan"></i>
              <span slot="title">课程管理</span>
          </el-menu-item>
          <el-menu-item index="/evaluation">
                <i class="iconfont icon-gongyezujian-yibiaopan"></i>
                <span slot="title">用户评价</span>
            </el-menu-item>
        </el-menu>
      </div>
    </div>
    <div class="app-main">
      <div class="app-main-content" :style="{minHeight: minheight()}"><router-view/></div>
    </div>
  </div>
</div>
</template>

<script>

export default {
  name:"index",
  data() {
    return {
      isSideFold:false,
      loading:false,
      defaultActiveMenu: '/index',
    };
  },
  mounted() {

   
  },
  methods: {
    setSideFold() {
      this.isSideFold = !this.isSideFold;
    },
    minheight() {
      return `${window.screen.height - 235}px`;
    },
  },
};
</script>

<style lang="scss">
.home-wrapper{
  background-color: #FFF;
  padding: 40px;
  > h2{
    margin-top: 20px;
  }
  .home-card-row{
    overflow: hidden;
    padding: 20px 0;
    .home-card{
      display: inline-block;
      width: 200px;
      padding: 30px;
      text-align: center;
      background-color: #f9f9f9;
      border-radius: 10px;
      margin-right: 20px;
      .home-card-num{
        font-size: 34px;
        padding: 20px 0;
        &.color-agree{
          color: #4dc34d;
        }
        &.color-handling{
          color: #5a9fff;
        }
        &.color-refuse{
          color: #d1d4da;
        }
      }
      .home-card-intro{
        font-size: 18px;
        color: #999;
      }
    }
  }
}
</style>
