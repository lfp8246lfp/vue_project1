<template>
<el-container class="container">
  <el-header class="header">
    <div class="logo">
      <img src="../assets/logo.png" alt="">
      <h1>电商后台管理系统</h1>
    </div>
    <el-button type="info" @click="logout">退出登录</el-button>
  </el-header>
  <el-container>
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <div @click="collapse" class="collapse">| | | | |</div>
      <el-menu background-color="#333744" text-color="#fff" active-text-color="blue" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" :default-active="activePath" router>
      <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
        <template slot="title">
          <i :class="itemIcon[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
          <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveIndex('/' + subItem.path)">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{subItem.authName}}</span>
            </template>
          </el-menu-item>
      </el-submenu>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>
<script>
export default {
  data () {
    return {
      menuList:[],
      itemIcon: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath:''
    };
  },
  methods:{
    logout() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getMenu() {
      const {data:res} = await this.$http.get('menus')
      if(res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    collapse() {
      this.isCollapse = !this.isCollapse
    },
    saveIndex(index){
      this.activePath = index
      sessionStorage.setItem('active', index)
    }
  },
  created: function() {
    this.getMenu()
    this.activePath = window.sessionStorage.getItem('active')
  }
}
</script>
<style lang='less' scoped>
  .container{
    height: 100%;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #373D41;
    color: #fff;
    font-size: 20px;
    .logo {
      display: flex;
      align-items: center;
      h1 {
        margin-left: 10px;
        font-family: '楷体'
      }
    }
  }
  .el-main {
    background-color: #EAEDF1;
  }
  .el-aside {
    background-color: #333744;
  }
  .iconfont {
    margin-right: 10px;
  }
  .el-menu {
    border-right: none;
  }
  .collapse {
    cursor: pointer;
    color: #fff;
    text-align: center;
  }
</style>