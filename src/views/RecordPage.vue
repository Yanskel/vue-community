<template>
  <div>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="驳回原因：">
              <span>{{ props.row.reply }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index" align="center">
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
      <el-table-column label="物资名称" prop="suppliesName" align="center" width="200">
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
        <template slot-scope="scope">
          <i v-if="scope.row.status === 0" class="el-icon-warning"> 未审批</i>
          <i v-if="scope.row.status === 1" class="el-icon-success"> 通过</i>
          <i v-if="scope.row.status === 2" class="el-icon-error"> 驳回</i>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.applyTime }}</span>
        </template>
      </el-table-column>
      <div slot="empty">
        <el-empty description="暂无数据"></el-empty>
      </div>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page"
      :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="counts">
    </el-pagination>
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
          status: -1
        }
      })
        .then(res => {
          if(res.data.code === 1){
            this.tableData = res.data.data.records || []
            this.counts = res.data.data.total
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

<style scoped>
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
</style>