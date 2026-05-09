package network.webtech.setuphub_api.service;

import java.util.List;
import java.util.UUID;

import network.webtech.setuphub_api.dto.request.GearItemRequest;
import network.webtech.setuphub_api.dto.response.GearItemResponse;

public interface GearItemService {

    GearItemResponse create(GearItemRequest request);

    List<GearItemResponse> findAll(UUID setupId);

    GearItemResponse findById(UUID id);

    GearItemResponse update(UUID id, GearItemRequest request);

    void delete(UUID id);
}
