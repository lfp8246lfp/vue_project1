<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button type="primary" @click="showCateDialog">添加分类</el-button>
      <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true" index-text="#" border :show-row-hover="false">
        <template slot="isok" slot-scope="scope">
        <i class="el-icon-error" v-if="scope.row.cat_deleted"></i>
        <i class="el-icon-success" v-else></i>
      </template>
      <template slot="order" slot-scope="scope">
        <el-tag type="success" v-if="scope.row.cat_level === 0">一级</el-tag>
        <el-tag type="warning" v-else-if="scope.row.cat_level === 1">二级</el-tag>
        <el-tag type="danger" v-else>三级</el-tag>
      </template>
      <template slot="opt">
        <el-button type="primary" icon="el-icon-edit">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete">删除</el-button>
      </template>
      </tree-table>

      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="paramsInfo.pagenum"
      :page-sizes="[3,5,10]"
      :page-size="paramsInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>


    <el-dialog title="添加分类" :visible.sync="addCatedialogFormVisible" width="50%" @close="resetAddForm">
  <el-form :model="addCateForm" label-width="100px" ref="addFormRef">
    <el-form-item label="分类名称" prop="cat_name">
      <el-input v-model="addCateForm.cat_name"></el-input>
    </el-form-item>
    <el-form-item label="父级分类">
      <el-cascader
    v-model="cateIds"
    :options="parentCateList"
    :props="cateProps"
    @change="handleChange" clearable></el-cascader>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="addCatedialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveCate">确 定</el-button>
  </div>
</el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getCate()
  },
  data () {
    return {
      paramsInfo: {
        type: 3,
        pagenum:1,
        pagesize:5
      },
      cateList: [],
      total:0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addCatedialogFormVisible: false,
      addCateForm: {
        cat_name:'',
        cat_pid:0,
        cat_level:0
      },
      addFormRules: {
        cateName: [
          {required:true,message:'请输入分类名称',trigger:'blur'}
        ]
      },
      parentCateList: [],
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        checkStrictly: true
      },
      cateIds: []
    };
  },
  methods:{
    async getCate() {
      let {data:res} = await this.$http.get('categories',{
        params:this.paramsInfo
      })
      this.cateList = res.data.result
      this.total = res.data.total
      console.log(this.cateList);
    },
    handleSizeChange(size) {
      this.paramsInfo.pagesize = size
      this.getCate()
    },
    handleCurrentChange(page) {
      this.paramsInfo.pagenum = page
      this.getCate()
    },
    async showCateDialog() {
      let {data: res} = await this.$http.get('categories', {params:{type: 2}})
      this.parentCateList = res.data
      
      this.addCatedialogFormVisible = true
    },
    handleChange() {
      if (this.cateIds.length === 0) {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      } else {
        //cat_pid是父级的id
        this.addCateForm.cat_pid = this.cateIds[this.cateIds.length - 1]
        this.addCateForm.cat_level = this.cateIds.length
      }
      console.log(this.addCateForm);
    },
    saveCate() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        let {data: res} = await this.$http.post('categories', this.addCateForm)
        this.$message.success('添加成功')
        this.addCatedialogFormVisible = false
        this.getCate()
      })
    },
    resetAddForm() {
      this.$refs.addFormRef.resetFields()
      this.cateIds = []
    }
  }
}
</script>
<style lang='less' scoped>
  .el-cascader {
    width: 100%;
  }
</style>