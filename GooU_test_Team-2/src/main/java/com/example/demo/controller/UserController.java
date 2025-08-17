package com.example.demo.controller;

import com.example.demo.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final List<User> userList = new ArrayList<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    @PostMapping
    public ResponseEntity<User> addUser(@RequestBody User user) {
        if (user.getName() == null || user.getEmail() == null) {
            return ResponseEntity.badRequest().build();
        }
        
        Long id = idCounter.getAndIncrement();
        user.setId(id);
        userList.add(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userList.stream()
                .filter(user -> user.getId().equals(id))
                .findFirst()
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        for (int i = 0; i < userList.size(); i++) {
            User user = userList.get(i);
            if (user.getId().equals(id)) {
                if (updatedUser.getName() != null) {
                    user.setName(updatedUser.getName());
                }
                if (updatedUser.getEmail() != null) {
                    user.setEmail(updatedUser.getEmail());
                }
                if (updatedUser.getAge() != null) {
                    user.setAge(updatedUser.getAge());
                }
                return ResponseEntity.ok(user);
            }
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        boolean removed = userList.removeIf(user -> user.getId().equals(id));
        return removed ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getUserCount() {
        return ResponseEntity.ok((long) userList.size());
    }
} 