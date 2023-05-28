<template>
  <div>

    <el-card class="box-card">
    <el-input v-model="searchText" placeholder="请输入搜索关键字" @input="handleSearch"></el-input>
    <el-table :data="pagedCourseList" style="width: 100%">
      <el-table-column type="expand" >
        <template slot-scope="props">
          
          <el-descriptions style="margin-top: 2%; margin-left: 4%;" v-if="props.row.scoreList" >
            <el-descriptions-item label="成绩">
              <el-tag size="small">{{ props.row.scoreList.score }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
          <el-descriptions style="margin-top: 2%; margin-left: 4%;" v-else >
            <el-descriptions-item label="成绩">
              <el-tag size="small">暂无成绩</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column sortable prop="courseId" label="课程编号"></el-table-column>
      <el-table-column sortable prop="name" label="课程名称"></el-table-column>
      <el-table-column sortable prop="hours" label="学时"></el-table-column>
      <el-table-column sortable prop="credit" label="学分"></el-table-column>
      
    </el-table>
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      @current-change="handlePageChange"
    ></el-pagination>
    </el-card>
  </div>
  
</template>

<script>
export default {
  data() {
    return {
      courseList: [],
      pagedCourseList: [],
      searchText: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
    };
  },
  async created() {
    await this.fetchCourseData();
    await this.fetchScoreData();
  },
  methods: {
    async fetchCourseData() {
      const { data } = await this.$http.get("/student/courseInfo");

      if (data.code === 200) {
        // 将数据分页
        const pageCount = Math.ceil(data.data.length / this.pageSize);
        for (let i = 0; i < pageCount; i++) {
          this.courseList.push(data.data.slice(i * this.pageSize, (i + 1) * this.pageSize));
        }
        this.total = data.data.length;
        this.pagedCourseList = this.courseList[this.currentPage - 1];
      } else {
        this.$message.error("获取课程信息失败");
      }
    },
    async fetchScoreData(){
      const { data } = await this.$http.get("/student/scoreInfo");

      if (data.code === 200) {
        let scoreList = data.data;
        scoreList.forEach(score => {
          this.courseList.forEach(course1 => {
            course1.forEach(course => {
              if (score.courseId == course.courseId) {
                course.scoreList = score;
              }else if(!course.scoreList){
                course.scoreList = null;
              }
            });
          });
        });

      } else {
        this.$message.error("获取课程信息失败");
      }

      console.log(this.courseList);

    },
    
    handleSearch() {
      this.currentPage = 1;
      this.pagedCourseList = this.courseList[this.currentPage - 1].filter(course => {
        return course.name.includes(this.searchText) || course.courseId.includes(this.searchText);
      });
      this.total = this.pagedCourseList.length;
    },
    handlePageChange(currentPage) {
      this.currentPage = currentPage;
      this.pagedCourseList = this.courseList[this.currentPage - 1].filter(course => {
        return course.name.includes(this.searchText) || course.courseId.includes(this.searchText);
      });
    },
  },
};
</script>

<style scoped>
</style>

