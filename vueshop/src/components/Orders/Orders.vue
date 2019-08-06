<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
      
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input v-model="queryInfo.query">
            <el-button type="info" icon="el-icon-search" slot="append"></el-button>
          </el-input>
        </el-col>
      </el-row>


    <el-table :data="ordersList" style="width: 100%" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="order_number" label="订单编号"></el-table-column>
      <el-table-column prop="order_price" label="订单价格" width="180"></el-table-column>
      <el-table-column label="是否付款">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.pay_status == '0'">未付款</el-tag>
          <el-tag type="primary" v-else>已付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{scope.row.create_time | dateformat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showAddressDialog"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showWuliuDialog"></el-button>
          </template>
        </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5,10,20,40]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>


    <el-dialog
  title="修改地址"
  :visible.sync="addressDialogVisible"
  width="50%" @close="addressClosed">
  
<el-form ref="addressFormRef" :model="addressForm" label-width="80px">
  <el-form-item label="省市区/县" prop="address1">
    <el-cascader
    v-model="addressForm.address1"
    :options="cityData"
    :props="{ expandTrigger: 'hover' }"></el-cascader>
  </el-form-item>
  <el-form-item label="详细地址" prop="address2">
    <el-input v-model="addressForm.address2"></el-input>
  </el-form-item>
</el-form>
  
  <span slot="footer" class="dialog-footer">
    <el-button @click="addressDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
  </span>
</el-dialog>


<el-dialog title="物流进度" :visible.sync="wuliuDialogVisible" width="50%">
  <el-timeline :reverse="true">
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
</el-dialog>
  </div>
</template>
<script>
import cityData from './citydata'
export default {
  created() {
    this.getOrdersList()
  },
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      ordersList: [],
      addressDialogVisible: false,
      wuliuDialogVisible: false,
      addressForm:{
        address1:[],
        address2:''
      },
      cityData,
      progressInfo:[]
    };
  },
  methods:{
    async getOrdersList() {
      const {data:res} = await this.$http.get('orders', {params: this.queryInfo})
      this.ordersList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(size) {
      this.queryInfo.pagesize = size
      this.getOrdersList()
    },
    handleCurrentChange(page) {
      this.queryInfo.pagenum = page
      this.getOrdersList()
    },
    showAddressDialog() {
      this.addressDialogVisible = true
    },
    addressClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    async showWuliuDialog() {
      const {data:res} = await this.$http.get('/kuaidi/1106975712662')
      console.log(res);
      
      this.progressInfo = res.data
      this.wuliuDialogVisible = true
    }
  }
}
</script>
<style lang='less' scoped>
  .el-cascader{
    width: 100%;
  }
</style>