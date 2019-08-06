<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="rightsList" style="width: 100%" stripe border>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="authName" label="权限名称">
      </el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column label="权限等级">
        <template slot-scope="scope">
          <el-tag :type="tags[scope.row.level].type">{{tags[scope.row.level].text}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getRights()
  },
  data () {
    return {
      rightsList:[],
      tags: {
        0: {
          type:'success',
          text:'一级'
        },
        1: {
          type:'warning',
          text:'二级'
        },
        2: {
          type:'info',
          text:'三级'
        }
      }
    };
  },
  methods:{
    async getRights() {
      let {data:res} = await this.$http.get('rights/list')
      this.rightsList = res.data
    }
  }
}
</script>
<style lang='less' scoped>
  
</style>