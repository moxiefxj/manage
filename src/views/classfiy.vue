<template>
    <div class="home-wrapper" v-loading="pageLoading">
        <el-button type="primary" class="btn-add" @click="addMenuVisible = true">新增分类</el-button>
        <!-- <h2 class="app-title-h2"></h2> -->
        <div class="newContent">
            <el-table
            :data="menuTopList">
                <el-table-column
                    width="100px"
                    type="index" 
                    label="序号">
                </el-table-column>
                <el-table-column
                    width="350px"
                    prop="name"
                    label="分类名称">
                </el-table-column>
                <el-table-column prop="action" label="子分类" width="200">
                    <template slot-scope="scope">
                    <span class="text-link" @click="setting(scope.row.id)">设置</span>
                    </template>
                </el-table-column>
                <el-table-column prop="action" label="操作" width="200">
                    <template slot-scope="scope">
                        <span class="text-link" @click="modify(scope.row)">修改</span>
                        <span class="text-link" @click="delMenu(scope.row.id)">删除</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
         <!-- 添加菜单-->
        <template>
            <el-dialog :title="menuTitle" :visible.sync="addMenuVisible" :modal-append-to-body='false'  width="500px">
            <el-form :model="menuForm" :rules="ruleMenu" ref="menuForm">
                <el-form-item label="分类名称" label-width="120px" prop="name">
                    <el-input v-model="menuForm.name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addMenuVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitmenuForm('menuForm')">确 定</el-button>
            </div>
            </el-dialog>
        </template>
    </div>
</template>

<script>
import { fetchClassfiyPrimary, updateClassfiyPrimary, delClassfiyPrimary, modifyClassfiy } from '@/assets/js/api';
export default {
    data() {
        return {
            pageLoading: false,
            menuTopList: [],
            menuForm: {
                name: "",
                depth: "1",
                parentId: 0
            },
            ruleMenu: {
                name: [
                    { required: true, message: '请输入顶层菜单名称', trigger: 'blur' }
                ],
            },
            addMenuVisible: false,

            menuTitle:"新增一级菜单"
        }
    },
    mounted() {
       this.getMenuList();
    },
    methods: {
        getMenuList() {
            fetchClassfiyPrimary().then( res => {
                this.menuTopList = res;
            })
        },
        submitmenuForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.menuTitle == "新增一级菜单"){
                        updateClassfiyPrimary(this.menuForm).then( res => {
                            this.$message.success("添加顶层菜单成功");
                            this.getMenuList();
                            this.addMenuVisible  = false;
                        })
                    }else {
                        modifyClassfiy(this.menuForm).then( res => {
                            this.$message.success("修改菜单成功");
                            this.getMenuList();
                            this.addMenuVisible  = false;
                        })
                    }
                    
                } else {
                    return false;
                }
            });
        },
        delMenu(id)  {
            this.$confirm('确定要删除吗？ 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delClassfiyPrimary({id: id}).then( res => {
                    this.$message.success("删除成功");
                    this.getMenuList();
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        modify(row) {
            console.log(row)
            this.menuForm.name = row.name;
            this.menuForm.id = row.id;
            this.menuTitle = "修改分类"
            this.addMenuVisible = true;
        },
        setting(id) {
            this.$router.push({
                path: '/second',
                query: {
                    id
                }
            })
        },
        handleCurrentPageChange(val) {
            this.pageNumber = val;
            this.getMenuList();
        }
    },
}
</script>
<style lang="scss">
.btn-add{
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;
}
.newContent{
    margin-top: 40px;
}
.text-link{
  margin: 0 5px;
}
</style>