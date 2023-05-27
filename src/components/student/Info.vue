<template>
    <div v-if="studentInfo">
        <el-descriptions class="margin-top" title="学生信息" :column="3" border>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-user"></i>
                    姓名
                </template>
                {{ studentInfo.name }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-tickets"></i>
                    学号
                </template>
                {{ studentInfo.studentId }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-gender"></i>
                    性别
                </template>
                {{ studentInfo.gender }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-date"></i>
                    出生日期
                </template>
                {{ studentInfo.birthday }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-notebook-2"></i>
                    专业
                </template>
                {{ studentInfo.classes.major }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-office-building"></i>
                    班级
                </template>
                {{ studentInfo.classes.name }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-location-outline"></i>
                    地址
                </template>
                {{ studentInfo.address }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-mobile-phone"></i>
                    手机号
                </template>
                {{ studentInfo.phone }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-tickets"></i>
                    备注
                </template>
                <el-tag size="small">{{ studentInfo.note }}</el-tag>
            </el-descriptions-item>
        </el-descriptions>
        <el-descriptions class="margin-top" title="班级信息" column="2" border>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-tickets"></i>
                
                    班级号
                </template>
                {{ studentInfo.classes.classId }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-tickets"></i>
                    班级名称
                </template>
                {{ studentInfo.classes.name }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-tickets"></i>
                    班级专业
                </template>
                {{ studentInfo.classes.major }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-tickets"></i>
                    班级人数
                </template>
                {{ studentInfo.classes.num }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-tickets"></i>
                    年级
                </template>
                {{ studentInfo.classes.year }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-tickets"></i>
                    辅导员
                </template>
                {{ studentInfo.classes.counsellor }}
            </el-descriptions-item>
        </el-descriptions>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            studentInfo: null,
        };
    },
    mounted() {
        axios
            .get("http://localhost:8081/student/info")
            .then((response) => {
                this.studentInfo = response.data.data.studentInfo;
            })
            .catch((error) => {
                console.log(error);
            });
    },
};
</script>

