<template>
  <div>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column fixed="left" label="序号" type="index" align="center" width="80">
      </el-table-column>
      <el-table-column label="申请人" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>姓名: {{ scope.row.residentName }}</p>
            <p>手机号: {{ scope.row.residentPhone }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.residentName }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="物资名称" prop="suppliesName" align="center">
      </el-table-column>
      <el-table-column label="数目" align="center">
        <template slot-scope="scope">
          <el-tag type="info">{{ scope.row.number }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="居住小区" prop="acName" align="center">
      </el-table-column>
      <el-table-column label="家庭住址" prop="address" align="center">
      </el-table-column>
      <el-table-column label="审批状态" align="center">
        <i class="el-icon-warning"> 未审批</i>
      </el-table-column>
      <el-table-column label="申请时间" align="center" width="300">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.applyTime }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="small" @click="handleApprove(scope.row.id)">审批</el-button>
        </template>
      </el-table-column>
      <div slot="empty">
        <el-empty description="暂无数据"></el-empty>
      </div>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page"
      :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="counts">
    </el-pagination>

    <!-- 审批对话框 -->
    <el-dialog title="审批" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" :model="dialogData">
      <div class="choice">
        <el-radio v-model="dialogData.status" :label="1" border>通过</el-radio>
        <el-radio v-model="dialogData.status" :label="2" border>驳回</el-radio>
      </div>
      <div class="content" v-if="dialogData.status === 2">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 8 }" placeholder="请输入驳回理由"
          v-model="dialogData.reply">
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      page: 1,
      pageSize: 8,
      counts: 0,
      queryId: 0,
      dialogVisible: false,
      dialogData: {},
      loading: true
    }
  },
  created() {
    this.queryId = undefined
    this.getAll()
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    getAll() {
      this.axios.get('/suppliesApply/page', {
        params: {
          page: this.page,
          pageSize: this.pageSize,
          userId: this.queryId ? this.queryId : undefined,
          status: 0
        }
      })
        .then(res => {
          if (res.data.code === 1) {
            this.tableData = res.data.data.records || []
            this.counts = res.data.data.total
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done();
        })
        .catch(() => { });
    },
    //打开审批对话框
    handleApprove(id) {
      this.dialogVisible = true
      this.axios.get('/suppliesApply/' + id)
        .then(res => {
          this.dialogData = res.data.data
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    //提交审批
    submit() {
      this.dialogVisible = false
      this.axios.put('/suppliesApply', this.dialogData)
        .then(res => {
          if (res.data.code === 1) {
            this.$message.success(res.data.data)
            this.getAll()
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    }
  },
  watch: {
    tableData() {
      this.$nextTick(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.el-form-item {
  padding-left: 60px;
}

.el-icon-warning {
  color: #E6A23C;
}

.el-icon-success {
  color: #67C23A;
}

.el-icon-error {
  color: #F56C6C;
}

.el-pagination {
  margin-top: 10px;
}

.choice {
  padding-left: 20px;
}

.content {
  padding: 20px;
}
</style>