package com.alongtheway.alongthewaybackend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "road_trips")
public class RoadTrip {
  
  @Id
  private String id;
  private String name;
  private String duration;
  private String description;
  private String distance;
  private String keyHighlights;

  // getters and setters
  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDuration() {
    return duration;
  }

  public void setDuration(String duration) {
    this.duration = duration;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getDistance() {
    return distance;
  }

  public void setDistance(String distance) {
    this.distance = distance;
  }

  public String getKeyHighlights() {
    return keyHighlights;
  }

  public void setKeyHighlights(String keyHighlights) {
    this.keyHighlights = keyHighlights;
  }
}