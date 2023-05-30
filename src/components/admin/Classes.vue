<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>班级管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <!-- 搜索与添加区域 -->
          <el-input
            placeholder="请输入搜索内容"
            v-model="searchText"
            clearable>
          </el-input>
        </el-col>
        <el-col :offset="10" :span="3">
          <el-button 
            type="primary" 
            @click="addDialogVisible = true">
            添加班级
          </el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table :data="paginatedClassList" border stripe>
        <el-table-column prop="id" sortable label="ID"></el-table-column>
        <el-table-column prop="classId" sortable label="班级号"></el-table-column>
        <el-table-column prop="name" label="班级名"></el-table-column>
        <el-table-column prop="year" sortable label="年级"></el-table-column>
        <el-table-column prop="major" sortable label="专业"></el-table-column>
        <el-table-column prop="counsellor" sortable label="辅导员"></el-table-column>
        <el-table-column prop="num" sortable label="学生人数"></el-table-column>
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row)">
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteCourse(scope.row.id)"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 40, 80]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <add-class-dialog
    @close="dialogClosed"
    :isVisible.sync="addDialogVisible">
    </add-class-dialog>
    <edit-class-dialog
    @close="dialogClosed"
    :isVisible.sync="editDialogVisible"
    :class.sync="editClass">
    </edit-class-dialog>
    
  </div>
 
</template>
<script>

import AddClassDialog from './components/AddClassDialog.vue';
import EditClassDialog from './components/EditClassDialog.vue';


export default {

  components: {
    AddClassDialog,
    EditClassDialog
  },

  data() {
    return {

      currentPage: 1,
      pageSize: 10,
      

      searchText: '', // 搜索输入框
      classList: [], // 用户列表
      // 控制添加对话框显示与隐藏
      addDialogVisible: false,
      // 控制修改对话框显示与隐藏
      editDialogVisible: false,
      editClass: {},
      params:{
          name: "",
          major: "",
          num: 0,
          year: 0,
          counsellor: "",
          classId: ""
      }

    }
  },
  created() {
    this.getClassList();
  },
  computed:{
    paginatedClassList() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.classList.filter((item) => {
        let result = item.name.includes(this.searchText);
        result = result || item.classId.includes(this.searchText);
        result = result || item.major.includes(this.searchText);
        return result;
      }).slice(startIndex, endIndex);
    },
    total() {
      return this.classList.filter((item) => {
        let result = item.name.includes(this.searchText);
        result = result || item.classId.includes(this.searchText);
        result = result || item.major.includes(this.searchText);
        return result;
      }).length;
    },
  },
  methods: {
    // 获取班级列表
    async getClassList() {

      const{data: res} =  await this.$http.post("/admin/classes/getClasses",this.params);
      if(res.code !== 200) return this.$message.error("获取班级列表失败");
      this.classList = res.data;
    },

    //  过滤操作
    filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
    },
    // Your existing methods here
    handleSizeChange(newSize) {
      this.pageSize = newSize;
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
    },
    // 监听对话框关闭事件
    dialogClosed() {

      this.addDialogVisible = false;
      this.editDialogVisible = false;
      this.getClassList();
    },
    async deleteCourse(id){


      this.$confirm('此操作将永久删除该班级，包括班级的课表信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            const {data: res} = await this.$http.get("/admin/classes/delete?id=" + id);  
            if(res.code != 200) this.$message.error(res.msg);
            else{
              this.$message.success("删除成功");
              this.getClassList();
            }
          } catch (error) {
            console.error(error);
            this.$message.error("删除失败");
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });

     
    },
    showEditDialog(row) {
      this.editDialogVisible = true;
      this.editClass = row;

      
      console.log(this.editClass);


    },
  },
}
</script>
