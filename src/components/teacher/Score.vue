<template>
  <div>
    <el-card class="box-card">
      <h1 style="text-align: center;">所授课程</h1>
      <el-input v-model="searchText" placeholder="请输入搜索关键字"></el-input>
      <el-table :data="paginatedData" :empty-text="emptyText">
        <!-- 内嵌一个新的表格 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <inner-table style="width:96%;margin-left: 4%;"  :table-data="props.row.children"></inner-table>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="课程名称"></el-table-column>
        <el-table-column prop="hours" label="学时" sortable></el-table-column>
        <el-table-column prop="credit" label="学分" sortable></el-table-column>
      </el-table>
      <el-row type="flex" class="row-bg"  justify="center">
        <el-col>
          <el-pagination
            background
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>

import InnerTable from './components/InnerTable.vue'



export default {
  components: {
    InnerTable
  },
  data() {
    return {
      scoreList: [],
      treeData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchText: '',
      emptyText: '正在加载',
    };
  },
  async created() {
    await this.fetchScoreData();
    this.treeData = this.formatTreeData(this.scoreList);
    this.total = this.treeData.length;
  },
  methods: {
    async fetchScoreData(keyword = '') {
      const { data } = await this.$http.get(`/teacher/gradeInfo?courseId=&keyword=${keyword}`);

      if (data.code === 200) {
        this.scoreList = data.data;
        if (this.scoreList.length === 0) {
          this.emptyText = '暂无数据';
        }
      } else {
        this.$message.error('获取课程信息失败');
        this.scoreList = [];
        this.emptyText = '暂无数据';
      }
    },
    formatTreeData(scoreList) {
      const groupedData = _.groupBy(scoreList, 'courseId');
      const treeData = [];
      for (const courseId in groupedData) {
        const courseInfo = groupedData[courseId][0].courseInfo;
        const children = groupedData[courseId].map((item) => {
          return {
            id: item.id,
            studentId: item.studentId,
            score: item.score,
            studentInfo: item.studentInfo,
          };
        });
        treeData.push({
          id: courseInfo.id,
          name: courseInfo.name,
          hours: courseInfo.hours,
          credit: courseInfo.credit,
          children,
        });
        
      }
      return treeData;
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  },
  computed: {
    paginatedData() {
      const filteredData = this.treeData.filter((item) => {
        return item.name.includes(this.searchText);
      });
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return filteredData.slice(startIndex, endIndex);
    },
  },
};
</script>

<style scoped>
</style>