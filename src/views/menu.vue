<template>
    <div class="home-wrapper" v-loading="pageLoading">
        <el-button type="primary" class="btn-add" @click="addPrimarymenu()">新增章节</el-button>
        <div class="newContent">
            <el-table
                :data="menuList">
                <el-table-column
                    width="100px"
                    type="index"
                    align="center"
                    label="序号">
                </el-table-column>
                <el-table-column
                    width="200px"
                    align="center"
                    prop="chapter"
                    label="章名称">
                </el-table-column>
                <el-table-column
                    width="200px"
                    align="center"
                    prop="section"
                    label="节名称">
                </el-table-column>
                <el-table-column
                    width="200px"
                    align="center"
                    prop="courseUrl"
                    label="视频链接">
                    <template slot-scope="scope">
                        <el-link :underline="false" :href="scope.row.courseUrl">{{scope.row.courseUrl}}</el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="action" label="操作"  align="center" width="100">
                    <template slot-scope="scope">
                    <span class="text-link" @click="modifyMenu(scope.row)">修改</span>
                    <span class="text-link" @click="delMenu(scope.row.id)">删除</span>
                    </template>
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
         <!-- 添加章 or 修改章-->
        <template>
            <el-dialog :title="menuTitle" :visible.sync="addPrimarymenuVisible" :modal-append-to-body='false'  width="500px">
            <el-form :model="menu_form" :rules="rulePrimary" ref="menu_form">
                <el-form-item label="节名" label-width="120px" prop="section">
                    <el-input v-model="menu_form.section" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="章" label-width="120px" prop="teacher">
                    <el-radio v-model="radio" label="1">新增章</el-radio>
                    <el-radio v-if="chapterList.length > 0" v-model="radio" label="2">选择已有章</el-radio>
                </el-form-item>
                <el-form-item  label="章节名称" label-width="120px" prop="chapter">
                    <el-input v-if="radio == 1" v-model="menu_form.chapter"></el-input>
                    <el-cascader
                        v-if="radio == 2"
                        v-model="menu_form.chapter"
                        :options="chapterList"
                        :show-all-levels="false"
                        @change="handleChange"></el-cascader>
                </el-form-item>
                <el-form-item v-if="menuTitle != '修改章节'" label="视频" label-width="120px" prop="course_url">
                    <el-upload
                        class="upload-demo"
                        multiple
                        action=""
                        :limit="1"
                        accept=".mp4,MP4,.wmv"
                        :disabled="isDisabledUrl"
                        :before-upload="beforeAvatarUploadUrl"
                        :http-request="handleUploadUrl"
                    >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <!-- 上传进度条 -->
                        <el-progress :percentage="percentageUrl" v-if="percentageUrl<100 && percentageUrl>0"></el-progress>
                        <el-progress :percentage="percentageUrl" status="success" v-if="percentageUrl==100"></el-progress>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addPrimarymenuVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitmenu_form('menu_form')">确 定</el-button>
            </div>
            </el-dialog>
        </template>
    </div>
</template>

