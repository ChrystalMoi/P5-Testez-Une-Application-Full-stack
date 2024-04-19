package com.openclassrooms.starterjwt.service;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Optional;

import static org.mockito.Mockito.*;

@SpringBootTest
class UserServiceTest {
    @MockBean // Création d'un mock pour le UserRepository
    private UserRepository userRepository;

    @Autowired // Injection du mock userRepository dans le UserService
    private UserService userService;

    final User mockUser=User.builder()
            .email("test@test.com")
            .firstName("Test")
            .lastName("Test")
            .password("azerty")
            .admin(true)
            .build();

    @Test
    @DisplayName("Quand je supprime un utilisateur, il doit appeler le repo user")
    void deleteTestUser() {
        //Given - Donnée en entrée
        Long userId = 1L;

        //When - Ce que je veux tester
        userService.delete(userId);

        //Then - Comparaison du resultat obtenu de when avec ce qui est attendu
        verify(userRepository, times(1)).deleteById(userId);
    }

    @Test
    @DisplayName("Quand je trouve un utilisateur valide FindById, il doit renvoyer un mock et appeler userRepo")
    void findByIdTestUser() {
        // Given - Donnée en entrée
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));

        // When - Ce que je veux tester
        userService.findById(1L);

        // Then - Comparaison du resultat obtenu de when avec ce qui est attendu
        verify(userRepository, times(1)).findById(1L);
    }
}