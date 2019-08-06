<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="getUsers">
          <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="16">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="usersList" :border="true">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" active-color="pink" inactive-color="green" @change="changeState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑用户" placement="top-start">
            <el-button type="primary" class="el-icon-edit" size="mini" @click="showEdit(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除角色" placement="top-start">
            <el-button type="danger" class="el-icon-delete" size="mini" @click="del(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start">
            <el-button type="warning" class="el-icon-setting" size="mini" @click="showRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1,2,3,5]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>

<el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @closed="reset">
  <el-form label-width="80px" :model="addForm" :rules="addFormRules" ref="addFormRef">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="addForm.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="addForm.password"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="addForm.email"></el-input>
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input v-model="addForm.mobile"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button @click="add" type="primary">确 定</el-button>
  </span>
</el-dialog>


<el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%">
  <el-form label-width="80px" :model="editForm" :rules="addFormRules" ref="editFormRef">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="editForm.username" disabled></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="editForm.email"></el-input>
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input v-model="editForm.mobile"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button @click="edit" type="primary">确 定</el-button>
  </span>
</el-dialog>


<el-dialog title="分配角色" :visible.sync="roleDialogVisible" width="50%" @close="resetDialog">
  <p>当前的用户：{{this.roleInfo.username}}</p>
  <p>当前的角色：{{this.roleInfo.role_name}}</p>
  <p>分配新角色：
    <el-select v-model="selectedRoleId" placeholder="请选择">
      <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
    </el-select>
  </p>
  
  <span slot="footer" class="dialog-footer">
    <el-button @click="roleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRole">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    this.getUsers()
  },
  data () {
    let checkEmail = (rule, value, callback) => {
        let reg = /^\d{3}$/
        if (!reg.test(value)) {
          return callback(new Error('邮箱写错了'))
        } else {
          return callback()
        }
      }
      let checkMobile = (rule, value, callback) => {
        let reg = /^\d{3}$/
        if (!reg.test(value)) {
          return callback(new Error('号码写错了'))
        } else {
          return callback()
        }
      }
    return {
      queryInfo: {
        query:'',
          //查询关键字
        pagenum: 1,
          //当前页
        pagesize: 2
          //每一页的数据条数
      },
      usersList:[],
      total: 0,
        //数据总条数
      addDialogVisible: false,
      editDialogVisible: false,
      roleDialogVisible: false,
      addForm: {
        username:'',
        password:'',
        email:'',
        mobile:'',
      },
      editForm: {
        username:'',
        mobile:'',
        email:''
      },
      addFormRules:{
        username:[
          {required:true, message:'请输入用户名', trigger:'blur'}
        ],
        password:[
          {required:true, message:'请输入密码', trigger:'blur'}
        ],
        email:[
          {required:true, message:'请输入邮箱', trigger:'blur'},
          {validator: checkEmail, trigger:'blur'}
        ],
        mobile:[
          {required:true, message:'请输入手机号码', trigger:'blur'},
          {validator: checkMobile, trigger:'blur'}
        ]
      },
      id: 0,
      roleInfo: {},
      roleList: {},
      selectedRoleId:''
    }
  },
  methods:{
    async getUsers() {
      let {data: res} = await this.$http.get('users', {params: this.queryInfo})
      if (res.meta.status !== 200) return this.$message.error('找不到')
      this.total = res.data.total
      this.usersList = res.data.users
    },
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize
      this.getUsers()
    },
    handleCurrentChange(page) {
      this.queryInfo.pagenum = page
      this.getUsers()
    },
    async changeState(row) {
      let {data:res} = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
      if (res.meta.status !== 200) return this.$message.error('修改失败')
      this.$message.success('修改成功')
    },
    reset() {
      this.$refs.addFormRef.resetFields()
    },
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        let {data: res} = await this.$http.post('users', this.addForm)
        
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.addDialogVisible = false
        this.getUsers()
      })
    },
    del(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let {data:res} = await this.$http.delete('users/' + id)
            if (res.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除成功')
            this.getUsers()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    async showEdit(id) {
      this.id = id
      this.editDialogVisible = true
      const {data:res} =  await this.$http.get('users/'+ id)
      this.editForm = res.data
    },
    async edit() {
      let {data: res} = await this.$http.put('users/'+this.id, {email: this.editForm.email, mobile: this.editForm.mobile})
      if (res.meta.status !== 200) return this.$message.error('编辑失败')
      this.$message.success('编辑成功')
      this.getUsers()
      this.editDialogVisible = false
    },
    async showRole(row) {
      this.roleDialogVisible = true
      this.roleInfo = row
      let {data: res} = await this.$http.get('roles')
      this.roleList = res.data
    },
    async saveRole() {
      let {data: res} = await this.$http.put(`users/${this.roleInfo.id}/role`, {rid: this.selectedRoleId})
      this.roleDialogVisible = false
      this.getUsers()
    },
    resetDialog() {
      this.selectedRoleId = ''
      this.roleInfo = {}
    }
  }
}
</script>
<style lang='less' scoped>
</style>