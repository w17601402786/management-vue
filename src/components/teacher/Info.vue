<template>
  <el-card class="box-card">
    <div v-if="teacherInfo">
      <el-descriptions class="margin-top" title="教师信息" :column="3" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            教师编号
          </template>
          {{ teacherInfo.teacherId }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            姓名
          </template>
          {{ teacherInfo.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-gender"></i>
            性别
          </template>
          {{ teacherInfo.gender }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-date"></i>
            出生日期
          </template>
          {{ teacherInfo.birthday }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            联系电话
          </template>
          {{ teacherInfo.phone }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            职称
          </template>
          {{ teacherInfo.faculty }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-card>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      teacherInfo: null,
    };
  },
  mounted() {
    axios
      .get("/teacher/info")
      .then((response) => {
        this.teacherInfo = response.data.data.teacherInfo;
        this.teacherInfo.birthday = this.teacherInfo.birthday.substring(0, 10);
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>