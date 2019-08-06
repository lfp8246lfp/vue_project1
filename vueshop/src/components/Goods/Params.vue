<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="看什么看" type="warning" show-icon></el-alert>
      <div style="margin-top:30px;">
        <span>选择商品分类：</span>
        <el-cascader v-model="cateParent" :options="cateList" :props="cateProps" clearable @change="parentChange"></el-cascader>
      </div>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态属性" name="many">
          <el-button type="primary" :disabled="isDisabled" @click="addDialogVisible = true">添加属性</el-button>
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="item.id" closable style="margin:10px;" @close="handleClose(index,scope.row)">{{item}}</el-tag>
                <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" size="small" ref="saveTagInput" @keyup.enter.native="handleInputConfirm(scope.row)" @blur.native="handleInputConfirm(scope.row)"></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template  slot-scope="scope">
                <el-button type="primary" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" :disabled="isDisabled" @click="addDialogVisible = true">添加参数</el-button>

          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="item.id" closable style="margin:10px;" @close="handleClose(index,scope.row)">{{item}}</el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" size="small" ref="saveTagInput" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>


    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="resetAddForm">
  <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="活动名称" prop="attrName">
    <el-input v-model="addForm.attrName"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
</el-dialog>

<el-dialog
  :title="'编辑' + titleText"
  :visible.sync="editDialogVisible"
  width="50%" @close="resetEditForm">
  <el-form :model="editForm" :rules="editRules" ref="editForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="活动名称" prop="attrName">
    <el-input v-model="editForm.attrName"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    this.getCateList()
  },
  data () {
    return {
      cateList: [],
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      cateParent:[],
      activeName: 'many',
      manyTableData:[],
      onlyTableData:[],
      addDialogVisible: false,
      addForm: {
        attrName:''
      },
      addRules: {
        attrName:[ {required:true,message:'请输入用户邮箱',trigger:'blur'}]
      },
      editDialogVisible: false,
      editForm: {
        attrName:'',
        attrId: 0
      },
      editRules: {
        attrName: [
          {required:true,message:'请输入用户邮箱',trigger:'blur'}
        ]
      }
    };
  },
  methods:{
    async getCateList() {
      let {data:res} = await this.$http.get('categories')
      this.cateList = res.data
    },
    async parentChange() {
      if(this.cateParent.length !== 3) {
        this.cateParent =[]
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      let{data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: this.activeName}})

      for (let i = 0; i < res.data.length; i++) {
        res.data[i].inputVisible = false
        res.data[i].inputValue = ''
        res.data[i].attr_vals = res.data[i].attr_vals ? res.data[i].attr_vals.split(' ') : []
      }

      if (this.activeName === 'only') {
        this.onlyTableData = res.data
      } else {
        this.manyTableData = res.data
      }
    },
    handleClick() {
      this.parentChange()
    },
    resetAddForm() {
      this.$refs.addForm.resetFields()
    },
    addParams() {
      this.$refs.addForm.validate(async valid=> {
        if (!valid)return
        let {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`, {attr_name: this.addForm.attrName,attr_sel:this.activeName})
        console.log(res);
        this.handleClick()
        this.addDialogVisible = false
      })
    },
    async showEditDialog(id){
        let {data: res} = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {params: {attr_sel: this.activeName}})
        this.editForm.attrName = res.data.attr_name
        this.editForm.attrId = res.data.attr_id
        this.editDialogVisible = true
    },
    resetEditForm(){
        this.$refs.editForm.resetFields()
    },
    editParams(){
      this.$refs.editForm.validate(async valid=>{
        let {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attrId}`,{attr_name:this.editForm.attrName,attr_sel:this.activeName})
      this.editDialogVisible = false
      this.handleClick()
      })
      
    },
    async removeParams(id){
          let {data:res} =  await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
          this.handleClick()
        },
    async handleInputConfirm(row) {
      if (row.inputValue.trim() === '') {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputVisible = false
      row.inputValue = ''
      let {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ')})
      this.$message.success('添加成功')
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(()=> {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async handleClose(i,row) {
      row.attr_vals.splice(i,1)
      let {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ')})
      this.$message.success('删除成功')
    }
  },
  computed: {
    isDisabled() {
      return this.cateParent.length != 3
    },
    cateId() {
      return this.cateParent[this.cateParent.length - 1]
    },
    titleText() {
      if (this.activeName === 'only') {
        return '静态参数'
      } else {
        return '动态属性'
      }
    }
  }
}
</script>
<style lang='less' scoped>
  
</style>