<script>
import { getMenuList, updateMenu, delMenu, getChapterList,modifyMenu } from '@/assets/js/api';
import COS from '../assets/js/cos-js-sdk-v5.min.js';
export default {
    data() {
        return {
            pageLoading: false,
            menuList: [],
            totalList:[],
            chapterList:[],
            menu_form: {
                course_url:"",
                section:'',
                chapter:""
            },
            rulePrimary: {
                section: [
                    { required: true, message: '请输入内容', trigger: 'blur' }
                ],
                chapter: [
                    { required: true, message: '请输入内容', trigger: 'blur' }
                ],
            },
            addPrimarymenuVisible: false,
            menuTitle: "添加课程",

            percentage: 0, // 上传进度
            percentageUrl:0,
            originName: '', // 文件名
            originSize: '', // 文件大小
            uploadFail: false,
            uploadFailUrl:false,
            isDisabled: false,
            isDisabledUrl:false,
            isLoad: 0, // 是否完成了上传

            radio:"1",
            pageTotal:0,
            pageNumber:1,
            pageSize: 10,
        }
    },
    mounted() {
       this.getMenuList();
       this.getChapterList();
    },
    methods: {
        getMenuList() {
            getMenuList({id:this.$route.query.id}).then( res => {
                this.pageTotal = res.length;
                let temp = [];
                for (let i = 0; i < res.length; i++) {
                    if(i % 10 == 0){
                        this.totalList.push(temp)
                        temp = [];
                    }
                    temp.push(res[i]);
                }
                if(temp.length > 0){
                    this.totalList.push(temp)
                }
                this.menuList = this.totalList[1];
            })  
        },
        handleCurrentPageChange(e){
            this.menuList = this.totalList[e]
        },
        getChapterList(){
            getChapterList({id:this.$route.query.id}).then(res => {
                if(res.length>0){
                    res.forEach(element => {
                        element.label = element.chapter;
                        element.value = element.chapter;
                    });
                }
                this.chapterList = res
            })
        },
        handleChange(value){
            this.menu_form.chapter = value[value.length-1]
        },
        addPrimarymenu() {
            this.menuTitle = "新增课程";
            this.menu_form.section = "";
            this.menu_form.chapter = "";
            this.menu_form.course_url = "";
            this.addPrimarymenuVisible = true;
        },
        submitmenu_form(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.menuTitle == "新增课程"){ 
                        this.menu_form.course_id = this.$route.query.id;
                        if(this.menu_form.course_url == ''){
                            this.$message.error("未上传视频");
                            return false
                        }
                        updateMenu(this.menu_form).then(res=>{
                            this.$message.success("新增成功");
                            this.getMenuList();
                            this.getChapterList();
                            this.addPrimarymenuVisible = false;
                        })
                       
                    } else {
                        modifyMenu(this.menu_form).then(res=>{
                            this.$message.success("更新成功");
                            this.getMenuList();
                            this.getChapterList();
                            this.addPrimarymenuVisible = false;
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
                delMenu({id: id}).then( res => {
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
            this.menu_form.id = row.id;
            this.menuTitle = "修改章节";
            this.menu_form.section = row.section;
            this.menu_form.chapter = row.chapter;
            this.addPrimarymenuVisible = true;
        },

        handleUploadUrl(e) {
            let file = e.file;
            if (!file) return;
            this.originName = file.name;
            this.originSize = file.size;
            // 实例化对象
            var cos = new COS({
                SecretId: "AKIDJMAi01oGSOJ0RUAwIWXZR4QWLvEInxSi",
                SecretKey: "MtUpxsY7RdaIju23oKgmcokqhHo67C3h",
            })
            // 上传
            cos.putObject({
                Bucket: "examplecourse-1304676805",
                Region: "ap-chengdu",
                Key: `course/${this.originName}`, // 文件名
                Body: file, // 上传文件对象
                onProgress: (progressData) => {
                    this.percentageUrl = parseInt(progressData.percent * 100);
                    this.isDisabledUrl = true; // 禁止上传
                }
            }, (err, data) => {
                console.log(err || data);
                if (data && data.Location && data.statusCode == 200) {
                    this.menu_form.course_url = `https://${data.Location}`
                    this.isLoad = 1;
                }
                if (err) {
                    layer.msg('上传文件失败', {
                        icon: 2
                        , time: 1200
                        , shade: 0.5
                    });
                }
                this.isDisabledUrl = false;
                this.uploadFailUrl = true;
            });
        },
        // 上传前检查
        beforeAvatarUploadUrl(file) {
            this.uploadFile = file
            this.uploadFileName = file.name
            const isLt2M = file.size / 1024 / 1024 <= 102400
            if (!isLt2M) {
                this.$message.error('上传文件大小不能超过 1GB!')
            }
            return isLt2M
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
.courseImg{
    width: 100px;
    height: 50px;
}
</style>