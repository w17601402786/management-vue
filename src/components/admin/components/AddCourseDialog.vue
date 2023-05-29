
<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" :before-close="handleClose" title="添加课程" width="68%">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="课程号" prop="courseId">
          <el-input v-model="form.courseId" placeholder="请输入课程号"></el-input>
        </el-form-item>
        <el-form-item label="课程名" prop="name">
          <el-input v-model="form.name" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item label="学分" prop="credit">
          <el-input v-model.number="form.credit" min="0" type="number" onkeyup="value=value.replace(/[^\d]+/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="学时" prop="hours">
          <el-input v-model.number="form.hours" min="0" type="number" onkeyup="value=value.replace(/[^\d]+/g,'')"></el-input>
        </el-form-item>
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
  name: 'AddCourseDialog',
  props: {
    isVisible: {
      type: Boolean,
      required: true
    }
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
      form: {
        id: 0,
        courseId: "",
        name: "",
        hours: "",
        credit: ""
      },
      rules: {
        courseId: [
          { required: true, message: "请输入课程h号", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "课程号在1~20个字符之间",
            trigger: "blur",
          },
        ],
        name: [
          { required: true, message: "请输入课程名", trigger: "blur" },
          {
            min: 1,
            max: 40,
            message: "课程长度在1~40个字符之间",
            trigger: "blur",
          },
        ],
        credit: [
          { required: true, message: "请输入学分", trigger: "blur" },
        ],
        hours: [
          { required: true, message: "请输入学时", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
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
      try{
        const {data: res} = await this.$http.post("/admin/course/add",this.form);
        if(res.code != 200) this.$message.error(res.msg);
        else this.$message.success("添加成功");
      }catch(e){
        this.$message.error("添加失败");
      }
    },
  },
};
</script>
