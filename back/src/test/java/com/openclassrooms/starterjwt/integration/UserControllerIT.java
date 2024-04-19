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

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
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
    void setUp() {
        testUser = User.builder()
                .email("test@test.com")
                .password("azerty")
                .lastName("Test")
                .firstName("ReTest")
                .admin(false)
                .build();
    }

    @AfterEach
    void clean() {
        userRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("Obtenir un utilisateur par ID et retourne un utilisateur valide")
    public void testGetUserByIdFindsValidUser() throws Exception {
        //Given
        Long testUserId = userRepository.save(testUser).getId();

        this.mockMvc.perform(get("/api/user/" + testUserId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lastName").value("Test"));
    }

    @Test
    @DisplayName("Demande non autorisée pour supprimer un utilisateur par ID")
    public void testUnauthorizedUserDeletionById() throws Exception {
        //Given
        Long testUserId = userRepository.save(testUser).getId();

        //When
        this.mockMvc.perform(delete("/api/user/" + testUserId))

                //Then
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Suppression non autorisée d'utilisateur par ID avec demandeur invalide")
    public void testUnauthorizedUserDeletionByIdInvalidRequester() throws Exception {
        //Given
        Long testUserId = userRepository.save(testUser).getId();

        //When
        this.mockMvc.perform(delete("/api/user/" + testUserId).with(user("azerty@mail.com")))

                //Then
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Suppression autorisé d'utilisateur par ID pour utilisateur valide")
    public void testValidUserDeletionById() throws Exception {
        //Given
        Long testUserId = userRepository.save(testUser).getId();

        //When
        this.mockMvc.perform(delete("/api/user/" + testUserId).with(user("test@test.com")))

                //Then
                .andExpect(status().isOk());
        assertThat(userRepository.findByEmail("test@test.com").isPresent()).isFalse();
    }

    @Test
    @DisplayName("Suppression d'utilisateur non existant par utilisateur auth - BadRequest")
    public void testDeleteInexistentUserIsBadRequest() throws Exception {
        //Given

        //When
        this.mockMvc.perform(delete("/api/user/3A-1e").with(user("test@test.com")))

                //Then
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Obtention d'utilisateur non existant - BadRequest")
    public void testGetInexistentUserIsBadRequest() throws Exception {
        //Given

        //When
        this.mockMvc.perform(get("/api/user/aZerTy").with(user("test@test.com")))

                //Then
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Obtention d'utilisateur inexistant - NotFound")
    public void testGetNonexistentUserIsNotFound() throws Exception {
        //Given
        long testUserId = userRepository.save(testUser).getId()+1;

        //When
        this.mockMvc.perform(get("/api/user/"+testUserId).with(user("test@test.com")))

                //Then
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Suppression d'utilisateur non trouvé par utilisateur auth")
    public void testDeleteNonexistentUserIsNotFound() throws Exception {
        //Given
        long testUserId=userRepository.save(testUser).getId()+1;

        //When
        this.mockMvc.perform(delete("/api/user/"+testUserId).with(user("test@test.com")))

                //Then
                .andExpect(status().isNotFound());
    }
}
