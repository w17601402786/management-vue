<template>
  <div>

    <el-card class="box-card">
    <div class="current-week">
      <h1>当前第{{ week }}周</h1>
    </div>
    <el-table 
      :span-method="arraySpanMethod"
      :data="tableData" 
      style="width: 100%"
      border>
      <el-table-column prop="time" label="节次"></el-table-column>
      <el-table-column v-for="day in 7" :key="day" :label=" dayList[day%7]" >
        <template slot-scope="{ row }">
          <template v-if="row[day]">
            <el-card class="course-card" :style="{ backgroundColor: getRandomColor() }">
              <div class="course-name" :style="{ color: getFontColor()}">{{ row[day].courseInfo.name }}</div>
                <div class="course-info">
                  <div class="teacher">{{ row[day].teacher.name }}</div>
                  <div class="location">{{ row[day].location }}</div>
                </div>  
            </el-card>
          </template>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
  </div>
</template>
<script>
import axios from 'axios';


// 生成随机字体颜色
function getRandomFontColor(bgColor) {
      // 将背景颜色转换为 RGB 格式
      let rgb = bgColor.match(/\d+/g);
      let r = parseInt(rgb[0]);
      let g = parseInt(rgb[1]);
      let b = parseInt(rgb[2]);
      // 根据亮度计算字体颜色
      let brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness >= 128 ? '#000' : '#fff';
}

export default {
  data() {
    return {
      colors: [
        { backgroundColor: '#f56a00', fontColor: getRandomFontColor('#f56a00') },
        { backgroundColor: '#7265e6', fontColor: getRandomFontColor('#7265e6') },
        { backgroundColor: '#ffbf00', fontColor: getRandomFontColor('#ffbf00') },
        { backgroundColor: '#00a2ae', fontColor: getRandomFontColor('#00a2ae') },
      ],
      courseSchedule: [], // 课程表数据
      startTime: 1, // 课程表起始时间
      endTime: 12, // 课程表结束时间
      tableData: [], // 表格数据
      week: 1, // 当前周数
      dayList: ['周日','周一', '周二', '周三', '周四', '周五', '周六', ],
      colorIndex:0
    };
  },
  mounted() {
    axios.get('/student/courseScheduleInfo').then(response => {
      this.courseSchedule = response.data.data;
      this.tableData = this.getTableData();
    });
    axios.get('/config/config').then(response => {
      this.week = response.data.data.week;
    });
  },
  methods: {
    getTableData() {
      const data = [];
      for (let i = this.startTime; i <= this.endTime; i++) {
        const row = { time: i };
        for (let j = 1; j <= 7; j++) {
          
          const course = this.courseSchedule.find(item => 
            (1<<(j-1) & item.day)!== 0
            && (1<<(this.week-1) & item.week) !== 0
            && item.startTime <= i 
            && item.endTime >= i
          );
          row[j] = course;
        }
        data.push(row);
      }


      for(let j=1; j<=7; j++) {

        let lastCourse = null;
        for(let i=this.startTime; i<=this.endTime; i++) {
          const course = data[i-this.startTime][j];

          if (course && lastCourse && course.day === lastCourse.day && course.courseInfo.id === lastCourse.courseInfo.id && course.location === lastCourse.location) {
          
            course = null;
            data[i-this.startTime][j] = null;
          }
          if(course) {
            lastCourse = course;
          }
        }
      }

      return data;
    },
    getRandomColor() {
      // const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
      this.colorIndex = Math.floor(Math.random() * this.colors.length);
      this.colorIndex = (this.colorIndex+1)% this.colors.length;
      return this.colors[this.colorIndex].backgroundColor;
    },
    getFontColor(){
      return this.colors[this.colorIndex].fontColor;
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {

      //获取当前单元格的数据
      const currentRow = this.tableData[rowIndex];
      const current = currentRow[columnIndex];

      if(!current){
        return {
          rowspan: 1,
          colspan: 1,
        };
      }else{
        return {
          rowspan: current.endTime - current.startTime + 1,
          colspan: 1,
        };
      }
    }
  }
};
</script>
<style>
.current-week {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .course-table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.course-table th,
.course-table td {
  text-align: center;
  padding: 8px;
  border: 1px solid #ccc;
}

.course-table th {
  background-color: #f5f5f5;
}

.course-card {
  width: 100%;
  height: 100%;
  padding: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.course-card:hover {
  background-color: #a6d8ef !important;
}

.course-name {
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 8px;
}

.course-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.teacher {
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 4px;
}

.location {
  font-size: 14px;
  color: #ffffff;
}
</style>