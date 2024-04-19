package com.openclassrooms.starterjwt.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerIT {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ObjectMapper mapper;

    final private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .email("test@test.com")
                .lastName("Test")
                .firstName("ReTest")
                .password(passwordEncoder.encode("azerty"))
                .admin(false)
                .build();
    }

    @AfterEach
    void clean(){
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Lorsque je demande une connexion avec les info d'id correctes, la réponse est OK et renvoie les données correctes")
    public void testValidCredentialsAuthentication() throws Exception {
        // Given
        userRepository.save(testUser);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@test.com");
        loginRequest.setPassword("azerty");

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.username").value(testUser.getEmail()))
                .andExpect(jsonPath("$.firstName").value(testUser.getFirstName()))
                .andExpect(jsonPath("$.lastName").value(testUser.getLastName()));

        // Additional assertions
        assertTrue(userRepository.findByEmail("test@test.com").isPresent(), "L'utilisateur devrait être présent dans le référentiel après la connexion.");
    }

    @Test
    @DisplayName("Lorsque je demande à m'inscrire avec des données correctes, la réponse est OK")
    public void testRegisterUser() throws Exception {
        //Given
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@test.com");
        signupRequest.setPassword("azerty");
        signupRequest.setLastName("Test");
        signupRequest.setFirstName("ReTest");

        //When
        this.mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(signupRequest)))

                //Then
                .andExpect(status().isOk());
        assertThat(userRepository.findByEmail("test@test.com").isPresent()).isTrue();
    }

    @Test
    @DisplayName("Inscription échoue si l'e-mail est déjà pris")
    public void testRegistrationFailsIfEmailAlreadyExists() throws Exception {
        // Given
        userRepository.save(testUser);

        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@test.com");
        signupRequest.setPassword("azerty");
        signupRequest.setLastName("Test");
        signupRequest.setFirstName("ReTest");

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(signupRequest)))
                .andExpect(status().isBadRequest());
    }

}