<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
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
            添加用户
          </el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table :data="paginatedUserList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-descriptions v-if="props.row.userType == 'student'" class="margin-top" :column="3" border>
              <el-descriptions-item>
                  <template slot="label">
                      姓名
                  </template>
                  {{ props.row.studentInfo.name }}
              </el-descriptions-item>
              <el-descriptions-item>
                  <template slot="label">
                      学号
                  </template>
                  {{ props.row.studentInfo.studentId }}
              </el-descriptions-item>
              <el-descriptions-item>
                  <template slot="label">
                      性别
                  </template>
                  {{ props.row.studentInfo.gender }}
              </el-descriptions-item>
              <el-descriptions-item>
                  <template slot="label">
                      班级号
                  </template>
                  {{ props.row.studentInfo.classId }}
              </el-descriptions-item>
              <el-descriptions-item>
                  <template slot="label">
                      出生日期
                  </template>
                  {{ props.row.studentInfo.birthday }}
              </el-descriptions-item>
              <el-descriptions-item>
                  <template slot="label">
                      专业
                  </template>
                  {{ props.row.studentInfo.major }}
              </el-descriptions-item>
              <el-descriptions-item>
                  <template slot="label">
                      地址
                  </template>
                  {{ props.row.studentInfo.address }}
              </el-descriptions-item>
              <el-descriptions-item>
                  <template slot="label">
                      手机号
                  </template>
                  {{ props.row.studentInfo.phone }}
              </el-descriptions-item>
              <el-descriptions-item>
                  <template slot="label">
                      备注
                  </template>
                  <el-tag size="small">{{ props.row.studentInfo.note }}</el-tag>
              </el-descriptions-item>
          </el-descriptions>
          <el-descriptions v-else-if="props.row.userType == 'teacher'" class="margin-top" :column="3" border>
              <el-descriptions-item>
                  <template slot="label">
                      姓名
                  </template>
                  {{ props.row.teacherInfo.name }}
              </el-descriptions-item>
              <el-descriptions-item>
                  <template slot="label">
                      学号
                  </template>
                  {{ props.row.teacherInfo.teacherId }}
              </el-descriptions-item>
              <el-descriptions-item>
                  <template slot="label">
                      性别
                  </template>
                  {{ props.row.teacherInfo.gender }}
              </el-descriptions-item>
              <el-descriptions-item>
                  <template slot="label">
                      职称
                  </template>
                  {{ props.row.teacherInfo.faculty }}
              </el-descriptions-item>
              <el-descriptions-item>
                  <template slot="label">
                      出生日期
                  </template>
                  {{ props.row.teacherInfo.birthday }}
              </el-descriptions-item>
             
              <el-descriptions-item>
                  <template slot="label">
                      手机号
                  </template>
                  {{ props.row.teacherInfo.phone }}
              </el-descriptions-item>
          </el-descriptions>
          <el-empty v-else :image-size="50" description="管理员没有更多数据哩..."></el-empty>
          </template>
        </el-table-column>
        <el-table-column prop="id" sortable label="ID"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column 
          :filters="[{ text: '管理员', value: 'admin' }, { text: '教师', value: 'teacher' },{ text: '学生', value: 'student' }]"
          :filter-method="filterHandler"
          prop="userType" 
          label="用户类型">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.userType == 'admin'" type="success" size="mini"
              disable-transitions>
              管理员
            </el-tag>
            <el-tag v-else-if="scope.row.userType == 'teacher'" type="warning" size="mini"
              disable-transitions>
              教师
            </el-tag>
            <el-tag v-else-if="scope.row.userType == 'student'" type="info" size="mini"
              disable-transitions>
              学生
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
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
              @click="deleteUser(scope.row.id)"
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
    <add-user-dialog
    @close="dialogClosed"
    :isVisible.sync="addDialogVisible">
    </add-user-dialog>
    <edit-user-dialog
    @close="dialogClosed"
    :isVisible.sync="editDialogVisible"
    :user.sync="editUser">
    </edit-user-dialog>
    
  </div>
 
</template>
<script>

import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 导入中文语言包
import AddUserDialog from './components/AddUserDialog.vue';
import EditUserDialog from './components/EditUserDialog.vue';


