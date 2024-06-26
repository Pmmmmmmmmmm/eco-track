import { fileURLToPath, URL } from 'node:url'
import postcssPresetEnv from 'postcss-preset-env'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
    // vueJsx(),
    // VueDevTools(),
  ],
  css: {
    // 预处理器配置项
    preprocessorOptions: {
      less: {
        math: 'always',
        javascriptEnabled: true,
        // 意义不明，但是有用
        modifyVars: {
          hack: `true; @import (reference) "${path.resolve('src/assets/customer.less')}";`,
        },
        // 在每个less文件头部加上这一段
        // additionalData: `@import "${path.resolve(__dirname, 'src/assets/customer.less')}";`

      }
    },
    postcss: { plugins: [postcssPresetEnv()] }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
