
<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" :before-close="handleClose" title="添加用户" width="68%">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="userType">
          <el-radio-group v-model="form.userType">
            <el-radio label="student">学生</el-radio>
            <el-radio label="teacher">教师</el-radio>
            <el-radio label="admin">管理员</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="form.userType === 'student'">
          <el-form-item label="学号" prop="studentInfo.studentId">
            <el-input v-model="form.studentInfo.studentId" placeholder="请输入学号"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="studentInfo.name">
            <el-input v-model="form.studentInfo.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="studentInfo.gender">
            <el-select v-model="form.studentInfo.gender" placeholder="请选择性别">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生日" prop="studentInfo.birthday">
            <el-date-picker v-model="form.studentInfo.birthday" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="专业" prop="studentInfo.major">
            <el-input v-model="form.studentInfo.major" placeholder="请输入专业"></el-input>
          </el-form-item>
          <!-- <el-form-item label="班级" prop="studentInfo.classId">
            <el-input v-model="form.studentInfo.classId" placeholder="请输入班级"></el-input>
          </el-form-item> -->
          <!-- 使用选择框 -->
          <el-form-item label="班级" prop="studentInfo.classId">
            <el-select v-model="form.studentInfo.classId" placeholder="请选择班级" filterable>
              <el-option
                v-for="item in classList"
                :key="item.classId"
                :label="item.major"
                :value="item.classId">
                <span style="float: left">{{ item.major }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地址" prop="studentInfo.address">
            <el-input v-model="form.studentInfo.address" placeholder="请输入地址"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="studentInfo.phone">
            <el-input v-model="form.studentInfo.phone" placeholder="请输入电话"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="studentInfo.note">
            <el-input v-model="form.studentInfo.note" placeholder="请输入备注"></el-input>
          </el-form-item>
        </template>
        <template v-if="form.userType === 'teacher'">
          <el-form-item label="工号" prop="teacherInfo.teacherId">
            <el-input v-model="form.teacherInfo.teacherId" placeholder="请输入工号"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="teacherInfo.name">
            <el-input v-model="form.teacherInfo.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="teacherInfo.gender">
            <el-select v-model="form.teacherInfo.gender" placeholder="请选择性别">
              <el-option label="男" value="male"></el-option>
              <el-option label="女" value="female"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生日" prop="teacherInfo.birthday">
            <el-date-picker v-model="form.teacherInfo.birthday" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="学院" prop="teacherInfo.faculty">
            <el-input v-model="form.teacherInfo.faculty" placeholder="请输入学院"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="teacherInfo.phone">
            <el-input v-model="form.teacherInfo.phone" placeholder="请输入电话"></el-input>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AddUserDialog',
  props: {
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  created(){
    this.getClassesList();
  },
  computed: {
    dialogVisible: {
      get() {
        return this.isVisible;
      },
      set(val) {
        this.$emit("update:isVisible", val);
      },
    },
  },
  data() {
    return {
      classList:[],
      form: {
        username: "", //必填
        password: "", //必填
        userType: "", //必填
        studentInfo: {
          studentId: "", //如果是学生必填
          name: "", //如果是学生必填
          gender: "",
          birthday: "",
          major: "",
          classId: "", //如果是学生必填
          address: "",
          phone: "",
          note: ""
        },
        teacherInfo: {
          teacherId: "", //如果是教师必填
          name: "", //如果是教师必填
          gender: "",
          birthday: "",
          faculty: "",
          phone: "",
        }
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度在3~10个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 10,
            message: "密码长度在6~10个字符之间",
            trigger: "blur",
          },
        ],
        userType: [
          { required: true, message: "请选择用户类型", trigger: "change" },
        ],
        "studentInfo.studentId": [
          { required: true, message: "请输入学号", trigger: "blur" },
        ],
        "studentInfo.name": [
          { required: true, message: "请输入姓名", trigger: "blur" },
        ],
        "studentInfo.gender": [
          { required: false, message: "请选择性别", trigger: "change" },
        ],
        "studentInfo.birthday": [
          { required: false, message: "请选择生日", trigger: "change" },
        ],
        "studentInfo.major": [
          { required: false, message: "请输入专业", trigger: "blur" },
        ],
        "studentInfo.classId": [
          { required: true, message: "请输入班级", trigger: "blur" },
        ],
        "studentInfo.address": [
          { required: false, message: "请输入地址", trigger: "blur" },
        ],
        "studentInfo.phone": [
          { required: false, message: "请输入电话", trigger: "blur" },
        ],
        "teacherInfo.teacherId": [
          { required: true, message: "请输入工号", trigger: "blur" },
        ],
        "teacherInfo.name": [
          { required: true, message: "请输入姓名", trigger: "blur" },
        ],
        "teacherInfo.gender": [
          { required: false, message: "请选择性别", trigger: "change" },
        ],
        "teacherInfo.birthday": [
          { required: false, message: "请选择生日", trigger: "change" },
        ],
        "teacherInfo.faculty": [
          { required: false, message: "请输入学院", trigger: "blur" },
        ],
        "teacherInfo.phone": [
          { required: false, message: "请输入电话", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    async getClassesList(){
      //TODO 发送请求获取班级信息
      const {data: res} =  await this.$http.post("/admin/classes/getClasses",{});
      if(res.code != 200) this.$message.error(res.message);
      this.classList = res.data;

      console.log(this.classList)

    },
    handleClose() {
      console.log("关闭");
      this.$emit("close");
    },
    async handleSubmit() {
      console.log(this.form)
      let through = true;
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$message.error("表单验证失败");
          through = false;
        }
      });
      if(!through){
        return;
      }
      console.log("提交表单");
      const {data: res} = await this.$http.post("/admin/users/add",this.form);
      if(res.code != 200) this.$message.error(res.msg);
      else this.$message.success("添加成功");
    },
  },
};
</script>
