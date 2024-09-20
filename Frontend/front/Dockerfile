# 빌드 스테이지
FROM node:18-alpine AS build-stage
WORKDIR /app

# npm dependencies 설치
COPY package*.json ./
RUN npm install

# 모든 소스 파일 복사
COPY . .

# 빌드 실행
RUN npm run build

# 빌드 디렉토리 확인을 위해 파일 리스트 출력
RUN ls -la /app/build

# production-stage
FROM nginx:stable-alpine AS production-stage

# 빌드된 파일을 Nginx의 HTML 경로로 복사
COPY --from=build-stage /app/build /usr/share/nginx/html

# Nginx 노출 포트
EXPOSE 80

# Nginx 실행 명령어
CMD ["nginx", "-g", "daemon off;"]
