# Let's Trip BackEnd

8/30

## ToDo

1.board 엔티티 만들고 user, post 엔티티 수정
2.like 구현

end. test작성

## 프로젝트 개요

여행 후기 커뮤니티 프로젝트 백엔드  
NestJS, TypeORM, PostgreSQL, REST API

## API 명세

### /

- GET`/` => Get Mainpage Date✅
- POST`/join` => Create New User✅
- POST`/login` => User Login✅

### /users✅

- GET`/` => Get All Users✅
- GET`/:userId` => Get User Info✅
- PATCH`/:userId` => Edit User Info✅
- DELETE`/:userId` => Delete User✅
- PATCH`/:userId/password` => Password Change✅
- GET`/posts/:userId` => Get Users Posts

### /posts

- GET`/popular` => Get Top10 Liked Posts✅
- GET`/?limit={Post Limit}&{Sort Options}` => Get Posts✅
- POST`/:boardId` => Create New Post✅
- GET`/:postId` => Get Post✅
- PATCH`/:postId` => Edit Post✅
- DELETE`/:postId` => Delete Post✅

### /comments

- GET`/post/:postId?page={number}` => Get Current Post Comeents✅
- POST`/post/:postId` => Write Comment✅
- PATCH`/:commentId` => Edit Comment✅
- DELETE`/:commentId` => Delete Comment✅
- POST`/:commentId/` => Write Reply✅
- PATCH`/reply/:replyId` => Edit Reply✅
- DELETE`/reply/:replyId` => Delete Reply✅

### /boards

- GET`/` => Get All Approve Boards
- POST`/` => Board Registration Request
-

### /like

- GET`/users/:userId/` => Get Users Liked Posts

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
- reply : Reply[]
- managedBoard : Board

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
- board : Board

### Comment

- id: number
- createdAt : Date
- updatedAt : Date
- postId : number
- content : string
- writer? : User
- like: number
- nomem? : string
- password? : string
- reply? : Reply[]

### Reply

- id: number
- createdAt : Date
- updatedAt : Date
- commentId : number
- content : string
- writer? : User
- nomem? : string
- password? : string

### Board

- id: number
- createdAt : Date
- updatedAt : Date
- name : stirng
- manager : User
- posts : Post[]

### likedPost ❌

- id: number
- createdAt : Date
- updatedAt : Date
- user: User

### likedComment ❌

- id: number
- createdAt : Date
- updatedAt : Date
- user: User
