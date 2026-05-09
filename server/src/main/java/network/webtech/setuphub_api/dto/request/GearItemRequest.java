package network.webtech.setuphub_api.dto.request;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import network.webtech.setuphub_api.enums.GearType;

public record GearItemRequest(

        @NotBlank(message = "Name is required") @Size(min = 2, max = 120) String name,
        @NotBlank(message = "Brand is required") @Size(min = 2, max = 80) String brand,
        @NotNull(message = "Type is required") GearType type,
        @NotNull(message = "Price is required") @DecimalMin(value = "0.0", inclusive = false) BigDecimal price,
        @NotNull(message = "Setup ID is required") UUID setupId) {
}
