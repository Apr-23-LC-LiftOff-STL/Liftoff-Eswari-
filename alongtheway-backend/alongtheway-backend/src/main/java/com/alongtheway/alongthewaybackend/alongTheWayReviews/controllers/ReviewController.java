package com.alongtheway.alongthewaybackend.alongTheWayReviews.controllers;

import com.alongtheway.alongthewaybackend.alongTheWayReviews.models.data.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    // API endpoints for creating, updating, deleting, and fetching reviews
}

