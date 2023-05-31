<template>
  <div>
    <el-card class="box-card">
      <h1 style="text-align: center;">学生成绩</h1>
      <el-row>
        <el-col :span="6">
          <el-select  clearable v-model="selectedCourse" placeholder="选择课程" @change="changeCourse" style="margin-right: 10px;">
              <el-option v-for="course in courses" :key="course.courseId" :label="course.name" :value="course.courseId">
                  <span style="float: left">{{ course.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ course.courseId }}</span>
              </el-option>
          </el-select>
        </el-col>
        <el-col :offset="15" :span="1">
          <el-button type="primary" @click="drawer = true">AI分析</el-button>
        </el-col>
      </el-row>
      <inner-table  :table-data="scoreList"></inner-table>
      <el-drawer
        title="AI成绩分析"
        :visible.sync="drawer"
        size="45%">
        <ai-analysis :score-list="scoreList"></ai-analysis>
      </el-drawer>

      <div ref="chart" style="height: 400px;"></div>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios';
import InnerTable from './components/InnerTable.vue';
import AiAnalysis from './components/AIAnalysis.vue';

import * as echarts from 'echarts';



export default {
  components: {
    InnerTable,
    AiAnalysis,
  },
  data() {
    return {
      drawer: false,
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
  mounted() {
    
    this.renderChart();
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
        this.renderChart();
      });
    },
    renderChart() {
      const chart = echarts.init(this.$refs.chart);
      const scoreList = this.scoreList.map(item => item.score);

      const scoreRanges = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // initialize score ranges
      for (let i = 0; i < scoreList.length; i++) {
        const score = scoreList[i];
        if (score === null) {
          continue;
        }
        const rangeIndex = Math.floor(score / 10); // calculate the range index
        if (rangeIndex >= scoreRanges.length) {
          scoreRanges[scoreRanges.length - 1]++; // add to the last range if the score is greater than or equal to 100
        } else {
          scoreRanges[rangeIndex]++; // add to the corresponding range
        }
      }
      const option = {
        title: {
          text: '成绩区间占比',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
          show: true,
          right: 10,
          orient: 'vertical',
        },
        series: [
          {
            name: '成绩区间',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: scoreRanges[0], name: '0-9分' },
              { value: scoreRanges[1], name: '10-19分' },
              { value: scoreRanges[2], name: '20-29分' },
              { value: scoreRanges[3], name: '30-39分' },
              { value: scoreRanges[4], name: '40-49分' },
              { value: scoreRanges[5], name: '50-59分' },
              { value: scoreRanges[6], name: '60-69分' },
              { value: scoreRanges[7], name: '70-79分' },
              { value: scoreRanges[8], name: '80-89分' },
              { value: scoreRanges[9], name: '90-100分' },
            ],
          },
        ],
      };
      
      chart.setOption(option);
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
