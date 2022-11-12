<template>
  <div>
    <div class="headbar">
      <el-button type="primary" @click="openAdd">+ 新增</el-button>
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
      <el-table-column prop="phone" label="电话号码" width="300" align="center">
      </el-table-column>
      <el-table-column prop="idNumber" label="身份证号" width="300" align="center">
      </el-table-column>
      <el-table-column prop="acName" label="居住小区" width="120" align="center">
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" :active-value="1"
            :inactive-value="0" @change="update(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope)" type="text" size="small">编辑</el-button>
          <el-button @click="remove(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page"
      :page-size="pageSize" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper"
      :total="counts">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 1,  //当前页数
      pageSize: 5,  //每页显示的条数
      counts: 0,  //数据总数
      tableData: [], //用户数据
      input: '',
      loading: true
    }
  },
  // mounted() {
  //   this.getResident()
  // },
  created() {
    this.getResident()
  },
  methods: {
    //分页模糊查询
    getResident() {
      this.axios.get('/user/page', {
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
    handleClick(row) {
      console.log(row);
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
    openAdd() {

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
    }
  },
  watch:{
    tableData(){
      this.$nextTick(()=>{
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