
<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" :before-close="handleClose" title="编辑课程" width="68%">
      <el-form :model="editCourse" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="课程名" prop="name">
          <el-input v-model="editCourse.name" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item label="学分" prop="credit">
          <el-input v-model.number="editCourse.credit" min="0" type="number" onkeyup="value=value.replace(/[^\d]+/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="学时" prop="hours">
          <el-input v-model.number="editCourse.hours" min="0" type="number" onkeyup="value=value.replace(/[^\d]+/g,'')"></el-input>
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
  name: 'EditCourseDialog',
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    course: {
      type: Object,
      required: true
    }
  },
  created(){
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
    editCourse: {
      get() {
        return this.course;
      },
      set(val) {
        console.log(val);
        // this.$emit("update:editUser", val);
      },
    }
  },
  data() {
    return {
      
      form: {
        id: 0,
        courseId: "",
        name: "",
        hours: null,
        credit: null
      },
      rules: {
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
      console.log(this.editCourse)
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
      try {
        const {data: res} = await this.$http.post("/admin/course/update",this.editCourse);
        if(res.code != 200) this.$message.error(res.msg);
        else this.$message.success("修改成功");
      } catch (error) {
        console.error(error);
        this.$message.error("修改失败");
      }
    },
  },
};
</script>
