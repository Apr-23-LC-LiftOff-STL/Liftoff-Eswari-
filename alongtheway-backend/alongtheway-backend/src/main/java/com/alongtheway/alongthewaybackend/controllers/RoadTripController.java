package com.alongtheway.alongthewaybackend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alongtheway.alongthewaybackend.models.RoadTrip;
import com.alongtheway.alongthewaybackend.models.data.RoadTripRepository;

@RestController
@RequestMapping("/roadtrips")
@CrossOrigin(origins = "http://localhost:4200")
public class RoadTripController {

  @Autowired
  private final RoadTripRepository roadTripRepository;

  public RoadTripController(RoadTripRepository roadTripRepository) {
    this.roadTripRepository = roadTripRepository;
  }

  @GetMapping
  public List<RoadTrip> getAllRoadTrips() {
    return roadTripRepository.findAll();
  }
}
