package network.webtech.setuphub_api.exception;

import java.util.UUID;

public class SetupHasItemsException extends RuntimeException {

    public SetupHasItemsException(UUID id, long count) {
        super("Cannot delete setup " + id + ": it has " + count + " linked gear item(s). Remove them first.");
    }
}
