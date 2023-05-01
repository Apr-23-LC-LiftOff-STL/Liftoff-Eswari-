package com.alongtheway.alongthewaybackend.models.data;

import com.alongtheway.alongthewaybackend.models.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<User, Integer> {

    User findByUsername(String username);

}