export default {

  components: {
    AddUserDialog,
    EditUserDialog
  },

  data() {
    return {

      currentPage: 1,
      pageSize: 10,
      

      searchText: '', // 搜索输入框
      userList: [], // 用户列表
      // 控制添加对话框显示与隐藏
      addDialogVisible: false,
      // 控制修改对话框显示与隐藏
      editDialogVisible: false,
      editUser: {},
      params:{
        username: "",
        userType: "",
        studentInfo: {
            studentId: "",
            name: "",
            classId: "",
            address: "",
            phone: "",
            note: "",
        },
        teacherInfo: {
            teacherId: "",
            name: "",
            faculty: "",
            phone: "",
        },
}
    }
  },
  created() {
    this.getUserList();
  },
  computed:{
    paginatedUserList() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.userList.filter((item) => {

        let result = item.username.includes(this.searchText);
        
        if(item.userType == 'student'){
          result = result || item.studentInfo.studentId.includes(this.searchText);
          result = result || item.studentInfo.name.includes(this.searchText);
          result = result || item.studentInfo.classId.includes(this.searchText);
          result = result || item.studentInfo.address.includes(this.searchText);
          result = result || item.studentInfo.major.includes(this.searchText);
          result = result || item.studentInfo.note.includes(this.searchText);
        }else if(item.userType == 'teacher'){
          result = result || item.teacherInfo.teacherId.includes(this.searchText);
          result = result || item.teacherInfo.name.includes(this.searchText);
          result = result || item.teacherInfo.faculty.includes(this.searchText);
        }

        return result;
      }).slice(startIndex, endIndex);
    },
    total() {
      return this.userList.filter((item) => {

        let result = item.username.includes(this.searchText);
        
        if(item.userType == 'student'){
          result = result || item.studentInfo.studentId.includes(this.searchText);
          result = result || item.studentInfo.name.includes(this.searchText);
          result = result || item.studentInfo.classId.includes(this.searchText);
          result = result || item.studentInfo.address.includes(this.searchText);
          result = result || item.studentInfo.major.includes(this.searchText);
          result = result || item.studentInfo.note.includes(this.searchText);
        }else if(item.userType == 'teacher'){
          result = result || item.teacherInfo.teacherId.includes(this.searchText);
          result = result || item.teacherInfo.name.includes(this.searchText);
          result = result || item.teacherInfo.faculty.includes(this.searchText);
        }

        return result;
      }).length;
    },
  },
  methods: {
    // 获取管理员列表
    async getUserList() {


      const{data: res} =  await this.$http.post("/admin/users/getUsers",this.params);
      if(res.code !== 200) return this.$message.error("获取用户列表失败");
      this.userList = res.data;

      for(let i = 0; i < this.userList.length; i++){
        if(this.userList[i].studentInfo !== null){
          //1998-12-31T16:00:00.000+00:00
          if(this.userList[i].studentInfo.birthday !== null && this.userList[i].studentInfo.birthday !== "")
          this.userList[i].studentInfo.birthday = dayjs(this.userList[i].studentInfo.birthday).format("YYYY-MM-DD");
        }
        if(this.userList[i].teacherInfo !== null){
          if(this.userList[i].teacherInfo.birthday !== null && this.userList[i].teacherInfo.birthday !== "")
          this.userList[i].teacherInfo.birthday = dayjs(this.userList[i].teacherInfo.birthday).format("YYYY-MM-DD");
        }
      }
      
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
      this.getUserList();
    },
    async deleteUser(id){


      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            const {data: res} = await this.$http.get("/admin/users/delete?id=" + id);  
            if(res.code != 200) this.$message.error(res.msg);
            else{
              this.$message.success("删除成功");
              this.getUserList();
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
      this.editUser = row;

      if(this.editUser.studentInfo == null){
          this.editUser.studentInfo = {
            studentId: "", //如果是学生必填
            name: "", //如果是学生必填
            gender: "",
            birthday: null,
            major: "",
            classId: "", //如果是学生必填
            address: "",
            phone: "",
            note: ""
          };
        }
        if(this.editUser.teacherInfo == null){
          this.editUser.teacherInfo = {
            teacherId: "", //如果是教师必填
            name: "", //如果是教师必填
            gender: "",
            birthday: null,
            faculty: "",
            phone: "",
          };
        }
      console.log(this.editUser);


    },
  },
}
</script>
