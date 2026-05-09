package network.webtech.setuphub_api.service;

import java.util.List;
import java.util.UUID;

import network.webtech.setuphub_api.dto.request.SetupRequest;
import network.webtech.setuphub_api.dto.response.SetupResponse;
import network.webtech.setuphub_api.enums.SetupCategory;

public interface SetupService {

    SetupResponse create(SetupRequest request);

    List<SetupResponse> findAll(
            String title,
            SetupCategory category);

    SetupResponse findById(UUID id);

    SetupResponse update(UUID id, SetupRequest request);

    void delete(UUID id);

}
