package com.alongtheway.alongthewaybackend.alongTheWayReviews.controllers;

import com.alongtheway.alongthewaybackend.alongTheWayReviews.models.data.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class ImageUploadController {

    // Define the folder path where images will be stored
    private final String UPLOAD_DIR = "uploads/";

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Save the image and return the image file name
            String fileName = saveImage(file);
            return ResponseEntity.ok(fileName);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image");
        }
    }

    private String saveImage(MultipartFile file) throws IOException {
        // Create the upload directory if it doesn't exist
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // Generate a unique file name to avoid conflicts
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR, fileName);

        // Save the image file to the server's file system
        Files.write(filePath, file.getBytes());

        return fileName;
    }
}

