<template>
  <div>
    <el-card class="search">
      <el-row>
        <el-col :span="20">
          <el-input
            clearable
            placeholder="用户名"
            v-model="searchModel.username"
          ></el-input>
          <el-input
            clearable
            placeholder="电话"
            v-model="searchModel.phone"
          ></el-input>
          <el-button type="primary" @click="getUserList">查询</el-button>
        </el-col>
        <el-col :span="4" align="right">
          <el-button
            type="primary"
            icon="el-icon-plus"
            circle
            @click="openEditUI(null)"
          ></el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-card>
      <el-table :data="userList" stripe style="width: 100%">
        <el-table-column label="#" width="100" align="center">
          <template slot-scope="scope">
            {{
              (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="用户ID"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="电话"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="eamil"
          label="电子邮件"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="avatar"
          label="头像"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="150"
          align="center"
        >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1">正常</el-tag>
          <el-tag type="danger" v-else-if ="scope.row.status == 0">禁用</el-tag>
          <el-tag type="warning" v-else>未知异常</el-tag>
        </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150"
          align="center"
        >
        <template slot-scope="scope">
          <el-button @click="openEditUI(scope.row.id)" size="mini" type="primary" icon="el-icon-edit"></el-button>
          <el-button @click="deleteUser(scope.row)" size="mini" type="danger" icon="el-icon-delete"></el-button>
        </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchModel.pageNo"
      :page-sizes="[5, 10, 50, 100]"
      :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <el-dialog
      @close="clearForm"
      :title="title"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="userForm" :rules="rules" ref="userFormRef">
        <el-form-item
          prop="username"
          label="用户名"
          :label-width="formLabelWidth"
        >
          <el-input v-model="userForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          prop="password"
          label="密码"
          :label-width="formLabelWidth"
        >
          <el-input
            type="password"
            v-model="userForm.password"
            autocomplete="off"
            :disabled="userForm.id"
          ></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="电话" :label-width="formLabelWidth">
          <el-input v-model="userForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="avatar" label="头像" :label-width="formLabelWidth">
          <el-input v-model="userForm.avatar" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          prop="eamil"
          label="电子邮件"
          :label-width="formLabelWidth"
        >
          <el-input v-model="userForm.eamil" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="状态" :label-width="formLabelWidth">
          <el-switch
            v-model="userForm.status"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userApi from "@/api/userManage";
export default {
  data() {
    return {
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10,
      },
      userList: [],
      title: "",
      dialogFormVisible: false,
      formLabelWidth: "130px",
      userForm: {},
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { ming: 3, max: 50, message: "长度在3-50个字符", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { ming: 11, max: 11, message: "长度在11个字符", trigger: "blur" },
        ],
        eamil: [
          { required: true, message: "请输入电子邮件", trigger: "blur" },
          { ming: 6, max: 15, message: "长度在6-15个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          // { ming: 6, max: 6, message: "长度在6个字符", trigger: "blur" },
        ],
        avatar: [
          { required: true, message: "请输入头像", trigger: "blur" },
          // { ming: 6, max: 6, message: "长度在6个字符", trigger: "blur" },
        ]
      },
    };
  },
  methods: {
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getUserList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getUserList();
    },
    getUserList() {
      this.userList = [];
      userApi.getUserList(this.searchModel).then((response) => {
        console.log("response=", response);
        this.userList = response.data.rows;
        this.total = response.data.total;
      });
    },
    openEditUI(id) {
      if(id==null){
        this.title = "新增用户";
        this.dialogFormVisible = true;
      }else{
        this.title = "修改用户";
        this.dialogFormVisible = true;
        // 根据id查询用户
        userApi.getUserById(id).then(res => {
          if(res.code == 20000){
            console.log('res===',res)
            this.userForm = res.data
          }
        })
      }
    },
    clearForm() {
      this.userForm = {};
      this.$refs.userFormRef.clearValidate();
    },
    saveUser() {
      // 触发表单验证
      this.$refs.userFormRef.validate((valid) => {
        if (valid) {
          // 验证通过，提交给后台
          userApi.saveUser(this.userForm).then((res) => {
            console.log("res=", res);
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.dialogFormVisible = false;
            this.getUserList()
          });
        } else {
          this.$message({
              message: '新增失败！',
              type: 'warning'
          })
          console.log("error submit!!");
          return false;
        }
      });

      // 处理请求方法
    },
    deleteUser(user){
      console.log('user==',user)
      this.$confirm(`此操作将永久删除用户${user.username}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((a) => {
          userApi.deleteUserById(user.id).then(res => {
            console.log('res',res)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
          this.getUserList()
        }).catch((b) => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },
  created() {
    this.getUserList();
  },
};
</script>

<style>
.search .el-input {
  width: 200px;
  margin-right: 10px;
}
.el-dialog .el-form-item {
  width: 80%;
}
</style>