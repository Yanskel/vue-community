<template>
  <div>
    <el-button type="primary" @click="openSubmit">+ 申请物资</el-button>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="驳回原因" class="reason">
              <span>{{ props.row.reply }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index">
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

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="物资名称">
          <el-select v-model="form.suppliesId" placeholder="请选择物资">
            <el-option v-for="s in supplies" :key="s.id" :label="s.name" :value="s.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物资数量">
          <el-input-number v-model="form.number" :min="1" :max="10" label="描述文字"></el-input-number>
        </el-form-item>
      </el-form>
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
      loading: true,
      userInfo: '',
      dialogVisible: false,
      form: {
        suppliesId: '',
        number: 1,
      },
      supplies:[]
    }
  },
  created() {
    this.queryId = undefined
    this.getAll()
  },
  mounted() {
    this.getSupplies()
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    getAll() {
      const userInfo = localStorage.getItem('userInfo')
      this.userInfo = JSON.parse(userInfo)
      this.axios.get('/suppliesApply/page', {
        params: {
          page: this.page,
          pageSize: this.pageSize,
          userId: this.userInfo.id,
          status: -1
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
    openSubmit() {
      this.dialogVisible = true
    },
    onSubmit() {
      console.log('submit!');
    },
    getSupplies(){
      this.axios.get('/supplies')
      .then(res => {
        if(res.data.code === 1){
          this.supplies = res.data.data
        }
      })
      .catch(err => {
        this.$message.error(err)
      })
    },
    submit(){
      this.dialogVisible = false
      this.axios.post('/suppliesApply',this.form)
      .then(res => {
        if(res.data.code === 1){
          this.$message.success(res.data.data)
          this.getAll()
        }else{
          this.$message.error("提交失败")
        }
        this.form = {}
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

.el-button {
  margin-bottom: 20px;
}

.reason{
  padding-left: 60px;
}
</style>