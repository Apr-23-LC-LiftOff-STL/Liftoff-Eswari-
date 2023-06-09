package com.alongtheway.alongthewaybackend.models;

import org.bson.types.Binary;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Objects;

@Document(collection = "photos")
public class Photo {

    @Id
    @Field
    private String id;

    @Field
    private Binary image;

    public Photo () {}

    public Photo (Binary image) {
        this.image = image;
    }

    public Binary getImage() {
        return image;
    }

    public void setImage(Binary image) {
        this.image = image;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Photo photo = (Photo) o;
        return Objects.equals(id, photo.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
