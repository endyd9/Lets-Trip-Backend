# Let's Trip BackEnd

## ToDo

1.posts 마무리✅  
2.comment 엔티티✅  
3.comment 마무리
4.board 엔티티 만들고 user, post 엔티티 수정

## 프로젝트 개요

여행 후기 커뮤니티 프로젝트 백엔드
NestJS, TypeORM, PostgreSQL, REST API

## API 명세

### /

- GET`/` => Get Mainpage Date
- POST`/join` => Create New User✅
- POST`/login` => User Login✅

### /users

- GET`/` => Get All Users✅
- GET`/:uid` => Get User Info✅
- GET`/me` => Get My Info
- PATCH`/:uid` => Edit User Info✅
- DELETE`/:uid` => Delete User✅

### /posts

- GET`/popular` => Get Top10 Liked Posts✅
- GET`/?limit={Post Limit}&{Sort Options}` => Get Posts✅
- POST`/` => Create New Post✅
- GET`/:id` => Get Post✅
- PATCH`/:id` => Edit Post✅
- DELETE`/:id` => Delete Post✅

### /comments

- GET`/:postId?page={number}` => Get Current Post Comeents
- POST`/:postId` => Write Comment
- PATCH`/:commentId` => Edit Comment
- DELETE`/:commentId` => Delete Comment

## 테이블 명세

### User

- id : number
- createdAt : Date
- updatedAt : Date
- email : stirng
- password : string
- nickname : string
- avatarUrl : string
- posts : Post[]
- comments : Comment[]
- likedPost : Post[]

### Post

- id : number
- createdAt : Date
- updatedAt : Date
- title : string
- content : string
- imgUrl? : string
- writer? : User
- comments : Comment[]
- like: number
- view: number
- nomem? : string
- password? : string

### Comment

- id: number
- createdAt : Date
- updatedAt : Date
- content : string
- writer? : User
- like: number
- nomem? : string
- password? : string
- reply? : Rrply[]

### Board

- id: number
- createdAt : Date
- updatedAt : Date
- name : stirng
- manager : User
