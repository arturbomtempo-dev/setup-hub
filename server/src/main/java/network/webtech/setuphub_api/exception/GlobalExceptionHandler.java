package network.webtech.setuphub_api.exception;

import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;
import network.webtech.setuphub_api.dto.response.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(SetupNotFoundException.class)

        public ResponseEntity<ErrorResponse> handleNotFound(
                        SetupNotFoundException ex,
                        HttpServletRequest request) {
                ErrorResponse error = ErrorResponse.of(
                                HttpStatus.NOT_FOUND.value(),
                                "Not Found",
                                ex.getMessage(),
                                request.getRequestURI());

                return ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(error);
        }

        @ExceptionHandler(GearItemNotFoundException.class)

        public ResponseEntity<ErrorResponse> handleGearItemNotFound(
                        GearItemNotFoundException ex,
                        HttpServletRequest request) {
                ErrorResponse error = ErrorResponse.of(
                                HttpStatus.NOT_FOUND.value(),
                                "Not Found",
                                ex.getMessage(),
                                request.getRequestURI());

                return ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(error);
        }

        @ExceptionHandler(SetupHasItemsException.class)

        public ResponseEntity<ErrorResponse> handleSetupHasItems(
                        SetupHasItemsException ex,
                        HttpServletRequest request) {
                ErrorResponse error = ErrorResponse.of(
                                HttpStatus.CONFLICT.value(),
                                "Conflict",
                                ex.getMessage(),
                                request.getRequestURI());

                return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(error);
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)

        public ResponseEntity<ErrorResponse> handleValidationErrors(
                        MethodArgumentNotValidException ex,
                        HttpServletRequest request

        ) {

                String errors = ex.getBindingResult()
                                .getFieldErrors()
                                .stream()
                                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                                .collect(Collectors.joining(", "));

                ErrorResponse error = ErrorResponse.of(
                                HttpStatus.BAD_REQUEST.value(),
                                "Validation Failed",
                                errors,
                                request.getRequestURI());

                return ResponseEntity.badRequest().body(error);
        }
}
