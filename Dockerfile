FROM positivly/prisma-binaries:latest as prisma
FROM node:16.16.0-alpine

# Dockerfile内で使用する変数を定義
ARG RUNTIME_PACKAGES='libc6-compat openssl bash git'

# 環境変数を定義（Dockerfileとコンテナ内で参照可）
ENV LANG=C.UTF-8 \
    TZ=Asia/Tokyo

RUN apk update && \
    apk upgrade && \
    apk add --no-cache ${RUNTIME_PACKAGES} && \
    npm i -g @nestjs/cli

WORKDIR /app

# For Prisma
ENV PRISMA_QUERY_ENGINE_BINARY=/prisma-engines/query-engine \
    PRISMA_MIGRATION_ENGINE_BINARY=/prisma-engines/migration-engine \
    PRISMA_INTROSPECTION_ENGINE_BINARY=/prisma-engines/introspection-engine \
    PRISMA_FMT_BINARY=/prisma-engines/prisma-fmt \
    PRISMA_CLI_QUERY_ENGINE_TYPE=binary \
    PRISMA_CLIENT_ENGINE_TYPE=binary
COPY --from=prisma /prisma-engines/query-engine /prisma-engines/migration-engine /prisma-engines/introspection-engine /prisma-engines/prisma-fmt /prisma-engines/
