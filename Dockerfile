FROM node:16.16.0-alpine

# 環境変数を定義（Dockerfileとコンテナ内で参照可）
ENV LANG=C.UTF-8 \
    TZ=Asia/Tokyo

WORKDIR /app
