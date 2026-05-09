package network.webtech.setuphub_api.exception;

import java.util.UUID;

public class GearItemNotFoundException extends RuntimeException {

    public GearItemNotFoundException(UUID id) {
        super("Gear item with ID " + id + " was not found");
    }
}
