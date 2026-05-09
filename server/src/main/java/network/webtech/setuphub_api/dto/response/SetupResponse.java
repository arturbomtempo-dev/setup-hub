package network.webtech.setuphub_api.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import network.webtech.setuphub_api.enums.SetupCategory;

public record SetupResponse(

        UUID id,
        String title,
        String description,
        SetupCategory category,
        String imageUrl,
        BigDecimal estimatedCost,
        LocalDateTime createdAt) {
}
