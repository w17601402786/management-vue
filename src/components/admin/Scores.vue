<template>
  <div>
    <!-- 导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/teacher/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>成绩录入</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索与添加区域 v-model提供数据绑定功能-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-select
            @change="changeCourse"
            v-model="course.courseId"
            clearable
            auto-complete
            placeholder="请选择">
            <el-option
              v-for="item in courses"
              :key="item.courseId"
              :label="item.name"
              :value="item.courseId">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.courseId }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3" :offset="13">
          <el-button type="primary" @click="addScore">提交</el-button>
        </el-col>
      </el-row>
      <!--课程列表区域-->
      <div id="printMe" ref="printContent">
        <el-table :data="paginatedStudentList" border stripe>
          <el-table-column type="index" align="center"></el-table-column>
          <el-table-column
            label="学号"
            prop="studentId"
            width="120px"
            align="center"
          ></el-table-column>
          <el-table-column
            label="班级号"
            prop="classId"
            width="100px"
            align="center"
          ></el-table-column>
          <el-table-column
            label="姓名"
            prop="name"
            width="100px"
            align="center"
          ></el-table-column>
         
          <el-table-column label="成绩"  align="center">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.score" min="0" type="number" onkeyup="value=value.replace(/[^\d]+/g,'')"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 40, 80]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  
  data() {
    return {

      courses: [],
      course: {
        courseId: null,
        name: null,
      },
      studentlist: [],
      currentPage: 1,
      pageSize: 10,
    }
  },
  created() {
    this.getCourses();
  },
  computed:{
    paginatedStudentList() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.studentlist.slice(startIndex, endIndex);
    },
    total() {
      return this.studentlist.length;
    },
  },
  methods: {

    async getCourses(){
      const { data: res } = await this.$http.post('admin/course/getCourses',{});
      if(res.code !== 200) return this.$message.error('获取课程列表失败')
      this.courses = res.data;
    },
    changeCourse() {
      this.getstudent();
    },

    async getstudent() {

      if(this.course == null || this.course.courseId == null) {
        return;
      }
      const { data: res } = await this.$http.get('admin/course/getStudents?courseId=' + this.course.courseId)
      if (res.code !== 200) return this.$message.error('获取学生列表失败')
      this.studentlist = res.data

      //将学生列表中成绩为-1的学生的成绩置为空
      for (let i = 0; i < this.studentlist.length; i++) {
        if (this.studentlist[i].score === -1) {
          this.studentlist[i].score = null;
        }
      }

    },

    // 录入成绩
    addScore() {

      let scoreList = [];

      console.log(this.studentlist);

      for(let i = 0; i < this.studentlist.length; i++) {
        if(this.studentlist[i].score === null) {
          console.log(this.studentlist[i].studentId + "成绩为空");
          continue;
        }
        let score = {
          studentId: this.studentlist[i].studentId,
          courseId: this.course.courseId,
          //如果是字符串，转换成整数
          score: parseInt(this.studentlist[i].score),
        };

        console.log(score)
        if(isNaN(score.score)) {
          score.score = -1;
        }
        scoreList.push(score);
      }


      this.$http.post('admin/grade/addGrades', scoreList)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('成绩录入成功');
          } else {
            this.$message.error('成绩录入失败');
          }
        })
        .catch(err => {
          this.$message.error('成绩录入失败');
        })

    },
    // Your existing methods here
    handleSizeChange(newSize) {
      this.pageSize = newSize;
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
    }
  },
}
</script>

<style lang="less" scoped>
.demo-input-label {
  display: inline-block;
  width: 130px;
}

.select {
  width: 120px;
}
</style>