package network.webtech.setuphub_api.dto.request;

import jakarta.validation.constraints.*;
import network.webtech.setuphub_api.enums.SetupCategory;

import java.math.BigDecimal;

public record SetupRequest(

        @NotBlank(message = "Title is required") @Size(min = 3, max = 120) String title,
        @NotBlank(message = "Description is required") @Size(min = 10, max = 3000) String description,
        @NotNull(message = "Category is required") SetupCategory category,
        @NotBlank(message = "Image URL is required") String imageUrl,
        @NotNull(message = "Estimated cost is required") @DecimalMin(value = "0.0", inclusive = false) BigDecimal estimatedCost) {
}
