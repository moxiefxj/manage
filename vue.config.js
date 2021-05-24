module.exports = {
    // baseUrl: process.env.NODE_ENV === 'production' ? '/' : '/',
    lintOnSave: false,
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:8888/',
          changeOrigin:true
        }
      },
    },
    css: {
      loaderOptions: {
        sass: {
          data: '@import "@/assets/css/var.scss";',
        },
      },
    },
    pages: {
      index: {
        entry: 'src/main.js',
        template: 'public/index.html',
      },
    },
  };
  