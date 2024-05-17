package com.openclassrooms.starterjwt.service;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@SpringBootTest
class TeacherServiceTest {

    @MockBean
    private TeacherRepository teacherRepository;

    @Autowired
    private TeacherService teacherService;

    @Test
    @DisplayName("Devrait retourner la liste de tous les enseignants")
    void findAllTestTeacher() {
        // Given
        List<Teacher> expectedTeachers = Arrays.asList(
                mockTeacher(1L, "John", "Doe"),
                mockTeacher(2L, "Jane", "Smith")
        );

        // When
        when(teacherRepository.findAll()).thenReturn(expectedTeachers);
        List<Teacher> actualTeachers = teacherService.findAll();

        // Then
        assertEquals(expectedTeachers.size(), actualTeachers.size());
        assertEquals(expectedTeachers, actualTeachers);
    }

    @Test
    @DisplayName("Devrait retourner l'enseignant avec l'ID spécifié")
    void findByIdTestTeacher() {
        // Given
        Long teacherId = 1L;
        Teacher expectedTeacher = mockTeacher(teacherId, "John", "Doe");
        when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(expectedTeacher));

        // When
        Teacher actualTeacher = teacherService.findById(teacherId);

        // Then
        verify(teacherRepository, times(1)).findById(teacherId);
        assertEquals(expectedTeacher, actualTeacher);
    }

    // Méthode utilitaire pour créer un mock Teacher avec les paramètres donnés
    private Teacher mockTeacher(Long id, String firstName, String lastName) {
        Teacher teacher = new Teacher();
        teacher.setId(id);
        teacher.setFirstName(firstName);
        teacher.setLastName(lastName);
        teacher.setCreatedAt(LocalDateTime.now());
        teacher.setUpdatedAt(LocalDateTime.now());
        return teacher;
    }
}