package com.alongtheway.alongthewaybackend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alongtheway.alongthewaybackend.models.User;
import com.alongtheway.alongthewaybackend.models.data.UserRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;

    @Autowired
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PutMapping("/{userId}/car")
    public ResponseEntity<?> updateUserCarInfo(
            @PathVariable String userId,
            @RequestBody User updatedUser
    ) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        // Update the car information
        user.setMpg(updatedUser.getMpg());
        user.setTankCapacity(updatedUser.getTankCapacity());

        // Save the updated user
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }
}
