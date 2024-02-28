<template>
  <div>
    <div style="margin: 10px 20px;">
      <el-upload
        class="upload-demo"
        action="http://localhost:9999/import/excel"
        :show-file-list="false"
        :on-success="handleSeccess"
        :before-upload="beforeUpload"
      >
        <el-button size="small" type="primary">数据导入</el-button>
      </el-upload>
    </div>

    <el-card class="search">
      <el-row>
        <el-col :span="20">
          <el-input
            clearable
            placeholder="调查船"
            v-model="searchModel.shipname"
          ></el-input>
          <el-input
            clearable
            placeholder="海域"
            v-model="searchModel.oceanfield"
          ></el-input>
          <el-input
            clearable
            placeholder="样品编号"
            v-model="searchModel.code"
          ></el-input>
          <el-button type="primary" @click="getexcelList">查询</el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-card>
      <el-table :data="excelList" stripe style="width: 100%">
        <el-table-column prop="id" label="序号" align="center">
        </el-table-column>
        <el-table-column
          prop="code"
          label="样品编号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="shipname"
          label="调查船"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="shipnumber"
          label="航次"
          align="center"
        ></el-table-column>
        <el-table-column label="详细位置" align="center">
          <el-table-column
            prop="oceanfield"
            label="海域"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="stand"
            label="站位"
            align="center"
          ></el-table-column>
          <el-table-column prop="xcoordinate" label="X坐标" align="center">
          </el-table-column>
          <el-table-column prop="ycoordinate" label="Y坐标" align="center">
          </el-table-column>
          <el-table-column prop="address" label="详细地址" align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column prop="depth" label="结束深度" align="center">
        </el-table-column>
        <el-table-column prop="xinlength" label="心长" align="center">
        </el-table-column>
        <el-table-column prop="ataddress" label="存放位置" align="center">
        </el-table-column>
        <el-table-column prop="status" label="保存状况" align="center">
        </el-table-column>
        <el-table-column prop="mark" label="备注" align="center">
        </el-table-column>
        <!-- <el-table-column
          label="操作"
          width="150"
          align="center"
        >
        <template slot-scope="scope">
          <el-button @click="openEditUI(scope.row.id)" size="mini" type="primary" icon="el-icon-edit"></el-button>
          <el-button @click="deleteUser(scope.row)" size="mini" type="danger" icon="el-icon-delete"></el-button>
        </template>
        </el-table-column> -->
      </el-table>
    </el-card>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchModel.pageNo"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  data() {
    return {
      searchModel: {
        pageNo: 1,
        pageSize: 10,
      },
      excelList: [],
      total: 0
    };
  },
  methods: {
    getexcelList() {
      request({
        url: "/excel/list",
        method: "post",
        data: this.searchModel,
      }).then((res) => {
        this.excelList = res.data.list
        this.total = res.data.total
        console.log("res=", this.excelList);
      });
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getexcelList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getexcelList();
    },
    // getUserList() {
    //   this.userList = [];
    //   userApi.getUserList(this.searchModel).then((response) => {
    //     console.log("response=", response);
    //     this.userList = response.data.rows;
    //     this.total = response.data.total;
    //   });
    // },
    handleSeccess(res, file, fileList) {
      console.log("res1=", res);
      this.getexcelList();
    },
    beforeUpload(file) {
      console.log('file', file);
      return true;
    },
  },
  created() {
    this.getexcelList()
  }
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