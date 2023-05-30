<template>
  <div>
    <el-card class="box-card">
      <h1 style="text-align: center;">学生成绩</h1>
      <el-select clearable v-model="selectedCourse" placeholder="选择课程" @change="changeCourse" style="margin-right: 10px;">
          <el-option v-for="course in courses" :key="course.courseId" :label="course.name" :value="course.courseId">
              <span style="float: left">{{ course.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ course.courseId }}</span>
          </el-option>
      </el-select>
      <inner-table  :table-data="scoreList"></inner-table>
    </el-card>
  </div>
</template>

<script>

import axios from 'axios';
import InnerTable from './components/InnerTable.vue'



export default {
  components: {
    InnerTable
  },
  data() {
    return {
      selectedCourse: null,
      courses: [],
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
    await this.fetchCourseData();
  },
  methods: {
    async fetchCourseData() {
      axios.post('/admin/course/getCourses',{}).then(response => {
            this.courses = response.data.data;
            console.log(this.courses);
       });
    },
    changeCourse() {

      this.fetchScoreData();
    },
    async fetchScoreData() {
      axios.post('/admin/grade/getGrades', {
        courseId: this.selectedCourse,
      }).then(response => {
        this.scoreList = response.data.data;
        //将所有-1的成绩改为null
        for (let i = 0; i < this.scoreList.length; i++) {
          if (this.scoreList[i].score === -1) {
            this.scoreList[i].score = null;
          }
        }
      });
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