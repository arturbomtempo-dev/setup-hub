package network.webtech.setuphub_api.dto.response;

import network.webtech.setuphub_api.enums.GearType;

import java.math.BigDecimal;
import java.util.UUID;

public record GearItemResponse(

        UUID id,
        String name,
        String brand,
        GearType type,
        BigDecimal price,
        UUID setupId) {
}
