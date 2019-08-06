<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input v-model="paramsInfo.query" clearable @clear="getGoodsList()" @keyup.enter.native="getGoodsList()">
            <el-button class="el-icon-search" slot="append" @click="getGoodsList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <router-link to="/goods/add">
            <el-button type="primary">添加商品</el-button>
          </router-link>
          
        </el-col>
      </el-row>


      <el-table :data="goods">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column prop="add_time" label="创建时间">
          <template slot-scope="scope">
            {{scope.row.add_time | dateformat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="warning" size="mini" icon="el-icon-delete" @click="del(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>


      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="paramsInfo.pagenum"
      :page-sizes="[3,5,10,20]"
      :page-size="paramsInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
      this.getGoodsList()
    },
  data () {
    return {
      paramsInfo: {
        query:'',
        pagenum:1,
        pagesize:10
      },
      goods:[],
      total:0
    };
  },
  methods:{
    async getGoodsList() {
      let {data:res} = await this.$http.get('goods', {params:this.paramsInfo})
      this.total = res.data.total
      this.goods = res.data.goods
      console.log(this.goods);
    },
    handleSizeChange(pages) {
      this.paramsInfo.pagesize = pages
      this.getGoodsList()
    },
    handleCurrentChange(page) {
      this.paramsInfo.pagenum = page
      this.getGoodsList()
    },
    async del(id) {
      await this.$http.delete('goods/' + id)
      this.getGoodsList()
    }
  }
}
</script>
<style lang='less' scoped>
  
</style>