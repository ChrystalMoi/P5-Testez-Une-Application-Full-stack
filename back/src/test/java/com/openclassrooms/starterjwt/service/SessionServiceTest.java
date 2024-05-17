package com.openclassrooms.starterjwt.service;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class SessionServiceTest {
    @MockBean
    SessionRepository sessionRepository;

    @MockBean
    UserRepository userRepository;

    @Autowired
    SessionService sessionService;

    final Session sessionMock=Session.builder()
            .id(13L)
            .name("test session mock")
            .date(new Date())
            .description("Test d'un mock pour session")
            .users(new ArrayList<>())
            .build();
    final User userMock=User.builder()
            .id(12L)
            .firstName("Lit")
            .lastName("Blanc")
            .email("test@mail.com")
            .admin(false)
            .password("azerty")
            .build();

    @Test
    @DisplayName("Devrait créer une nouvelle session")
    void createTestSession() {
        // Given
        Session sessionToCreate = new Session(); // Créez une session de test si nécessaire
        when(sessionRepository.save(sessionToCreate)).thenReturn(sessionToCreate);

        // When
        Session createdSession = sessionService.create(sessionToCreate);

        // Then
        assertNotNull(createdSession);
        verify(sessionRepository, times(1)).save(sessionToCreate);
    }

    @Test
    @DisplayName("Devrait supprimer une session")
    void deleteTestSession() {
        // Given
        Long sessionId = 1L;

        // When
        sessionService.delete(sessionId);

        // Then
        verify(sessionRepository, times(1)).deleteById(sessionId);
    }

    @Test
    @DisplayName("Devrait retourner la liste de toutes les sessions")
    void findAllTestSession() {
        // Given
        List<Session> expectedSessions = new ArrayList<>();
        when(sessionRepository.findAll()).thenReturn(expectedSessions);

        // When
        List<Session> actualSessions = sessionService.findAll();

        // Then
        assertEquals(expectedSessions.size(), actualSessions.size());
        verify(sessionRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Devrait retourner la session avec l'ID spécifié")
    void getByIdTestSession() {
        // Given
        Long sessionId = 1L;
        Session expectedSession = new Session();
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(expectedSession));

        // When
        Session actualSession = sessionService.getById(sessionId);

        // Then
        assertNotNull(actualSession);
        assertEquals(expectedSession, actualSession);
        verify(sessionRepository, times(1)).findById(sessionId);
    }

    @Test
    @DisplayName("Devrait mettre a jour la session avec l'ID spécifié")
    void updateTestSession() {
        // Given
        Long sessionId = 1L;
        Session sessionToUpdate = new Session();
        when(sessionRepository.save(sessionToUpdate)).thenReturn(sessionToUpdate);

        // When
        Session updatedSession = sessionService.update(sessionId, sessionToUpdate);

        // Then
        assertNotNull(updatedSession);
        assertEquals(sessionId, updatedSession.getId());
        verify(sessionRepository, times(1)).save(sessionToUpdate);
    }

    @Test
    @DisplayName("Devrait permettre à un utilisateur de participer à la session")
    void participateTestSession() {
        //Given

        //When
        sessionService.update(22L,sessionMock);

        //Then
        verify(sessionRepository,times(1)).save(sessionMock);
    }

    @Test
    @DisplayName("Devrait lancer une exception si la session n'existe pas")
    void noLongerParticipateNoExistingSessionTestSession() {
        // Given
        Long sessionId = 1L;

        // When/Then
        assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(sessionId, 1L));
        verify(sessionRepository, never()).save(any());
    }

    @Test
    @DisplayName("Devrait retirer l'utilisateur de la session s'il participe déjà")
    void noLongerParticipateUserParticipatingTestSession() {
        // Given
        Long sessionId = 1L;
        Long userId = 1L;
        Session session = new Session();
        session.setId(sessionId);
        User user = new User();
        user.setId(userId);
        session.setUsers(Collections.singletonList(user));

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        // When
        sessionService.noLongerParticipate(sessionId, userId);

        // Then
        verify(sessionRepository, times(1)).findById(sessionId);
        verify(sessionRepository, times(1)).save(session);
        assertFalse(session.getUsers().contains(user));
    }

    @Test
    @DisplayName("Devrait ne rien faire si l'utilisateur ne participe pas déjà à la session")
    void noLongerParticipateUserNotParticipatingTestSession() {
        // Given
        Long sessionId = 1L;
        Long userId = 1L;
        Session session = new Session();
        session.setId(sessionId);
        session.setUsers(Collections.emptyList());

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        // When/Then
        assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(sessionId, userId));
        verify(sessionRepository, never()).save(any());
    }

    @Test
    @DisplayName("Devrait lancer une NotFoundException si la session n'existe pas")
    void participateNoExistingSessionTest() {
        // Given
        Long sessionId = 1L;
        Long userId = 1L;

        // When/Then
        assertThrows(NotFoundException.class, () -> sessionService.participate(sessionId, userId));
        verify(sessionRepository, never()).save(any());
    }

    @Test
    @DisplayName("Devrait lancer une NotFoundException si l'utilisateur n'existe pas")
    void participateNoExistingUserTest() {
        // Given
        Long sessionId = 1L;
        Long userId = 1L;
        Session session = new Session();
        session.setId(sessionId);

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        // When/Then
        assertThrows(NotFoundException.class, () -> sessionService.participate(sessionId, userId));
        verify(sessionRepository, never()).save(any());
    }

    @Test
    @DisplayName("Devrait lancer une BadRequestException si l'utilisateur participe déjà à la session")
    void participateUserAlreadyParticipatingTest() {
        // Given
        Long sessionId = 1L;
        Long userId = 1L;
        Session session = new Session();
        session.setId(sessionId);
        User user = new User();
        user.setId(userId);
        session.setUsers(Collections.singletonList(user));

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // When/Then
        BadRequestException thrown = assertThrows(BadRequestException.class, () -> sessionService.participate(sessionId, userId));
        assertNotNull(thrown, "BadRequestException devrait être lancée si l'utilisateur participe déjà");
        verify(sessionRepository, times(1)).findById(sessionId);
        verify(userRepository, times(1)).findById(userId);
        verify(sessionRepository, never()).save(any());
    }

    @Test
    @DisplayName("Devrait ajouter l'utilisateur à la session si la participation réussit")
    void participateSuccessTest() {
        // Given
        Long sessionId = 1L;
        Long userId = 1L;
        Session session = new Session();
        session.setId(sessionId);
        session.setUsers(new ArrayList<>());
        User user = new User();
        user.setId(userId);

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // When
        sessionService.participate(sessionId, userId);

        // Then
        verify(sessionRepository, times(1)).findById(sessionId);
        verify(userRepository, times(1)).findById(userId);
        assertTrue(session.getUsers().contains(user));
        verify(sessionRepository, times(1)).save(session);
    }

}