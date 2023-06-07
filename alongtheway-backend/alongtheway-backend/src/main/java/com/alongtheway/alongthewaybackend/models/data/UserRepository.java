package com.alongtheway.alongthewaybackend.models.data;

import com.alongtheway.alongthewaybackend.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    @Query("{username:'?0'}")
    User findByUsername(String username);

    @Query("{id:'?0'}")
    Optional<User> findById(String id);

//    @Query(value="{TEMPSEARCH:'?0'}", fields="{'name' : 1, 'quantity' : 1}")
//    List<User> findAll(String TEMPSEARCH);

    public long count();

}
