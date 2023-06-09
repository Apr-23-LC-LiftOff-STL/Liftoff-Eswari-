package com.alongtheway.alongthewaybackend.models.data;

import com.alongtheway.alongthewaybackend.models.Photo;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PhotoRepository extends MongoRepository<Photo, String> {


}
