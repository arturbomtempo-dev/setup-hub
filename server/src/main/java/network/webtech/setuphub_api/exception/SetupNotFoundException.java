package network.webtech.setuphub_api.exception;

import java.util.UUID;

public class SetupNotFoundException extends RuntimeException {

    public SetupNotFoundException(UUID id) {

        super("Setup with ID " + id + " was not found");

    }
}
