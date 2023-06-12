package com.alongtheway.alongthewaybackend.models.data;


import org.springframework.data.mongodb.repository.MongoRepository;

import com.alongtheway.alongthewaybackend.models.RoadTrip;

public interface RoadTripRepository extends MongoRepository<RoadTrip, String> {
}