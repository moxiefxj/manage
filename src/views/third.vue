<template>
    <div class="home-wrapper" v-loading="pageLoading">
        <el-button type="primary" class="btn-add" @click="addPrimarymenu()">新增二级菜单</el-button>
        <div class="newContent">
            <el-table
                :data="menuPrimaryList">
                <el-table-column
                    width="100px"
                    type="index"
                    align="center"
                    label="序号">
                </el-table-column>
                <el-table-column
                    width="350px"
                    align="center"
                    prop="name"
                    label="分类名">
                </el-table-column>
                <el-table-column prop="action" label="操作"  align="center" width="200">
                    <template slot-scope="scope">
                    <span class="text-link" @click="modifyMenu(scope.row)">修改</span>
                    <span class="text-link" @click="delMenu(scope.row.id)">删除</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
         <!-- 添加菜单 or 修改菜单-->
        <template>
            <el-dialog :title="menuTitle" :visible.sync="addPrimarymenuVisible" :modal-append-to-body='false'  width="500px">
            <el-form :model="primaryForm" :rules="rulePrimary" ref="primaryForm">
                <el-form-item label="子分类名" label-width="120px" prop="name">
                    <el-input v-model="primaryForm.name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addPrimarymenuVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitprimaryForm('primaryForm')">确 定</el-button>
            </div>
            </el-dialog>
        </template>
    </div>
</template>

<script>
import { fetchClassfiySecond,updateClassfiyPrimary,modifyClassfiy,delClassfiyPrimary } from '@/assets/js/api';

export default {
    data() {
        return {
            pageLoading: false,
            menuPrimaryList: [],
            primaryForm: {
                depth:"3",
                name:"",
            },
            rulePrimary: {
                name: [
                    { required: true, message: '请输入内容', trigger: 'blur' }
                ],
            },
            addPrimarymenuVisible: false,
            menuTitle: "添加菜单",
        }
    },
    mounted() {
       this.getMenuList();
    },
    methods: {
        getMenuList() {
            fetchClassfiySecond({parentId: this.$route.query.id}).then( res => {
                this.menuPrimaryList = res;
            })  
        },
        addPrimarymenu() {
            this.menuTitle = "新增子分类";
            this.addPrimarymenuVisible = true;
        },
        submitprimaryForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.menuTitle == "新增子分类"){
                        this.primaryForm.parentId = this.$route.query.id;
                        this.primaryForm.depth = "3";
                        console.log(this.primaryForm)
                        updateClassfiyPrimary(this.primaryForm).then( res => {
                            this.$message.success("新增子分类成功");
                            this.getMenuList();
                            this.addPrimarymenuVisible  = false;
                        })
                    } else {
                        modifyClassfiy(this.primaryForm).then( res => {
                            this.$message.success("修改菜单成功");
                            this.getMenuList();
                            this.addPrimarymenuVisible  = false;
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
        modifyMenu(row) {
            this.primaryForm.name = row.name;
            this.primaryForm.id = row.id;
            this.menuTitle = "修改菜单";
            this.addPrimarymenuVisible = true;
        },
        setting(id) {
            this.$router.push({
                path: '/data-manage/secondMenu',
                query: {
                    id
                }
            })
        },
       
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
.activeIcon{
   border: 1px solid blueviolet;
   border-radius: 20%;
}
</style>