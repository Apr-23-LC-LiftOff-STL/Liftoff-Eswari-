package com.alongtheway.alongthewaybackend.alongTheWayReviews.models.data;

import com.alongtheway.alongthewaybackend.alongTheWayReviews.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}

