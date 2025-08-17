package com.example.demo;

import com.example.demo.model.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@SpringJUnitConfig
public class UserControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @org.junit.jupiter.api.BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    public void testCreateUser() throws Exception {
        User user = new User("홍길동", "hong@example.com", 25);

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("홍길동"))
                .andExpect(jsonPath("$.email").value("hong@example.com"))
                .andExpect(jsonPath("$.age").value(25))
                .andExpect(jsonPath("$.id").exists());
    }

    @Test
    public void testCreateUserWithMissingFields() throws Exception {
        User user = new User();
        user.setName("홍길동");

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testGetAllUsers() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    public void testGetUserById() throws Exception {
        User user = new User("김철수", "kim@example.com", 30);

        String response = mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        User createdUser = objectMapper.readValue(response, User.class);

        mockMvc.perform(get("/api/users/" + createdUser.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("김철수"))
                .andExpect(jsonPath("$.email").value("kim@example.com"));
    }

    @Test
    public void testGetUserByIdNotFound() throws Exception {
        mockMvc.perform(get("/api/users/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testUpdateUser() throws Exception {
        User user = new User("이영희", "lee@example.com", 28);

        String response = mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        User createdUser = objectMapper.readValue(response, User.class);

        User updateData = new User();
        updateData.setName("이영희 수정");
        updateData.setAge(29);

        mockMvc.perform(put("/api/users/" + createdUser.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("이영희 수정"))
                .andExpect(jsonPath("$.age").value(29))
                .andExpect(jsonPath("$.email").value("lee@example.com"));
    }

    @Test
    public void testDeleteUser() throws Exception {
        User user = new User("박민수", "park@example.com", 35);

        String response = mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        User createdUser = objectMapper.readValue(response, User.class);

        mockMvc.perform(delete("/api/users/" + createdUser.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/users/" + createdUser.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testGetUserCount() throws Exception {
        mockMvc.perform(get("/api/users/count"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
}