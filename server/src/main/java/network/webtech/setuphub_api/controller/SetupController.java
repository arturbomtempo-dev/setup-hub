package network.webtech.setuphub_api.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import network.webtech.setuphub_api.dto.request.SetupRequest;
import network.webtech.setuphub_api.dto.response.SetupResponse;
import network.webtech.setuphub_api.enums.SetupCategory;
import network.webtech.setuphub_api.service.SetupService;

@RestController
@RequestMapping("/setups")
@RequiredArgsConstructor
public class SetupController {

    private final SetupService service;

    @PostMapping
    public ResponseEntity<SetupResponse> create(@Valid @RequestBody SetupRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED).body(service.create(request));
    }

    @GetMapping
    public ResponseEntity<List<SetupResponse>> findAll(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) SetupCategory category) {
        return ResponseEntity.ok(
                service.findAll(title, category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SetupResponse> findById(
            @PathVariable UUID id) {
        return ResponseEntity.ok(
                service.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SetupResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody SetupRequest request) {
        return ResponseEntity.ok(
                service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id) {
        service.delete(id);

        return ResponseEntity.noContent().build();
    }
}
