FROM bellsoft/liberica-openjdk-alpine:17

WORKDIR /app

COPY gradlew /app/
COPY gradle /app/gradle
COPY build.gradle.kts /app/
COPY settings.gradle.kts /app/
COPY src /app/src

RUN chmod +x gradlew

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "while true; do ./gradlew clean build && java -jar build/libs/project-0.0.1-SNAPSHOT.jar; sleep 10; done"]