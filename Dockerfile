# 使用轻量级的 Node.js 镜像
FROM node:20-slim

# 安装构建 better-sqlite3 所需的工具
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制所有项目文件
COPY . .

# 构建前端项目
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动服务器
CMD ["npm", "start"]
