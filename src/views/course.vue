<template>
    <div class="home-wrapper" v-loading="pageLoading">
        <el-button type="primary" class="btn-add" @click="addPrimarymenu()">新增课程</el-button>
        <div class="newContent">
            <el-table
                :data="courseList">
                <el-table-column
                    width="100px"
                    type="index"
                    align="center"
                    label="序号">
                </el-table-column>
                <el-table-column
                    width="200px"
                    align="center"
                    prop="courseName"
                    label="课程名">
                </el-table-column>
                <el-table-column
                    width="200px"
                    align="center"
                    prop="courseImg"
                    label="课程图片">
                    <template slot-scope="scope">
                        <img :src="scope.row.courseImg" class="courseImg" alt="">
                    </template>
                </el-table-column>
                <el-table-column
                    width="150px"
                    align="center"
                    prop="teacher"
                    label="讲师">
                </el-table-column>
                <el-table-column
                    width="200px"
                    align="center"
                    prop="promotionUrl"
                    label="宣传片">
                    <template slot-scope="scope">
                        <el-link :underline="false" :href="scope.row.promotionUrl">{{scope.row.promotionUrl}}</el-link>
                    </template>
                </el-table-column>

                 <el-table-column prop="action"  align="center" label="详情" width="100">
                    <template slot-scope="scope">
                    <span v-if="!scope.row.link" class="text-link" @click="setting(scope.row.id)">查看详情</span>
                    </template>
                </el-table-column>
                <el-table-column prop="action" label="操作"  align="center" width="100">
                    <template slot-scope="scope">
                    <span class="text-link" @click="modifyMenu(scope.row)">修改</span>
                    <span class="text-link" @click="delCourse(scope.row.id)">删除</span>
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
         <!-- 添加课程 or 修改课程-->
        <template>
            <el-dialog :title="menuTitle" :visible.sync="addPrimarymenuVisible" :modal-append-to-body='false'  width="500px">
            <el-form :model="course_form" :rules="rulePrimary" ref="course_form">
                <el-form-item label="课程名" label-width="120px" prop="course_name">
                    <el-input v-model="course_form.course_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="课程封面图" label-width="120px" prop="course_img"  v-if="menuTitle != '修改课程'">
                     <el-upload
                        class="upload-demo"
                        multiple
                        action=""
                        :limit="1"
                        accept=".png,.jpg"
                        :disabled="isDisabled"
                        :before-upload="beforeAvatarUpload"
                        :http-request="handleUpload"
                    >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <!-- 上传进度条 -->
                        <el-progress :percentage="percentage" v-if="percentage<100 && percentage>0"></el-progress>
                        <el-progress :percentage="percentage" status="success" v-if="percentage==100"></el-progress>
                    </el-upload>
                </el-form-item>
                <el-form-item label="简介" label-width="120px" prop="brief">
                    <el-input v-model="course_form.brief" type="textarea" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="讲师" label-width="120px" prop="teacher">
                    <el-input v-model="course_form.teacher" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="讲师个人介绍" label-width="120px" prop="teacher">
                    <el-input v-model="course_form.lecturerResume" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="课程类别" label-width="120px" prop="teacher" v-if="menuTitle != '修改课程'">
                    <el-cascader
                        v-model="course_form.classfiy"
                        :options="classfiyList"
                        :show-all-levels="false"
                        @change="handleChange"></el-cascader>
                </el-form-item>
                <el-form-item label="宣传片" label-width="120px" prop="url" v-if="menuTitle != '修改课程'">
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
                <el-button type="primary" @click="submitcourse_form('course_form')">确 定</el-button>
            </div>
            </el-dialog>
        </template>
    </div>
</template>

