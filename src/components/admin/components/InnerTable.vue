<template>
    <div>
        <el-row>
            <el-col :span="6">
                <el-input v-model="searchText" placeholder="请输入搜索内容"></el-input>
            </el-col>
            <el-col :offset="10" :span="2">
                <p style="text-align: center; margin-top: 10px;">最小值</p>
            </el-col>
            <el-col :span="6">   
                <el-input-number v-model="min" :min="0" :max="max" label="最小值" ></el-input-number>
            </el-col>
        </el-row>
        <el-row>
            <el-col :offset="16" :span="2">
                <p style="text-align: center; margin-top: 10px;">最大值</p>
            </el-col>
            <el-col :span="6">
                <el-input-number v-model="max" :min="min" label="最大值"></el-input-number>
            </el-col>
            
        </el-row>
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
            min: 0,
            max: 100,
            currentPage: 1,
            pageSize: 10,
            searchText: '',
            theFilterData: [],
        };
    },
    computed: {
        filteredData() {
            
            return this.filterData().filter((item) => {
                return item.score >= this.min && item.score <= this.max;
            })
            .slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
        },
    },
    methods: {
        filterData() {
            const searchText = this.searchText.trim().toLowerCase();
            if (!searchText) {
                console.log(this.tableData);
                return this.tableData;
            }

            this.theFilterData =  this.tableData.filter((item) => {
                let result = item.studentId.toLowerCase().indexOf(searchText) > -1;
                result = result || item.studentInfo.name.toLowerCase().indexOf(searchText) > -1;
                return result
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
