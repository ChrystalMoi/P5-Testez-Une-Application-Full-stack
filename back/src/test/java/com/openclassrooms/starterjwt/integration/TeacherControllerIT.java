package com.openclassrooms.starterjwt.integration;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class TeacherControllerIT {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TeacherRepository teacherRepository;

    final Teacher testTeacher= Teacher.builder()
            .lastName("Test")
            .firstName("ReTest")
            .build();

    @AfterEach
    void clean() {
        teacherRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles="USER")
    @DisplayName("Liste tous les enseignants avec succès et appelle le service")
    public void testUserRequestsAllTeachers_expectOkResponse_andServiceCalled() throws Exception {
        //Given : Préparation des données de test
        teacherRepository.save(testTeacher);

        //When : L'utilisateur effectue une requête pour obtenir tous les enseignants
        this.mockMvc.perform(get("/api/teacher"))

                //Then : Vérification que la réponse est OK et que le service est appelé
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Test")));
    }

    @Test
    @WithMockUser(roles="USER")
    @DisplayName("Utilisateur authentifié demande un enseignant inexistant, réponse: NotFound")
    public void testUserRequestsNonExistentTeacher_thenNotFound() throws Exception {
        //Given : Aucune donnée nécessaire pour ce test

        //When : L'utilisateur authentifié demande un enseignant inexistant
        this.mockMvc.perform(get("/api/teacher/123456789"))

                //Then : La réponse doit être NotFound
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Requête d'un utilisateur non autorisé pour obtenir un enseignant, réponse : Unauthorized")
    public void testUnAuthorizedUserRequestsTeacher_thenUnauthorized() throws Exception {
        //Given : Pas de donnée nécessaire pour ce test

        //When : Quand l'utilisateur non autorisé effectue une requête pour obtenir un enseignant
        this.mockMvc.perform(get("/api/teacher/123"))

                //Then : Alors la réponse doit être "Unauthorized"
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles="USER")
    @DisplayName("Demande d'un utilisateur authentifié pour obtenir un enseignant avec ID non valide (numérique), réponse : BadRequest")
    public void testAuthUserRequestsNonNumericTeacher_thenBadRequest() throws Exception {
        //Given : Aucune donnée préparatoire nécessaire

        //When : Utilisateur authentifié demande un prof avec ID non numérique (avec des lettres ou autre)
        this.mockMvc.perform(get("/api/teacher/12E4S6"))

                //Then : La réponse doit ête "BadRequest"
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles="USER")
    @DisplayName("Demande d'un utilisateur authentifié pour obtenir un enseignant, réponse : OK")
    public void testAuthUserRequestsTeacherById_thenOk() throws Exception {
        //Given : Sauvegarde d'un prof de test et récupération de l'ID
        Long testTeacherId = teacherRepository.save(testTeacher).getId();

        //When : L'utilisateur authentifié demande un enseignant par son ID
        this.mockMvc.perform(get("/api/teacher/" + testTeacherId))

                //Then : Réponse attendue : "OK" et service appelé
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Test")));
    }

}