<script>
import { getClassfiyList,updateCourse,getCourseList,delCourse,modifyCourse } from '@/assets/js/api';
import COS from '../assets/js/cos-js-sdk-v5.min.js';
export default {
    data() {
        return {
            pageLoading: false,
            classfiyList:[],
            totalList:[],
            courseList: [],
            course_form: {
                url:"",
                course_img:"",
                classfiy:""
            },
            rulePrimary: {
                course_name: [
                    { required: true, message: '请输入内容', trigger: 'blur' }
                ],
                teacher: [
                    { required: true, message: '请输入内容', trigger: 'blur' }
                ],
                brief: [
                    { required: true, message: '请输入内容', trigger: 'blur' }
                ]
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

            pageTotal:0,
            pageNumber:1,
            pageSize: 10,
        }
    },
    mounted() {
       this.getCourseList();
       this.getClassfiy();
    },
    methods: {
        getCourseList() {
            getCourseList().then( res => {
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
                this.courseList = this.totalList[1];
                this.courseList = res;
            })  
        },
        handleCurrentPageChange(e){
            this.courseList = this.totalList[e]
        },
        getClassfiy(){
            getClassfiyList().then(res=>{
                let arr = []
                res.sort((a,b)=> a.depth - b.depth)
                // 重整返回值
                for (let i = 0; i < res.length; i++) {
                    let temp = {};
                    if(res[i].depth == 1){
                        temp.children = [];
                        temp.value = res[i].id;
                        temp.label = res[i].name;
                        arr.push(temp);
                    } else if(res[i].depth == 2){
                        for (let j = 0; j < arr.length; j++) {
                            if (arr[j].value == res[i].parentId){
                                temp.children = [];
                                temp.value = res[i].id;
                                temp.label = res[i].name;
                                arr[j].children.push(temp);
                            } 
                        }
                        
                    } else if(res[i].depth == 3) {
                        for (let z = 0; z < arr.length; z++) {
                        for (let j = 0; j < arr[z].children.length; j++) {
                            if (arr[z].children[j].value == res[i].parentId){
                                temp.value = res[i].id;
                                temp.label = res[i].name;
                                arr[z].children[j].children.push(temp);
                            }
                        }
                        }
                    }
                }
                for (let j = 0; j < arr.length; j++) {
                    if(arr[j].children.length == 0){
                        delete arr[j].children;

                    }else {
                        for (let z = 0; z < arr[j].children.length; z++) {
                            if(arr[j].children[z].children.length == 0){
                                delete arr[j].children[z].children;
                            }
                            
                        }
                    }
                    
                }
               this.classfiyList = arr
               console.log(this.classfiyList)
            })
        },
        handleChange(value){
            this.course_form.classfiy = value[value.length-1]
        },
        addPrimarymenu() {
            this.menuTitle = "新增课程";
            this.addPrimarymenuVisible = true;
        },
        submitcourse_form(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.menuTitle == "新增课程"){
                        if(this.course_form.url == ''){
                            this.$message.error("未上传宣传片");
                            return false
                        }
                        if(this.course_form.course_img == ''){
                            this.$message.error("未上传封面");
                            return false
                        } 
                        if(this.course_form.classfiy == ''){
                            this.$message.error("未选择类别");
                            return false
                        } 
                        updateCourse(this.course_form).then(res=>{
                            this.$message.success("新增成功");
                            // this.getcourseList();
                            this.addPrimarymenuVisible = false;
                        })
                       
                    } else {
                        modifyCourse(this.course_form).then(res=>{
                            this.$message.success("修改成功");
                            this.getCourseList();
                            this.addPrimarymenuVisible = false;
                        })
                    }
                    
                } else {
                    return false;
                }
            });
        },
        delCourse(id)  {
            this.$confirm('确定要删除吗？ 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delCourse({id: id}).then( res => {
                    this.$message.success("删除成功");
                    this.getcourseList();
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        modifyMenu(row) {
            this.course_form = {...row};
            this.course_form.course_name = row.courseName;
            this.course_form.id = row.id;
            this.course_form.course_img = row.courseImg;

            console.log(this.course_form)
            this.menuTitle = "修改课程";
            this.addPrimarymenuVisible = true;
        },
        setting(id) {
            this.$router.push({
                path: '/menu',
                query: {
                    id
                }
            })
        },


        handleUpload(e) {
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
                    this.percentage = parseInt(progressData.percent * 100);
                    this.isDisabled = true; // 禁止上传
                }
            }, (err, data) => {
                console.log(err || data);
                if (data && data.Location && data.statusCode == 200) {
                    this.course_form.course_img = `https://${data.Location}`
                    console.log(this.course_form)
                    this.isLoad = 1;
                }
                if (err) {
                    layer.msg('上传文件失败', {
                        icon: 2
                        , time: 1200
                        , shade: 0.5
                    });
                }
                this.isDisabled = false;
                this.uploadFail = true;
            });
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
                    this.course_form.url = `https://${data.Location}`
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
        beforeAvatarUpload(file) {
            this.uploadFile = file
            this.uploadFileName = file.name
            const isLt2M = file.size <= 1024000
            if (!isLt2M) {
                this.$message.error('上传文件大小不能超过 1MB!')
            }
            return isLt2M
        },
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