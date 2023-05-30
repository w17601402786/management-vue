
<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" :before-close="handleClose" title="编辑班级" width="68%">
      <el-form :model="editClass" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="班级名" prop="name">
          <el-input v-model="editClass.name" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="editClass.major" placeholder="请输入专业"></el-input>
        </el-form-item>
        <el-form-item label="年级" prop="year">
          <el-input v-model.number="editClass.year" min="0" type="number" onkeyup="value=value.replace(/[^\d]+/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="辅导员" prop="counsellor">
          <el-input v-model="editClass.counsellor" placeholder="请输入辅导员"></el-input>
        </el-form-item>
        <el-form-item label="班级人数" prop="num">
          <el-input v-model.number="editClass.num" min="0" type="number" onkeyup="value=value.replace(/[^\d]+/g,'')"></el-input>
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
  name: 'EditClassDialog',
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    class: {
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
    editClass: {
      get() {
        return this.class;
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
          id: "",
          name: "",
          major: "",
          num: 0,
          year: 0,
          counsellor: "",
          classId: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入课程名称", trigger: "blur" },
        ],
        major: [
          { required: true, message: "请输入专业", trigger: "blur" },
        ],
        year: [
          { required: true, message: "请输入年级", trigger: "blur" },
        ],
        counsellor: [
          { required: true, message: "请输入辅导员", trigger: "blur" },
        ],
        num: [
          { required: true, message: "请输入班级人数", trigger: "blur" },
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
      console.log(this.editClass)
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
        const {data: res} = await this.$http.post("/admin/classes/update",this.editClass);
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
