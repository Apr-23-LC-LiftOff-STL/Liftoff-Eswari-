package com.alongtheway.alongthewaybackend.alongTheWayReviews.models.data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    // CRUD operations and any other necessary methods
}

