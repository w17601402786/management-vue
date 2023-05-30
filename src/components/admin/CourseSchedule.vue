
<template>
    <div>
        <el-card class="box-card">
            <div class="current-week">
                <el-select clearable v-model="selectedCourse" placeholder="选择课程" style="margin-right: 10px;">
                    <el-option v-for="course in courses" :key="course.courseId" :label="course.name" :value="course.courseId">
                        <span style="float: left">{{ course.name }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ course.courseId }}</span>
                    </el-option>
                </el-select>
                <el-select clearable v-model="selectedTeacher" placeholder="选择教师" style="margin-right: 10px;">
                    <el-option v-for="teacher in teachers" :key="teacher.teacherId" :label="teacher.name" :value="teacher.teacherId">
                        <span style="float: left">{{ teacher.name }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ teacher.teacherId }}</span>
                    </el-option>
                </el-select>
                <el-select clearable v-model="selectedClass" placeholder="选择班级" style="margin-right: 10px;">
                    <el-option v-for="clazz in classes" :key="clazz.classId" :label="clazz.major" :value="clazz.classId">
                        <span style="float: left">{{ clazz.major }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ clazz.classId }}</span>
                    </el-option>
                </el-select>
                <el-select clearable filterable allow-create v-model="selectedLocation" placeholder="选择场地"  style="margin-right: 10px;">
                    <el-option v-for="location in locations" :key="location.location" :label="location.location" :value="location.location"></el-option>
                </el-select>
                <el-button type="primary" @click="searchSchedule">查询</el-button>
               
            </div>
            <div class="current-week">
                <h2>第 <el-select v-model="week" placeholder="选择周数" style="width: 80px !important;" @change="changeWeek">
                    <el-option v-for="week in (1,20)" :key="week" :label="week" :value="week"></el-option>
                </el-select>周</h2>
            </div>
            <el-table 
                @cell-click="handleCellClick"
                @cell-mouse-enter="handleCellMouseEnter"
                :cell-class-name="cellStyle"
                :span-method="arraySpanMethod"
                :data="tableData" 
                style="width: 100%"
                border>
                <el-table-column prop="time" label="节次"></el-table-column>
                <el-table-column v-for="day in 7" :key="day" :label=" dayList[day%7]" >
                    <template slot-scope="{ row }">
                        <template v-if="row[day].courseInfo">
                            <el-card class="course-card" :style="{ backgroundColor: '#ccc'}">
                                <div slot="header" class="clearfix">
                                    <el-button @click="deleteCourse(row[day])" style="float: right; padding: 3px 0" type="text">
                                        删除
                                    </el-button>
                                </div>
                                <div class="course-name" :style="{ color: '#000'}">{{ row[day].courseInfo.name }}</div>
                                <div class="course-info">
                                    <div class="teacher">{{ row[day].classes.name }}</div>
                                    <div class="teacher">{{ row[day].teacher.name }}</div>
                                    <div class="teacher">{{ row[day].location }}</div>
                                </div>  
                            </el-card>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog :visible.sync="dialogVisible" title="确认排课信息" width="30%">
            <div>
                <div style="margin-bottom: 10px;">
                    <span style="font-weight: bold;">课程号：</span>{{ selectedCourse }}
                </div>
                <div style="margin-bottom: 10px;">
                    <span style="font-weight: bold;">教师号：</span>{{ selectedTeacher }}
                </div>
                <div style="margin-bottom: 10px;">
                    <span style="font-weight: bold;">班级号：</span>{{ selectedClass }}
                </div>
                <div style="margin-bottom: 10px;">
                    <span style="font-weight: bold;">场地名称：</span>{{ selectedLocation }}
                </div>
                <div style="margin-bottom: 10px;">
                    <span style="font-weight: bold;">周数：</span>{{ week }}
                </div>
                <div style="margin-bottom: 10px;">
                    <span style="font-weight: bold;">时间段：</span>{{ fromSection }} - {{ toSection }}节
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitSchedule">确定</el-button>
            </div>
        </el-dialog>
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
    computed: {
        weekData: {
            get() {
                //转换为数字再返回
                this.week = parseInt(this.week);
                return 1<<(this.week-1);
            },
        },
    },
    created(){
        //延迟2000毫秒执行
        setTimeout(() => {
            this.$notify({
                title: '提示',
                message: '请先点击查询后，才可以看到课表空闲的情况',
                duration: 5000
            });
        }, 2000);
        setTimeout(() => {
            this.$notify({
                title: '提示',
                message: '你下拉框选择的老师、课程、场地，会直接作为的排课条件',
                duration: 0
            });
        }, 7000);
    },
    data() {
        return {
            courses: [], // 所有课程
            teachers: [], // 所有教师
            locations: [], // 所有场地
            classes: [], // 所有班级
            selectedCourse: '', // 选中的课程
            selectedTeacher: '', // 选中的教师
            selectedLocation: '', // 选中的场地
            selectedWeek: '', // 选中的周数
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
            colorIndex:0,
            dialogVisible: false, // 是否显示排课详情弹窗
            selectedSchedule: null, // 选中的排课信息
            selectedStartTime: null, // 选中的开始时间
            selectedEndTime: null, // 选中的结束时间
            selectedClass: null, // 选中的班级
            isSelecting: false, // 是否正在选中
            fromSection: null, // 选中的开始节次
            toSection: null, // 选中的结束节次
            selectedDay: null, // 选中的星期
        };
    },
    mounted() {
        axios.get('/config/config').then(response => {
            this.week = response.data.data.week;
            console.log(this.week);
        });
        axios.post('/admin/course/getCourses',{}).then(response => {
            this.courses = response.data.data;
            console.log(this.courses);
        });
        axios.post('/admin/classes/getClasses',{}).then(response => {
            this.classes = response.data.data;
            console.log(this.classes);
        });
        axios.get('/admin/commonData/getAllTeachers').then(response => {
            this.teachers = response.data.data;
            console.log(this.teachers);
        });
        axios.get('/admin/commonData/getAllLocations').then(response => {
            this.locations = response.data.data;
            console.log(this.locations);
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
                    if (course && lastCourse && 
                        course.day === lastCourse.day && 
                        course.courseInfo.id === lastCourse.courseInfo.id && 
                        course.location === lastCourse.location
                    ) {

                        course = null;
                        data[i-this.startTime][j] = null;

                    }
                    if(course) {
                        lastCourse = course;
                    }

                    if(!data[i-this.startTime][j]) {
                        data[i-this.startTime][j] = {};
                    }
                    data[i-this.startTime][j]['time'] = i;
                    data[i-this.startTime][j]['day'] = j;
                }
            }


            //标记合并位
            for(let j=1; j<=7; j++) {
                for(let i=this.startTime; i<=this.endTime; i++) {
                    if(data[i-this.startTime][j].courseInfo) {
                        let course = data[i-this.startTime][j];
                        for(let k = course.startTime+1; k<=course.endTime; k++) {
                            data[k-this.startTime][j]['merge'] = true;
                        }
                    }
                }
            }


            console.log("data");
            console.log(data);

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
        //单元格合并方法
        arraySpanMethod({ row, column, rowIndex, columnIndex }) {

            //获取当前单元格的数据
            const currentRow = this.tableData[rowIndex];
            const current = currentRow[columnIndex];


            if(current && current.merge) {
                return {
                    rowspan: 0,
                    colspan: 0,
                };
            }


            if(current == undefined || current == null || current.courseInfo==undefined || current.courseInfo==null){
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
        },
        //查询被占用的课程
        searchSchedule() {
            console.log({
                courseId: this.selectedCourse,
                teacher:{
                    teacherId: this.selectedTeacher,
                },
                location: this.selectedLocation,
            })
            axios.post('/admin/course_schedule/getSchedulesOr', {
                courseId: this.selectedCourse,
                teacher:{
                    teacherId: this.selectedTeacher,
                },
                classes:{
                    classId: this.selectedClass,
                },
                location: this.selectedLocation,
            }).then(response => {
                this.courseSchedule = response.data.data;
                this.tableData = this.getTableData();

                
            })

            

        },
        //渲染列表颜色用的
        cellStyle({row, column, rowIndex, columnIndex}){

            if(
                row[columnIndex] == undefined || row[columnIndex] == null ||
                row[columnIndex].time == undefined || row[columnIndex].time == null            
            ){
                return 'select-cell';
            }

            if(row[columnIndex].time >= this.fromSection && row[columnIndex].time <= this.toSection && columnIndex == this.selectedDay){
                return 'selected-cell';
            }
            return 'select-cell';
        },
        submitSchedule() {
            //提交排课
            axios.post('/admin/course_schedule/add', [{
                courseId: this.selectedCourse,
                teacherId: this.selectedTeacher,
                location: this.selectedLocation,
                week: this.week,
                day: this.selectedDay,
                startTime: this.fromSection,
                endTime: this.toSection,
                classId: this.selectedClass
            }]).then(response => {
                this.$message.success('排课成功');
                this.searchSchedule();
            }).catch(error => {
                this.$message.error('排课失败');
            });

            this.isSelecting = false;
            this.dialogVisible = false;
            this.fromSection = null;
            this.toSection = null;

                  
        },
        changeWeek(){
            console.log(this.week);
            this.tableData = this.getTableData();
        },
        deleteCourse(courseSchedule){



            //删除排课
            console.log(courseSchedule);


            //确认删除
            this.$confirm('此操作将删除该排课,包括其他所有周的排课, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {

                console.log(courseSchedule);
                axios.get('/admin/course_schedule/delete?id='+courseSchedule.id)
                .then(response => {
                    this.$message.success('删除成功');
                    this.searchSchedule();
                }).catch(error => {
                    this.$message.error('删除失败');
                });

              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                });          
              });

        },

        handleCellMouseEnter(row, column, cell, event){
            if(this.isSelecting){
                let columnIndex = 0;
            switch(column.label){
                case '周一':
                    columnIndex = 1;
                    break;
                case '周二':
                    columnIndex = 2;
                    break;
                case '周三':
                    columnIndex = 3;
                    break;
                case '周四':
                    columnIndex = 4;
                    break;
                case '周五':
                    columnIndex = 5;
                    break;
                case '周六':
                    columnIndex = 6;
                    break;
                case '周日':
                    columnIndex = 7;
                    break;
            }
                let {day, time} = row[columnIndex];
                if(day == this.selectedDay){
                    this.toSection = time;
                }
            }
        },


        //用于实现选择时间段的操作
        handleCellClick(row, column, cell, event){

            //获取这一单元格对应的列号
            let columnIndex = 0;
            switch(column.label){
                case '周一':
                    columnIndex = 1;
                    break;
                case '周二':
                    columnIndex = 2;
                    break;
                case '周三':
                    columnIndex = 3;
                    break;
                case '周四':
                    columnIndex = 4;
                    break;
                case '周五':
                    columnIndex = 5;
                    break;
                case '周六':
                    columnIndex = 6;
                    break;
                case '周日':
                    columnIndex = 7;
                    break;
            }

            console.log(row[columnIndex]);

            if(row[columnIndex] == undefined || row[columnIndex] == null || row[columnIndex].time == undefined || row[columnIndex].time == null){
                return;
            }

            if(row[columnIndex].merge || row[columnIndex].courseInfo){
                this.$message.error("该时间段已经被占用");
                return;
            }


            let {day, time} = row[columnIndex];

            if(this.isSelecting){

                //如果不是同一天，就重新选择
                if(this.selectedDay !== day){
                    this.fromSection = null;
                    this.toSection = null;
                    this.selectedDay = null;
                    this.isSelecting = false;
                    return;
                }


                //如果选反了，就交换
                if(time < this.fromSection){
                    this.toSection = this.fromSection;
                    this.fromSection = time;
                }else{
                    this.toSection = time;
                }


                //如果选择的区间内有被占用的，就重新选择
                for(let i = this.fromSection; i<=this.toSection; i++){
                    if(this.tableData[i][this.selectedDay].courseInfo||this.tableData[i][this.selectedDay].merge){
                        this.fromSection = null;
                        this.toSection = null;
                        this.selectedDay = null;
                        this.isSelecting = false;
                        this.$message.error("该时间段已经被占用");
                        return;
                    }
                }


                console.log("选择完毕");
                console.log(day);
                console.log(this.fromSection, this.toSection);
                this.isSelecting = false;


                //判断班级、教师、教室、课程是否已经选择
                if(this.selectedClass && this.selectedTeacher && this.selectedLocation && this.selectedCourse){

                    this.dialogVisible = true;
                
                }else{
                    this.$message.error('请先选择班级、教师、教室、课程');
                    this.isSelecting = false;
                    // this.fromSection = null;
                    // this.toSection = null;
                    return;
                }

                
            }else{
                this.fromSection = time;
                this.toSection = time;
                this.selectedDay = day;
                this.isSelecting = true;
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
.el-table th, .el-table td {
    text-align: center;
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

.selected-cell {
  background-color: #0b97d8 !important;
  height: 100px;
}

.select-cell{
    height: 100px;
}
.select-cell:hover {
  background-color: #6ac3ec !important;
  
}


.course-name {
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 8px;
}

.course-info {
  /* display: flex; */
  /* flex-direction: column; */
  /* align-items: left; */
}

.teacher {
  font-size: 12px;
  color: #ffffff;
}

.location {
  font-size: 12px;
  color: #ffffff;
}
</style>
