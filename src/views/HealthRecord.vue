<template>
  <div>
    <div class="headbar">
      <div>
        <el-button class="clearButton" @click="clear">清除过滤</el-button>
        <el-input class="search" prefix-icon="el-icon-search" placeholder="请输入姓名" v-model="input" clearable
          @keyup.enter.native="handleQuery">
        </el-input>
      </div>
      <div class="date-filter">
        <el-date-picker v-model="time" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" :picker-options="pickerOptions">
        </el-date-picker>
      </div>
    </div>
    <div class="form">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="真实姓名">
                <span>{{ props.row.residentName }}</span>
              </el-form-item>
              <el-form-item label="电话号码">
                <span>{{ props.row.residentPhone }}</span>
              </el-form-item>
              <el-form-item label="居住小区">
                <span>{{ props.row.acName }}</span>
              </el-form-item>
              <el-form-item label="体温状态">
                <el-tag type="success" v-if="props.row.temperature === 0">正常</el-tag>
                <el-tag type="danger" v-if="props.row.temperature === 1">异常</el-tag>
              </el-form-item>
              <el-form-item label="新冠症状">
                <el-tag type="success" v-if="props.row.symptom === 0">无</el-tag>
                <el-tag type="danger" v-if="props.row.symptom === 1">有</el-tag>
              </el-form-item>
              <el-form-item label="健康码颜色">
                <el-tag type="success" v-if="props.row.healthColor === 0">绿码</el-tag>
                <el-tag type="warning" v-if="props.row.healthColor === 1">黄码</el-tag>
                <el-tag type="danger" v-if="props.row.healthColor === 2">红码</el-tag>
                <el-tag type="info" v-if="props.row.healthColor === 3">弹框</el-tag>
                <el-tag v-if="props.row.healthColor === 4">其他</el-tag>
              </el-form-item>
              <el-form-item label="行程卡状态">
                <el-tag type="success" v-if="props.row.route === 0">正常</el-tag>
                <el-tag type="danger" v-if="props.row.route === 1">异常</el-tag>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index">
        </el-table-column>
        <el-table-column label="姓名" align="center" width="300px">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>姓名: {{ scope.row.residentName }}</p>
              <p>电话号码: {{ scope.row.residentPhone }}</p>
              <p>居住小区: {{ scope.row.acName }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.residentName }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="数据状态" align="center" width="200px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.temperature === 0">正常</el-tag>
            <el-tag type="danger" v-if="scope.row.temperature === 1">异常</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="居住小区" prop="acName" align="center">
        </el-table-column>
        <el-table-column label="填报时间" align="center" width="300">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.submitTime }}</span>
          </template>
        </el-table-column>
        <div slot="empty">
          <el-empty description="暂无数据"></el-empty>
        </div>
      </el-table>
    </div>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page"
      :page-size="pageSize" :total="counts" layout="total, prev, pager, next, jumper">
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
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      time: '',
      input: '',
      loading: true,
    }
  },
  created() {
    this.getRecord()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.getRecord()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getRecord()
    },
    getRecord() {
      this.axios.get('/healthInfo/page', {
        params: {
          page: this.page,
          pageSize: this.pageSize,
          userId: undefined,
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
    clear() {
      this.input = ''
      this.getRecord()
    },
    handleQuery() {
      this.page = 1
      this.getRecord()
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

<style lang="less">
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

.el-pagination {
  margin-top: 10px;
}

</style>