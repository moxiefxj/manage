import axios from "axios";
import qs from "qs";
import { Message } from "element-ui";
import Vue from 'vue';

const apiUrl = "http://192.168.43.180:8888"
const fetch = axios.create();
fetch.interceptors.response.use(
  response => {
    if (response.data.code !== 200) {
      Message({
        type: "error",
        message: response.data.msg,
        duration: 5000
      });
      return Promise.reject(response.data);
    }
    return response.data.data;
  },
  error => { 
    if (error.response.status === 401) {
      Vue.$pub.login();
    } else {
      Message({
        type: "error",
        message: "网络错误",
        duration: 5000
      });
      return Promise.reject(error);
    }
  }
);

// formData格式
const formDataProps = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    Accept: "application/json;charset=UTF-8"
  },
  transformRequest: [
    data =>
      qs.stringify(data, {
        arrayFormat: "indices",
        allowDots: true
      })
  ]
};

// application/json格式
const jsonDataProps = {
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    Accept: "application/json;charset=UTF-8"
  }
};

/* ----- API方法 ----- */

/**
 * 管理台
 */

 export const fetchClassfiyPrimary = (data) => {
    return fetch({
      url: `${apiUrl}/getClassfiyPrimary`,
      method: "get",
      data,
    });
  };
  export const updateClassfiyPrimary = (data) => {
    return fetch({
      url: `${apiUrl}/updateClassfiyPrimary`,
      method: "post",
      data,
    });
  };
  export const delClassfiyPrimary = (data) => {
    return fetch({
      url: `${apiUrl}/delClassfiyPrimary`,
      method: "post",
      data,
    });
  };
  
  export const fetchClassfiySecond = (data) => {
    return fetch({
      url: `${apiUrl}/getClassfiySecond`,
      method: "post",
      data,
    });
  }
  export const modifyClassfiy = (data) => {
    return fetch({
      url: `${apiUrl}/modifyClassfiy`,
      method: "post",
      data,
    });
  }
  export const getClassfiyList = (data) => {
    return fetch({
      url: `${apiUrl}/getClassfiy`,
      method: "get",
      data,
    });
  }
  export const updateCourse = (data) =>{
    return fetch({
      url:`${apiUrl}/course/course/updateCourse`,
      method:"post",
      data,
    })
  }
  export const delCourse = (data) =>{
    return fetch({
      url: `${apiUrl}/course/course/delCourse`,
      method: "post",
      data,
    });
  }
  export const modifyCourse = (data) =>{
    return fetch({
      url: `${apiUrl}/course/course/modifyCourse`,
      method: "post",
      data,
    });
  }
  export const getCourseList = (data) => {
    return fetch({
      url: `${apiUrl}/course/course/getCourseList`,
      method: "get",
      data,
    });
  }
  export const getMenuList = (data) => {
    return fetch({
      url: `${apiUrl}/course/menu/list`,
      method: "post",
      data,
    });
  }
  export const updateMenu = (data) => {
    return fetch({
      url: `${apiUrl}/course/menu/addMenu`,
      method: "post",
      data,
    });
  }
  export const delMenu = (data) => {
    return fetch({
      url: `${apiUrl}/course/menu/delMenu`,
      method: "post",
      data,
    });
  }
  export const getChapterList = (data) => {
    return fetch({
      url: `${apiUrl}/course/menu/chapterList`,
      method: "post",
      data,
    });
  }
  export const modifyMenu = (data) => {
    return fetch({
      url: `${apiUrl}/course/menu/modifyMenu`,
      method: "post",
      data,
    });
  }
  export const getCommentList = () => {
    return fetch({
      url: `${apiUrl}/course/adjust/getAdjustList`,
      method: "get",
    });
  }
  
  
  
  


