<template>
  <div>
    <div class="headbar">
      <el-button type="primary" @click="openAdd">+ 新增</el-button>
      <!-- 对话框 -->
      <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" @close="closeEdit">
        <el-form label-position="right" label-width="80px" :model="dialogData" :rules="rules" ref="dialogData">
          <el-form-item label="用户名" prop="username" autocomplete="off">
            <el-input v-model="dialogData.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" v-if="!type" >
            <el-input v-model="dialogData.password"></el-input>
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
          <el-form-item label="状态">
            <el-switch v-model="dialogData.status" active-color="#13ce66" inactive-color="#ff4949" :active-value="1"
              :inactive-value="0">
            </el-switch>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeEdit">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>

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
      <el-table-column prop="phone" label="电话号码" width="210" align="center">
      </el-table-column>
      <el-table-column prop="idNumber" label="身份证号码" width="300" align="center">
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" :active-value="1"
            :inactive-value="0" @change="update(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="remove(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page"
      :page-size="pageSize" :page-sizes="[8, 15, 20, 25]" layout="total, sizes, prev, pager, next, jumper"
      :total="counts">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    //用户名查重
    var validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('用户名不能为空'))
      } else {
        this.axios.get('/user/check?username=' + value)
          .then(res => {
            if (res.data.code === 0) {
              callback(new Error(res.data.msg))
            }
          })
      }
    }

    return {
      page: 1,  //当前页数
      pageSize: 8,  //每页显示的条数
      counts: 0,  //数据总数
      tableData: [], //用户数据
      input: '',  //输入条件
      loading: true, //加载状态
      dialogVisible: false,  //对话框可见
      dialogData: {}, //对话框数据
      region: '',  //小区信息
      title: '',  //对话框标题
      type: '', //类型（0新增/1修改）
      rules: {
        username: [
          { validator: validateUsername, trigger: 'blur' }
        ]
      },

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
      this.axios.get('/user/page/1', {
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
    //打开编辑对话框
    handleEdit(row) {
      this.type = 1
      this.dialogVisible = true
      this.title = '编辑员工信息'
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
    //改变每页显示数据
    handleSizeChange(val) {
      this.pageSize = val
      this.getResident()
    },
    //更改页数
    handleCurrentChange(val) {
      this.page = val
      this.getResident()
    },
    //删除
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
    //条件查询
    handleQuery() {
      this.page = 1
      this.getResident()
    },
    //清楚过滤
    clear() {
      this.input = ''
      this.getResident()
    },
    //更新
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
    //关闭编辑对话框
    closeEdit() {
      this.dialogVisible = false
      this.dialogData = {}

    },
    //打开新增对话框
    openAdd() {
      this.type = 0
      this.dialogVisible = true
      this.title = '新增员工'
    },
    //提交
    submit() {
      this.dialogVisible = false
      //修改
      if (this.type === 1) {
        this.axios.put('/user', this.dialogData)
          .then(res => {
            if (res.data.code === 1) {
              this.$message.success(res.data.data)
            }
          })
          .catch(err => {
            this.$message.error(err)
          })
      } else if (this.type === 0) {
        this.axios.post('/user', this.dialogData)
          .then(res => {
            if (res.data.code === 1) {
              this.$message.success(res.data.data)
            }
          })
          .catch(err => {
            this.$message.error(err)
          })
      }
      this.getResident()
    },
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