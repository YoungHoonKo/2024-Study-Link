# Study Link

> *Join the best projects in the world — Explore, Create, and Inspire with StudyLink*

함께 공부하고 프로젝트를 할 사람들을 연결하는 커뮤니티 웹 서비스 **StudyLink**의 Spring Boot 프로젝트입니다. (2024)

회원가입·로그인(JWT), 관심 분야와 기술 스택 프로필, 게시판과 댓글, 관리자 페이지를 제공합니다.

## Tech Stack

| 구분 | 기술 |
| --- | --- |
| Language | Java 17 (Gradle Kotlin DSL) |
| Framework | Spring Boot 3.3, Spring Security, Spring Data JPA, Validation |
| Auth | JWT (jjwt 0.12, Access / Refresh Token), Redis |
| View | Thymeleaf (+ Spring Security extras) |
| Database | MySQL 8 |
| Infra | Docker, Docker Compose |

## Features

- **인증**: 회원가입, 로그인, JWT 발급과 재발급(`/api/auth/reissue`), 토큰 검증, 로그아웃 토큰 블랙리스트
- **사용자**: 마이페이지, 프로필 수정, 비밀번호 변경, 회원 탈퇴, 관심 분야·기술 스택 추가와 삭제
- **게시판**: 글 작성·수정·삭제, 페이징, 댓글
- **관리자**: 회원·게시글 관리, 관리자 권한 부여·회수 (일반 / 최고 관리자)
- **에러 페이지**: 401, 403, 404

## Project Structure

```text
src/main/java/com/project/project/
├── config/        # Spring Security 등 설정
├── controller/    # Auth, User, Board, Comment, Admin, View 컨트롤러
├── dto/           # 요청·응답 DTO
├── entity/        # User, Board, Comment, Admin, RefreshToken, BlackList ...
├── exception/     # 예외 처리
├── repository/    # JPA Repository
├── response/      # 공통 응답 형식
├── service/       # 비즈니스 로직
└── util/          # JWT 필터, 로그인 필터, 인증 실패 핸들러
src/main/resources/
├── templates/     # Thymeleaf 화면 (user, board, Admin, error)
└── static/        # CSS, 이미지
```

## Getting Started

DB 접속 정보와 JWT 비밀키는 코드에 넣지 않고 환경변수로 설정합니다.

```bash
cp .env.example .env      # 값 채우기
docker compose up --build # http://localhost:8081
```

로컬에서 직접 실행할 때는 MySQL과 Redis(localhost:6379)를 띄운 뒤, 같은 환경변수를 export 하고 실행합니다.

```bash
export SPRING_DATASOURCE_PASSWORD=...
export JWT_SECRET=...
./gradlew bootRun
```
