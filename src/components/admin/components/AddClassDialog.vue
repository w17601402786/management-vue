
<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" :before-close="handleClose" title="添加班级" width="68%">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="班级号" prop="classId">
          <el-input v-model="form.classId" placeholder="请输入班级号"></el-input>
        </el-form-item>
        <el-form-item label="班级名" prop="name">
          <el-input v-model="form.name" placeholder="请输入班级名称"></el-input>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="form.major" placeholder="请输入专业"></el-input>
        </el-form-item>
        <el-form-item label="年级" prop="year">
          <el-input v-model.number="form.year" min="0" type="number" onkeyup="value=value.replace(/[^\d]+/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="辅导员" prop="counsellor">
          <el-input v-model="form.counsellor" placeholder="请输入辅导员"></el-input>
        </el-form-item>
        <el-form-item label="班级人数" prop="num">
          <el-input v-model.number="form.num" min="0" type="number" onkeyup="value=value.replace(/[^\d]+/g,'')"></el-input>
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
  name: 'AddClassDialog',
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
          name: "",
          major: "",
          num: 0,
          year: 0,
          counsellor: "",
          classId: ""
      },
      rules: {
        classId: [
          { required: true, message: "请输入班级号", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "班级号在1~20个字符之间",
            trigger: "blur",
          },
        ],
        name: [
          { required: true, message: "请输入班级名", trigger: "blur" },
          {
            min: 1,
            max: 40,
            message: "班级名长度在1~40个字符之间",
            trigger: "blur",
          },
        ],
        major: [
          { required: true, message: "请输入专业", trigger: "blur" },
          {
            min: 1,
            max: 40,
            message: "专业名长度在1~40个字符之间",
            trigger: "blur",
          },
        ],
        year: [
          { required: true, message: "请输入年级", trigger: "blur" },
        ],
        counsellor: [
          { required: true, message: "请输入辅导员", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "辅导员名长度在2~10个字符之间",
            trigger: "blur",
          },
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
        const {data: res} = await this.$http.post("/admin/classes/add",this.form);
        if(res.code != 200) this.$message.error(res.msg);
        else this.$message.success("添加成功");
      }catch(e){
        this.$message.error("添加失败");
      }
    },
  },
};
</script>
