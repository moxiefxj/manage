<template>
    <div class="home-wrapper" v-loading="pageLoading">
        <div class="newContent">
            <el-table
                :data="commentList">
                <el-table-column
                    width="100px"
                    type="index"
                    align="center"
                    label="序号">
                </el-table-column>
                <el-table-column
                    width="200px"
                    align="center"
                    prop="name"
                    label="用户名">
                </el-table-column>
                <el-table-column
                    width="150px"
                    align="center"
                    prop="adjust"
                    label="建议内容">
                </el-table-column>
            </el-table>
             <div class="page-box" v-if="pageTotal !== 0">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="pageTotal"
                    @current-change = "handleCurrentPageChange"
                    :current-page.sync="pageNumber"
                    :page-size="pageSize"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { getCommentList } from '@/assets/js/api';
export default {
    data() {
        return {
            pageLoading: false,
            commentList:[],
            pageTotal:0,
            pageNumber:1,
            pageSize: 10,
        }
    },
    mounted() {
       this.getCommentList();
    },
    methods: {
       getCommentList(){
           getCommentList().then(res=>{
               this.commentList = res
           })
       }
    },
}
</script>
<style lang="scss">

</style>