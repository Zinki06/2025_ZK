package com.example.demo;

import com.example.demo.model.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

public class PerformanceTestUtil implements CommandLineRunner {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String baseUrl = "http://localhost:8080/api/users";

    public static void main(String[] args) {
        System.out.println("Performance test utility - use with running Spring Boot application");
        PerformanceTestUtil util = new PerformanceTestUtil();
        try {
            util.run(args);
        } catch (Exception e) {
            System.err.println("Performance test failed: " + e.getMessage());
        }
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== Spring Boot REST API 성능 테스트 ===");
        
        testResponseTime();
        testConcurrentRequests();
        testMemoryUsage();
        
        System.out.println("=== 테스트 완료 ===");
    }

    private void testResponseTime() {
        System.out.println("\n--- 응답 시간 테스트 ---");
        
        List<Long> postTimes = new ArrayList<>();
        List<Long> getTimes = new ArrayList<>();
        
        for (int i = 0; i < 100; i++) {
            User user = new User("테스트" + i, "test" + i + "@example.com", 20 + (i % 50));
            
            long startTime = System.nanoTime();
            restTemplate.postForObject(baseUrl, user, User.class);
            long postTime = System.nanoTime() - startTime;
            postTimes.add(postTime / 1_000_000);
            
            startTime = System.nanoTime();
            restTemplate.getForObject(baseUrl, User[].class);
            long getTime = System.nanoTime() - startTime;
            getTimes.add(getTime / 1_000_000);
        }
        
        double avgPostTime = postTimes.stream().mapToLong(Long::longValue).average().orElse(0);
        double avgGetTime = getTimes.stream().mapToLong(Long::longValue).average().orElse(0);
        
        System.out.printf("POST 평균 응답시간: %.2f ms\n", avgPostTime);
        System.out.printf("GET 평균 응답시간: %.2f ms\n", avgGetTime);
    }

    private void testConcurrentRequests() {
        System.out.println("\n--- 동시 요청 테스트 ---");
        
        int[] concurrentUsers = {1, 10, 50, 100};
        
        for (int userCount : concurrentUsers) {
            ExecutorService executor = Executors.newFixedThreadPool(userCount);
            List<Future<Long>> futures = new ArrayList<>();
            
            long startTime = System.currentTimeMillis();
            
            for (int i = 0; i < userCount; i++) {
                final int userId = i;
                futures.add(executor.submit(() -> {
                    try {
                        long requestStart = System.nanoTime();
                        User user = new User("동시테스트" + userId, "concurrent" + userId + "@example.com", 25);
                        restTemplate.postForObject(baseUrl, user, User.class);
                        return (System.nanoTime() - requestStart) / 1_000_000;
                    } catch (Exception e) {
                        return -1L;
                    }
                }));
            }
            
            List<Long> responseTimes = new ArrayList<>();
            for (Future<Long> future : futures) {
                try {
                    Long responseTime = future.get(10, TimeUnit.SECONDS);
                    if (responseTime > 0) {
                        responseTimes.add(responseTime);
                    }
                } catch (Exception e) {
                    System.err.println("요청 실패: " + e.getMessage());
                }
            }
            
            long totalTime = System.currentTimeMillis() - startTime;
            double avgResponseTime = responseTimes.stream().mapToLong(Long::longValue).average().orElse(0);
            
            System.out.printf("%d명 동시 사용자 - 평균 응답시간: %.2f ms, 총 처리시간: %d ms\n", 
                userCount, avgResponseTime, totalTime);
            
            executor.shutdown();
        }
    }

    private void testMemoryUsage() {
        System.out.println("\n--- 메모리 사용량 테스트 ---");
        
        Runtime runtime = Runtime.getRuntime();
        
        long beforeMemory = runtime.totalMemory() - runtime.freeMemory();
        
        for (int i = 0; i < 1000; i++) {
            User user = new User("메모리테스트" + i, "memory" + i + "@example.com", 25);
            restTemplate.postForObject(baseUrl, user, User.class);
        }
        
        runtime.gc();
        
        long afterMemory = runtime.totalMemory() - runtime.freeMemory();
        long memoryUsed = afterMemory - beforeMemory;
        
        System.out.printf("1000명 사용자 추가 후 메모리 사용량: %.2f MB\n", memoryUsed / 1024.0 / 1024.0);
        System.out.printf("사용자당 평균 메모리: %.2f KB\n", (memoryUsed / 1000.0) / 1024.0);
        
        ResponseEntity<User[]> response = restTemplate.getForEntity(baseUrl, User[].class);
        User[] users = response.getBody();
        if (users != null) {
            System.out.printf("총 사용자 수: %d명\n", users.length);
        }
    }
}