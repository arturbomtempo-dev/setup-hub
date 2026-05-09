package network.webtech.setuphub_api.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import network.webtech.setuphub_api.dto.request.SetupRequest;
import network.webtech.setuphub_api.dto.response.SetupResponse;
import network.webtech.setuphub_api.entity.Setup;
import network.webtech.setuphub_api.enums.SetupCategory;
import network.webtech.setuphub_api.exception.SetupHasItemsException;
import network.webtech.setuphub_api.exception.SetupNotFoundException;
import network.webtech.setuphub_api.mapper.SetupMapper;
import network.webtech.setuphub_api.repository.GearItemRepository;
import network.webtech.setuphub_api.repository.SetupRepository;
import network.webtech.setuphub_api.service.SetupService;

@Service
@RequiredArgsConstructor
public class SetupServiceImpl implements SetupService {

    private final SetupRepository repository;
    private final SetupMapper mapper;
    private final GearItemRepository gearItemRepository;

    @Override
    public SetupResponse create(SetupRequest request) {
        Setup setup = Setup.builder()
                .title(request.title())
                .description(request.description())
                .category(request.category())
                .imageUrl(request.imageUrl())
                .estimatedCost(request.estimatedCost())
                .build();

        return mapper.toResponse(
                repository.save(setup));
    }

    @Override
    public List<SetupResponse> findAll(String title, SetupCategory category) {
        List<Setup> setups;

        if (title != null) {
            setups = repository.findByTitleContainingIgnoreCase(title);
        } else if (category != null) {
            setups = repository.findByCategory(category);
        } else {
            setups = repository.findAll();
        }

        return setups.stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public SetupResponse findById(UUID id) {
        Setup setup = repository.findById(id)
                .orElseThrow(() -> new SetupNotFoundException(id));

        return mapper.toResponse(setup);
    }

    @Override
    public SetupResponse update(UUID id, SetupRequest request) {
        Setup setup = repository.findById(id)
                .orElseThrow(() -> new SetupNotFoundException(id));

        setup.setTitle(request.title());
        setup.setDescription(request.description());
        setup.setCategory(request.category());
        setup.setImageUrl(request.imageUrl());
        setup.setEstimatedCost(request.estimatedCost());

        return mapper.toResponse(
                repository.save(setup));
    }

    @Override
    public void delete(UUID id) {
        Setup setup = repository.findById(id)
                .orElseThrow(() -> new SetupNotFoundException(id));

        long itemCount = gearItemRepository.findBySetupId(id).size();
        if (itemCount > 0) {
            throw new SetupHasItemsException(id, itemCount);
        }

        repository.delete(setup);
    }
}
