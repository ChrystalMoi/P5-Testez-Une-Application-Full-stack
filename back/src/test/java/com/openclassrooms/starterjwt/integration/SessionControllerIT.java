package com.openclassrooms.starterjwt.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Date;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class SessionControllerIT {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    TeacherRepository teacherRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    SessionRepository sessionRepository;

    @Autowired
    ObjectMapper mapper;

    final Teacher teacherMock = Teacher.builder()
            .lastName("Test")
            .firstName("ReTest")
            .build();

    final User userMock = User.builder()
            .firstName("Loup")
            .lastName("Garou")
            .email("loup.garou@mail.com")
            .admin(false)
            .password("azerty")
            .build();

    final Session sessionMock = Session.builder()
            .name("Session Test")
            .date(new Date())
            .teacher(teacherMock)
            .description("Description de la session")
            .createdAt(LocalDateTime.now())
            .build();

    @AfterEach
    void clean() {
        sessionRepository.deleteAll();
        userRepository.deleteAll();
        teacherRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("Demande d'un utilisateur authentifié pour obtenir toutes les sessions, réponse : OK")
    public void givenAuthUser_WhenRequestsAllSessions_ThenOk() throws Exception {
        //Given
        userRepository.save(userMock);
        teacherRepository.save(teacherMock);
        sessionRepository.save(sessionMock);

        //When
        this.mockMvc.perform(get("/api/session/"))

                //Then : La réponse doit être OK et contenir les détails des sessions
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("session")))
                .andExpect(content().string(containsString("Session Test")));
    }

    @Test
    @DisplayName("Lorsque l'utilisateur authentifié modifie une nouvelle session, c'est OK et la session initiale est modifié")
    public void givenAuthUser_WhenModifySession_ThenOk() throws Exception {
        //Given : Préparation des données de test
        userRepository.save(userMock);
        teacherRepository.save(teacherMock);
        long mockSessionId = sessionRepository.save(sessionMock).getId();

        // Création d'une nouvelle SessionDto avec les données de la session initiale
        SessionDto mockWannabeSession = new SessionDto(
                mockSessionId,
                "Session Nom",
                new Date(),
                teacherMock.getId(),
                "description de la session qu'on aime",
                null,
                null,
                null
        );

        // Affichage pour débogage
        System.out.println(mockWannabeSession);

        //When : L'utilisateur authentifié modifie une session existante
        this.mockMvc.perform(put("/api/session/" + mockSessionId).with(user("loup.garou@mail.com"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(mockWannabeSession)))

                //Then : La modification doit réussir et le contenu de la session doit être mis à jour
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("de la session")));

        // Vérification qu'une seule session est présente dans la base de données
        assertThat(sessionRepository.findAll().size()).isEqualTo(1);
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("Demande d'un utilisateur authentifié pour obtenir une session, réponse : OK avec données")
    public void givenAuthUser_WhenRequestsSessionById_ThenOkWithContent() throws Exception {
        //Given : Préparation des données de test
        userRepository.save(userMock);
        teacherRepository.save(teacherMock);
        Long mockSessionId = sessionRepository.save(sessionMock).getId();

        //When : L'utilisateur authentifié demande une session par son ID
        this.mockMvc.perform(get("/api/session/" + mockSessionId))

                //Then : La réponse doit être OK et contenir les données de la session
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("session")))
                .andExpect(content().string(containsString("Session Test")));

    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("Demande de suppression d'une session par un utilisateur authentifié, réponse : OK")
    public void givenAuthUser_WhenRequestsDeleteSession_ThenOk() throws Exception {
        //Given : Préparation des données de test
        userRepository.save(userMock);
        teacherRepository.save(teacherMock);
        Long mockSessionId = sessionRepository.save(sessionMock).getId();

        //When : L'utilisateur authentifié demande la suppression d'une session par son ID
        this.mockMvc.perform(delete("/api/session/" + mockSessionId))

                //Then : La réponse doit être OK
                .andExpect(status().isOk());
        assertThat(sessionRepository.findById(mockSessionId).isPresent()).isFalse();
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("Demande de participation à une session par un utilisateur authentifier, réponse : OK")
    public void givenAuthUser_WhenRequestsParticipateForSession_ThenOk() throws Exception {
        //Given : Préparation des données de test
        Long mockUserId = userRepository.save(userMock).getId();
        teacherRepository.save(teacherMock);
        Long mockSessionId = sessionRepository.save(sessionMock).getId();

        //When : L'utilisateur authentifié demande à participer à une session
        this.mockMvc.perform(post("/api/session/" + mockSessionId + "/participate/" + mockUserId))

                //Then : La réponse doit être OK
                .andExpect(status().isOk());
        assertThat(sessionRepository.findById(mockSessionId).isPresent()).isTrue();
        assertThat(sessionRepository.findById(mockSessionId).get().getUsers().contains(userMock)).isTrue();
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("Demande pour une session non-numérique par un utilisateur authentifié, réponse : BadRequest")
    public void givenAuthUser_WhenRequestsNonNumericSession_ThenBadRequest() throws Exception {
        //Given : Préparation des données de test
        userRepository.save(userMock);
        teacherRepository.save(teacherMock);
        sessionRepository.save(sessionMock);

        //When : L'utilisateur authentifié demande une session avec un ID non numérique
        this.mockMvc.perform(get("/api/session/aAa123"))

                //Then : La réponse doit être BadRequest
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("Demande de suppression d'une session inexistante par un utilisateur authentifié, réponse : NotFound")
    public void givenAuthUser_WhenRequestsDeleteNonExistingSession_ThenNotFound() throws Exception {
        //Given
        userRepository.save(userMock);
        teacherRepository.save(teacherMock);
        long mockSessionId = sessionRepository.save(sessionMock).getId() + 1;

        //When : L'utilisateur authentifié demande la suppression d'une session avec un ID inexistant
        this.mockMvc.perform(delete("/api/session/" + mockSessionId))

                //Then : La réponse doit être NotFound
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("Demande d'une session inexistante par un utilisateur authentifié, réponse : NotFound")
    public void givenAuthUser_WhenRequestsNonExistingSession_ThenNotFound() throws Exception {
        //Given : Préparation des données de test
        userRepository.save(userMock);
        teacherRepository.save(teacherMock);
        long mockSessionId = sessionRepository.save(sessionMock).getId() + 1;

        //When : L'utilisateur authentifier demande une session avec un ID inexistant
        this.mockMvc.perform(get("/api/session/" + mockSessionId))

                //Then : La réponse doit être NotFound
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("Demande de participation à une session non numérique par un utilisateur authentifié, réponse : BadRequest")
    public void givenAuthUser_WhenRequestsParticipateNonNumericSession_ThenBadRequest() throws Exception {
        //Given
        Long mockUserId = userRepository.save(userMock).getId();
        teacherRepository.save(teacherMock);
        Long mockSessionId = sessionRepository.save(sessionMock).getId();

        //When : L'utilisateur authentifié demande à participer à une session avec un ID non numérique
        //Premier cas : ID de session non numérique
        this.mockMvc.perform(post("/api/session/" + mockSessionId + "/participate/Aze123"))

                //Then : La réponse doit être BadRequest
                .andExpect(status().isBadRequest());

        //When 2
        //Deuxième cas : ID d'utilisateur non numérique
        this.mockMvc.perform(post("/api/session/a1z2e3/participate/" + mockUserId))

                //Then : La réponse doit être BadRequest
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("Demande de suppression d'une session non numérique par un utilisateur authentifié, réponse : BadRequest")
    public void givenAuthUser_WhenRequestsDeleteNonNumericSession_ThenBadRequest() throws Exception {
        //Given
        userRepository.save(userMock);
        teacherRepository.save(teacherMock);
        sessionRepository.save(sessionMock);

        //When : L'utilisateur authentifié demande de supprimer une session avec un ID non numérique
        this.mockMvc.perform(delete("/api/session/Azerty123"))

                //Then : La réponse doit être BadRequest
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("Demande de désinscription d'une session non numérique par un utilisateur authentifié, réponse : BadRequest")
    public void givenAuthUser_WhenRequestsUnParticipateNonNumericSession_ThenBadRequest() throws Exception {
        //Given : Préparation des données de test
        Long mockUserId = userRepository.save(userMock).getId();
        teacherRepository.save(teacherMock);
        Long mockSessionId = sessionRepository.save(sessionMock).getId();

        //When : L'utilisateur authentifié demande à se désinscrire d'une session avec un ID non numérique
        // Premier cas : ID de session non numérique
        this.mockMvc.perform(delete("/api/session/" + mockSessionId + "/participate/AzE32"))

                //Then : La réponse doit être BadRequest
                .andExpect(status().isBadRequest());

        //Deuxième cas : ID d'utilisateur non numérique
        this.mockMvc.perform(delete("/api/session/aze123/participate/" + mockUserId))

                //Then : La réponse doit être BadRequest
                .andExpect(status().isBadRequest());
    }

}
