<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary">添加角色</el-button>

      <el-table :data="rolesList" style="width: 100%" border stripe>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row :gutter="20" v-for="item1 in scope.row.children" :key="item1.id" class="row1">
              <el-col :span="6">
                <el-tag closable @close="delRight(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                  <el-row :gutter="20" v-for="item2 in item1.children" :key="item2.id" class="row2">
                      <el-col :span="8">
                        <el-tag type="success" closable @close="delRight(scope.row, item2.id)">{{item2.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <el-col :span="16">
                          <el-tag v-for="item3 in item2.children" :key="item3.id" type="warning" closable @close="delRight(scope.row, item3.id)">{{item3.authName}}</el-tag>
                      </el-col>
                  </el-row>
              </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column label="角色操作" width="300px">
        <template slot-scope="scope">
          <el-button type="primary" class="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" class="el-icon-delete" size="mini">删除</el-button>
          <el-button type="warning" class="el-icon-setting" size="mini" @click="showRightDialog(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-card>



    <el-dialog title="分配权限" :visible.sync="rightDialogVisible" width="50%">

      <el-tree :data="rightsList" :props="defaultProps" show-checkbox default-expand-all node-key="id" :default-checked-keys="checkedRights" ref="tree"></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    this.getRoles()
  },
  data () {
    return {
      rolesList:[],
      rightsList:[],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      rightDialogVisible: false,
      checkedRights: [],
      id: 0
    };
  },
  methods:{
    async getRoles() {
      let {data: res} = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('请求失败')
      this.rolesList = res.data
    },
    async delRight(role, rightId) {
      let {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      role.children = res.data
    },
    async showRightDialog(row) {
      this.rightDialogVisible = true
      let {data: res} = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('请求失败')
      this.rightsList = res.data
      this.id = row.id


      let myArr = []
      function getIdArr(arr) {
        arr.forEach(ele => {
          if (ele.children) {
            getIdArr(ele.children)
          } else {
            myArr.push(ele.id)
          }
        })
      }
      getIdArr(row.children)
      this.checkedRights = myArr
    },
    async saveRights() {
      let rids = [...this.$refs.tree.getHalfCheckedKeys(), ...this.$refs.tree.getCheckedKeys()].join(',')
      let {data: res} = await this.$http.post(`roles/${this.id}/rights`, {rids})
      this.rightDialogVisible = false
      this.getRoles()
    }
  }
}
</script>
<style lang='less' scoped>
  .el-table{
    margin-top: 15px;
  }
  .el-tag {
    margin: 5px;
  }
  .el-row {
    display: flex;
    align-items:center;
  }
  .row1 {
      
      border-bottom: 1px solid #eee;
      &:first-of-type {
        border-top: 1px solid #eee;
      }
  }
  .row2 {
      border-bottom: 1px solid #eee;
      &:last-of-type {
        border-bottom: none;
      }
  }
</style>