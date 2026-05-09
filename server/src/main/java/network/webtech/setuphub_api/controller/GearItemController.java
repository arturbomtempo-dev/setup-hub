package network.webtech.setuphub_api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import network.webtech.setuphub_api.dto.request.GearItemRequest;
import network.webtech.setuphub_api.dto.response.GearItemResponse;
import network.webtech.setuphub_api.service.GearItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/gear-items")
@RequiredArgsConstructor
public class GearItemController {

        private final GearItemService service;

        @PostMapping
        public ResponseEntity<GearItemResponse> create(
                        @Valid @RequestBody GearItemRequest request) {
                return ResponseEntity
                                .status(HttpStatus.CREATED)
                                .body(service.create(request));
        }

        @GetMapping
        public ResponseEntity<List<GearItemResponse>> findAll(
                        @RequestParam(required = false) UUID setupId) {
                return ResponseEntity.ok(
                                service.findAll(setupId));
        }

        @GetMapping("/{id}")
        public ResponseEntity<GearItemResponse> findById(
                        @PathVariable UUID id) {
                return ResponseEntity.ok(
                                service.findById(id));
        }

        @PutMapping("/{id}")
        public ResponseEntity<GearItemResponse> update(
                        @PathVariable UUID id,
                        @Valid @RequestBody GearItemRequest request) {
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
