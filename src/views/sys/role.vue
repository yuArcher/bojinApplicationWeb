<template>
  <div>
    <el-card class="search">
      <el-row>
        <el-col :span="20">
          <el-input
            clearable
            placeholder="角色名"
            v-model="searchModel.roleName"
            style="width: 150px; margin-right: 10px"
          ></el-input>
          <el-input
            clearable
            placeholder="角色等级"
            v-model="searchModel.roleDesc"
            style="width: 150px; margin-right: 10px"
          ></el-input>
          <el-button type="primary" @click="getRoleList">查询</el-button>
          <el-button type="primary" @click="resetRoleList">重置</el-button>
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
      <el-table :data="roleList" stripe style="width: 100%">
        <el-table-column label="#" width="100" align="center">
          <template slot-scope="scope">
            {{
              (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="roleId"
          label="角色ID"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色等级"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              @click="openEditUI(scope.row.roleId)"
              size="mini"
              type="primary"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              @click="deleterole(scope.row)"
              size="mini"
              type="danger"
              icon="el-icon-delete"
            ></el-button>
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
      <el-form :model="roleForm" :rules="rules" ref="roleFormRef">
        <!-- <el-form-item
          prop="roleId"
          label="角色ID"
          :label-width="formLabelWidth"
          v-if="!!roleForm.roleId"
        >
          <el-input v-model="roleForm.roleId" autocomplete="off" :disabled="!!roleForm.roleId"></el-input>
        </el-form-item> -->
        <el-form-item
          prop="roleName"
          label="角色名"
          :label-width="formLabelWidth"
        >
          <el-input v-model="roleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          prop="roleDesc"
          label="角色等级"
          :label-width="formLabelWidth"
        >
          <el-input
            type="roleDesc"
            v-model="roleForm.roleDesc"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import roleApi from "@/api/roleManage";
export default {
  data() {
    return {
      searchModel: {
        pageNo: 1,
        pageSize: 5,
      },
      roleList: [],
      total: 0,
      roleForm: {},
      dialogFormVisible: false,
      title: "",
      formLabelWidth: "130px",
      rules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          { min: 3, max: 50, message: "长度在3-50个字符", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色等级", trigger: "blur" },
          { min: 3, max: 50, message: "长度在3-50个字符", trigger: "blur" },
        ],
        roleId: [
          { required: true, message: "请输入角色等级", trigger: "blur" },
          { min: 1, max: 99999, message: "大小为0-99999", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getRoleList();
  },
  methods: {
    /**查询列表 */
    getRoleList() {
      this.roleList = [];
      roleApi.getRoleList(this.searchModel).then((res) => {
        console.log("res=", res);
        this.roleList = res.data.list;
        this.total = res.data.total[0];
      });
    },

    /**重置 */
    resetRoleList() {
      (this.searchModel.roleName = ""), (this.searchModel.roleDesc = "");
      this.getRoleList();
    },

    /**分页 */
    handleSizeChange(pageSize) {
      console.log("pageSize", pageSize);
      this.searchModel.pageSize = pageSize;
      this.getRoleList();
    },
    handleCurrentChange(pageNo) {
      console.log("pageNo", pageNo);
      this.searchModel.pageNo = pageNo;
      this.getRoleList();
    },

    /**编辑 */
    openEditUI(id) {
      console.log("id=", id);
      if (!id) {
        this.title = "新增角色";
        this.dialogFormVisible = true;
      } else {
        roleApi.getRoleListById(id).then(res => {
          console.log('res', res)
          this.roleForm = res.data
        })
        this.title = "修改角色";
        this.dialogFormVisible = true;

      }
    },

    /** 清空表单*/
    clearForm() {
      this.roleForm = {};
      this.$refs.roleFormRef.clearValidate();
    },

    /**表单验证后请求处理 */
    saveRole() {
      this.$refs.roleFormRef.validate((valid) => {
        if (valid) {
          roleApi.saveRole(this.roleForm).then((res) => {
            console.log("res=", res);
            if (res.code == 20000) {
              this.$message({
                message: res.message,
                type: "success",
              });
            }
            this.dialogFormVisible = false;
            this.getRoleList();
          });
        } else {
          this.$message({
            message: res.message,
            type: "warning",
          });
          return false;
        }
      });
    },

    /**根据roleId删除数据 */
    deleterole(data){
      console.log('data===',data)
      this.$confirm(`此操作将永久删除${data.roleName}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          roleApi.deleteRoleById(data.roleId).then(res => {
            console.log('res=',res)
            this.$message({
              type: 'success',
              message: res.message
            });
            this.getRoleList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });

    }
  },
};
</script>

<style>
</style>