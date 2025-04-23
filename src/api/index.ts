import axios from 'axios';
// 创建 Axios 实例
const axiosInstance = axios.create({
  // 基础 URL（可选）
  baseURL: '/api',
  // 请求超时时间（可选）
  timeout: 10000,
  // 默认请求头（可选）
  // headers: {
  //   'Content-Type': 'application/json',
  // },
  // 其他配置（可选）
});

// 可选：添加请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么，例如添加认证令牌
 
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 可选：添加响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    // 对响应数据做些什么
    return response;
  },
  (error) => {
   
    return Promise.reject(error);
  }
);

export default axiosInstance;