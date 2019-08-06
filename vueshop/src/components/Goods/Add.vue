<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon center :closable="false"></el-alert>

      <el-steps :space="500" :active="+active" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
      <el-tabs tab-position="left" v-model="active" :before-leave="beforeLeave" @tab-click="tabClick">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader v-model="goods_cat" :options="cateList" :props="cateProp" @change="handleChange"></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox :label="item1" v-for="(item1,index) in item.attr_vals" :key="index"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload class="upload-demo" action="http://localhost:8888/api/private/v1/upload" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headersObj" :on-success="handleSuccess">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor v-model="addForm.introduce"></quill-editor>
          <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
      </el-form>
    </el-card>

    <el-dialog title="预览" :visible.sync="previewDialogVisible" width="50%" center>
      <img :src="previewSrc" alt="" width="100%">
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  created() {
    this.getCateList()
  },
  data () {
    return {
      active: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat:'',
        pics: [],
        introduce: '',
        attrs:[]
      },
      addFormRules: {
        goods_name: [
          {required:true,message:'请输入商品名称',trigger:'blur'}
        ]
      },
      cateProp: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      goods_cat: [],
      cateList: [],
      manyTableData: [],
      onlyTableData: [],
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewSrc: '',
      previewDialogVisible:false
    };
  },
  methods:{
    async getCateList() {
      let {data:res} = await this.$http.get('categories')
      this.cateList = res.data
    },
    handleChange() {
      console.log(this.goods_cat);
      if(this.goods_cat.length <= 2) {
        this.goods_cat = []
        return
      }
    },
    beforeLeave() {
      if (this.active == '0' && this.goods_cat.length <= 2) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    async tabClick() {
      if (this.active == '1') {
        let {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params:{sel:'many'}})
        

        res.data.forEach(ele => {
          if (ele.attr_vals == '') {
            ele.attr_vals = []
          } else {
            ele.attr_vals = ele.attr_vals.split(' ')
          }
        })
        
        this.manyTableData = res.data
      } else if (this.active == '2') {
        let {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params:{sel:'only'}})
        this.onlyTableData = res.data
      }
    },
    handlePreview(file){
      this.previewSrc = file.response.data.url
      this.previewDialogVisible = true
    },
    handleRemove(file){
      let tmp_path = file.response.data.tmp_path
      let i = this.addForm.pics.findIndex(item => {
        return item.pic === tmp_path
      })
      this.addForm.pics.splice(i, 1)
      
    },
    handleSuccess(response){
      var picObj = {pic:response.data.tmp_path}
      this.addForm.pics.push(picObj)
    },
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('验证失败')
        this.addForm.goods_cat = _.cloneDeep(this.goods_cat)
        this.addForm.goods_cat = this.addForm.goods_cat.join(',')
        this.manyTableData.forEach(item => {
          let newObj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newObj)
        })
        this.onlyTableData.forEach(item => {
          let newObj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newObj)
        })
        
        const {data:res} = await this.$http.post('goods', this.addForm)
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      return this.goods_cat[this.goods_cat.length - 1]
    }
  }
}
</script>
<style lang='less' scoped>
.el-steps{
  margin-top: 15px;
}
</style>