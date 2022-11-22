<template>
  <div>
    <div class="headbar">
      <!-- <el-button type="primary" @click="openAdd">+ 新增</el-button> -->

      <el-dialog title="编辑用户信息" :visible.sync="dialogVisible" width="30%">
        <el-form label-position="right" label-width="80px" :model="dialogData">
          <el-form-item label="用户名">
            <el-input v-model="dialogData.username"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input v-model="dialogData.name"></el-input>
          </el-form-item>
          <el-form-item label="电话号码">
            <el-input v-model="dialogData.phone"></el-input>
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="dialogData.idNumber"></el-input>
          </el-form-item>
          <el-form-item label="居住小区" prop="region">
            <el-select v-model="dialogData.acId" placeholder="请选择现居住小区" filterable>
              <el-option v-for="r in region" :key="r.id" :label="r.acName" :value="r.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账号状态">
            <el-switch v-model="dialogData.status" active-color="#13ce66" inactive-color="#ff4949" :active-value="1"
              :inactive-value="0" @change="update(scope.row)">
            </el-switch>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeEdit">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>

      <div>
        <el-button type="success" icon="el-icon-document-add" @click="exportInfo">导出表格</el-button>
      </div>
      <div>
        <el-button class="clearButton" @click="clear">清除过滤</el-button>
        <el-input class="search" prefix-icon="el-icon-search" placeholder="请输入姓名" v-model="input" clearable
          @keyup.enter.native="handleQuery">
        </el-input>
      </div>
      
    </div>
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column fixed type="index" label="序号" width="60" align="center">
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="200" align="center">
      </el-table-column>
      <el-table-column prop="name" label="真实姓名" width="120" align="center">
      </el-table-column>
      <el-table-column prop="phone" label="电话号码" width="198" align="center">
      </el-table-column>
      <el-table-column prop="idNumber" label="身份证号码" width="300" align="center">
      </el-table-column>
      <el-table-column prop="acName" label="居住小区" width="120" align="center">
      </el-table-column>
      <el-table-column label="账号状态" width="100" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" :active-value="1"
            :inactive-value="0" @change="update(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button @click="handleEidt(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="remove(scope.row)" type="danger" size="small">删除</el-button>
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
      page: 1,  //当前页数
      pageSize: 8,  //每页显示的条数
      counts: 0,  //数据总数
      tableData: [], //用户数据
      input: '',  //输入条件
      loading: true, //加载状态
      dialogVisible: false,  //对话框可见
      dialogData: {}, //对话框数据
      region: '',
    }
  },
  mounted() {
    this.axios.get('/apartmentComplex')
      .then(res => {
        this.region = res.data.data
      })
      .catch(err => {
        this.$message.error(err);
      })
  },
  created() {
    this.getResident()
  },
  methods: {
    //分页模糊查询
    getResident() {
      this.axios.get('/user/page/0', {
        params: {
          page: this.page,
          pageSize: this.pageSize,
          name: this.input ? this.input : undefined
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
    handleEidt(row) {
      this.dialogVisible = true
      this.axios.get('/user/' + row.id)
        .then(res => {
          if (res.data.code === 1) {
            this.dialogData = res.data.data
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getResident()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getResident()
    },
    remove(row) {
      this.$confirm("此操作将永久生效，确认删除？", "提示", {
        type: 'info'
      }).then(() => {
        this.axios.delete('/user/' + row.id)
          .then(res => {
            if (res.data.code === 1) {
              this.$message.success(res.data.data)
              this.getResident()
            }
          })
          .catch(err => {
            this.$message.error(err)
          })
      })
    },
    handleQuery() {
      this.page = 1
      this.getResident()
    },
    clear() {
      this.input = ''
      this.getResident()
    },
    update(row) {
      this.axios.put('/user', row)
        .then(res => {
          if (res.data.code === 1) {
            this.$message.success('状态' + res.data.data)
            this.getResident()
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    closeEdit() {
      this.dialogVisible = false
      this.dialogData = {}
    },
    submit() {
      this.dialogVisible = false
      this.axios.put('/user', this.dialogData)
        .then(res => {
          if (res.data.code === 1) {
            this.$message.success(res.data.data)
            this.getResident()
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    exportInfo(){
      this.axios.post('/user/export')
      .then(res => {
        if(res.data.code ===1){
          this.$message.success(res.data.data)
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
.headbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
}

.search {
  width: 200px;
}

.clearButton {
  margin-right: 20px;
}
</style>