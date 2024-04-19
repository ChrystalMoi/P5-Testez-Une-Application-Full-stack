package com.openclassrooms.starterjwt.service;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock // Création d'un mock pour le UserRepository
    private UserRepository userRepository;

    @InjectMocks // Injection du mock userRepository dans le UserService
    private UserService userService;

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
        // Création d'un mock d'utilisateur pour simuler ce que le repository doit renvoyer
        User mockUser=User.builder()
                .email("test@test.com")
                .firstName("Test")
                .lastName("Test")
                .password("azerty")
                .admin(true)
                .build();

        // Configuration du comportement mock : lorsqu'on appelle findById avec l'ID 1L, renvoyer ce mock d'utilisateur
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));

        // When - Ce que je veux tester
        User userFound=userService.findById(1L);

        // Then - Comparaison du resultat obtenu de when avec ce qui est attendu
        verify(userRepository, times(1)).findById(1L); // Vérification que l'utilisateur retourné correspond à celui qu'on a configuré dans le mock
        assertEquals(mockUser, userFound); // Comparaison entre l'utilisateur mocké et celui retourner par la méthode
    }
}