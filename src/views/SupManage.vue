<template>
  <div>
    <el-button class="formDialog" type="primary" @click="openAdd">+ 新增</el-button>
    <!-- 物资对话框 -->
    <el-dialog title="添加新的物资" :visible.sync="dialogVisible" width="30%">
      <el-form label-position="top" label-width="80px" :model="formSupplies">
        <el-form-item label="物资名称">
          <el-input v-model="formSupplies.name"></el-input>
        </el-form-item>
        <el-form-item label="物资数量">
          <el-input v-model="formSupplies.total"></el-input>
        </el-form-item>
        <el-form-item label="物资种类">
          <el-select v-model="formSupplies.categoryId" placeholder="请选择物资种类">
            <el-option v-for="c in category" :key="c.id" :label="c.type" :value="c.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAdd">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <el-button @click="clearFilter">清除所有过滤</el-button>
    <el-table ref="filterTable" :data="supplies" style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="序号" align="center" width="100px">
      </el-table-column>
      <el-table-column prop="name" label="物资名称" align="center" width="300px">
      </el-table-column>
      <el-table-column prop="total" label="总数" align="center" width="300px">
      </el-table-column>
      <el-table-column prop="categoryName" label="种类" :filters="type" :filter-method="filterTag"
        filter-placement="bottom-end" align="center" width="300px">
        <template slot-scope="scope">
          <el-tag :type="colorType(scope.row)" disable-transitions>{{ scope.row.categoryName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="openEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="handelDelte(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
export default {
  name: 'supManage',
  data() {
    return {
      dialogVisible: false, //对话框是否可见
      formSupplies: {      //表单内容
        id: '',
        categoryId: '',
        name: '',
        total: ''
      },
      category: [], //物资种类
      supplies: [], //物资
      type: [   //物资种类
        { text: '医疗物资', value: '医疗物资' },
        { text: '生活物资', value: '生活物资' },
        { text: '食品', value: '食品' }
      ],
      modelType: 0,  // 0新增  1修改 
      loading: true  //页面加载
    }
  },
  created() {
    this.getSupplies()
  },
  mounted() {
    this.getCategory()
  },
  methods: {
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    formatter(row) {
      return row.address;
    },
    filterTag(value, row) {
      return row.categoryName === value;
    },
    colorType(row) {
      if (row.categoryName === '医疗物资') {
        return 'success'
      } else if (row.categoryName === '生活物资') {
        return 'primary'
      } else if (row.categoryName === '食品') {
        return 'danger'
      }
    },
    //获取物资数据
    getSupplies() {
      this.axios.get('/supplies')
        .then(res => {
          if (res.data.code === 1) {
            this.supplies = res.data.data
          }
        })
        .catch(err => {
          this.$message.error(err);
        })
    },
    //获取物资种类
    getCategory() {
      this.axios.get('/category')
        .then(res => {
          if (res.data.code === 1) {
            this.category = res.data.data
          }
        })
        .catch(err => {
          this.$message.error(err);
        })
    },
    //打开新增对话框
    openAdd() {
      this.dialogVisible = true
      this.formSupplies = {}
      this.modelType = 0
    },
    //提交操作
    handleSubmit() {
      this.dialogVisible = false
      if (this.modelType === 0) {
        this.axios.post('/supplies', this.formSupplies)
          .then(res => {
            if (res.data.code === 1) {
              this.$message.success(res.data.data);
              this.getSupplies()
            }
          })
          .catch(err => {
            this.$message.error(err);
          })
      } else if (this.modelType === 1) {
        this.axios.put('/supplies', this.formSupplies)
          .then(res => {
            if (res.data.code === 1) {
              this.$message.success(res.data.data);
              this.getSupplies()
            }
          })
          .catch(err => {
            this.$message.error(err);
          })
      }
      this.formSupplies = {}
    },
    //关闭新增对话框
    closeAdd() {
      this.dialogVisible = false
      this.formSupplies = {}
    },
    //打开编辑对话框
    openEdit(row) {
      this.dialogVisible = true
      this.modelType = 1
      this.axios.get('/supplies/' + row.id)
        .then(res => {
          this.formSupplies = res.data.data
        })
        .catch(err => {
          this.$message.error(err);
        })
    },
    //删除操作
    handelDelte(row) {
      this.$confirm("此操作将永久生效，确认删除？", "提示", {
        type: 'info'
      }).then(() => {
        this.axios.delete('/supplies/' + row.id)
          .then(res => {
            if (res.data.code === 1) {
              this.$message.success(res.data.data);
              this.getSupplies()
            }
          })
          .catch(err => {
            this.$message.error(err);
          })
      })

    }
  },
  watch: {
    supplies() {
      this.$nextTick(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.formDialog {
  margin: 0 20px 20px 0;
}
</style>