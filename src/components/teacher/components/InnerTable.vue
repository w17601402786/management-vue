<template>
    <div>
        <h1 style="text-align: center;">该课程学生成绩</h1>
        <el-input v-model="searchText" placeholder="请输入搜索内容" style="width: 30%;"></el-input>
        <el-table :data="filteredData" :default-sort="{prop: 'score', order: 'descending'}" border>
            <el-table-column prop="studentId" label="学号" sortable></el-table-column>
            <el-table-column prop="studentInfo.name" label="姓名"></el-table-column>
            <el-table-column prop="score" label="成绩" sortable fixed="right"></el-table-column>
        </el-table>

        <el-row type="flex" class="row-bg"  justify="center">
                <el-col >
                        <el-pagination
                                background
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="currentPage"
                                :page-sizes="[10, 20, 30, 40]"
                                :page-size="pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="theFilterData.length">
                        </el-pagination>
                </el-col>
        </el-row>
     
        
    </div>
</template>

<script>
export default {
    name: 'InnerTable',
    props: {
        tableData: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            currentPage: 1,
            pageSize: 10,
            searchText: '',
            theFilterData: [],
        };
    },
    computed: {
        filteredData() {
            return this.filterData().slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
        },
    },
    methods: {
        filterData() {
            const searchText = this.searchText.trim().toLowerCase();
            if (!searchText) {
                return this.tableData;
            }

            this.theFilterData =  this.tableData.filter((item) => {
                return item.studentId.toLowerCase().indexOf(searchText) > -1 || item.studentInfo.name.toLowerCase().indexOf(searchText) > -1;
            });

            return this.theFilterData;
        },
        handleSizeChange(val) {
            this.pageSize = val;
        },
        handleCurrentChange(val) {
            this.currentPage = val;
        },
    },
};
</script>
<style>
</style>