# Let's Trip BackEnd

## 프로젝트 개요

여행 후기 커뮤니티 프로젝트 백엔드
NestJS, TypeORM, PostgreSQL, REST API

## API 명세

### /

- GET`/` => Get Mainpage Date
- GET`/popular` => Get Top10 Liked Posts
- POST`/join` => Create New User✅
- POST`/login` => User Login

### /users

- GET`/` => Get All Users✅
- GET`/:uid` => Get User Info✅
- PATCH`/:uid` => Edit User Info✅
- DELETE`/:uid` => Delete User✅

### /posts

- GET`/?limit={Post Limit}&{Sort Options}` => Get Posts
- POST`/` => Create New Post
- GET`/:id` => Get Post
- PATCH`/:id` => Edit Post
- DELETE`/:id` => Delete Post
