package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Course;
import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.domain.UserCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserCourseRepository extends JpaRepository<UserCourse, Long>{

    Optional<UserCourse> findUserCourseByUserAndCourse(User user, Course course);
}
