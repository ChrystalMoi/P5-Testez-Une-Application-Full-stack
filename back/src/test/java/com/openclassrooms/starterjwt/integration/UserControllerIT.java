package com.openclassrooms.starterjwt.integration;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerIT {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp(){
        testUser = User.builder()
                .email("test@test.com")
                .password("azerty")
                .lastName("Test")
                .firstName("ReTest")
                .build();
    }

    @AfterEach
    void clean(){
        userRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles="USER")
    @DisplayName("Obtenir un utilisateur par ID retourne un utilisateur valide")
    public void testGetUserByIdFindsValidUser() throws Exception {
        //Given
        Long testUserId=userRepository.save(testUser).getId();

        this.mockMvc.perform(get("/api/user/" + testUserId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lastName").value("Test"));
    }
}
