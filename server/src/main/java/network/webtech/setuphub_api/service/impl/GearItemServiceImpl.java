package network.webtech.setuphub_api.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import network.webtech.setuphub_api.dto.request.GearItemRequest;
import network.webtech.setuphub_api.dto.response.GearItemResponse;
import network.webtech.setuphub_api.entity.GearItem;
import network.webtech.setuphub_api.entity.Setup;
import network.webtech.setuphub_api.exception.GearItemNotFoundException;
import network.webtech.setuphub_api.exception.SetupNotFoundException;
import network.webtech.setuphub_api.mapper.GearItemMapper;
import network.webtech.setuphub_api.repository.GearItemRepository;
import network.webtech.setuphub_api.repository.SetupRepository;
import network.webtech.setuphub_api.service.GearItemService;

@Service
@RequiredArgsConstructor
public class GearItemServiceImpl implements GearItemService {

    private final GearItemRepository repository;
    private final SetupRepository setupRepository;
    private final GearItemMapper mapper;

    @Override
    public GearItemResponse create(GearItemRequest request) {
        Setup setup = setupRepository.findById(
                request.setupId()).orElseThrow(() -> new SetupNotFoundException(request.setupId()));

        GearItem gearItem = GearItem.builder()
                .name(request.name())
                .brand(request.brand())
                .type(request.type())
                .price(request.price())
                .setup(setup)
                .build();

        return mapper.toResponse(
                repository.save(gearItem));
    }

    @Override
    public List<GearItemResponse> findAll(
            UUID setupId) {
        List<GearItem> gearItems;

        if (setupId != null) {
            gearItems = repository.findBySetupId(setupId);
        } else {
            gearItems = repository.findAll();
        }

        return gearItems.stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public GearItemResponse findById(UUID id) {
        GearItem gearItem = repository.findById(id)
                .orElseThrow(() -> new GearItemNotFoundException(id));

        return mapper.toResponse(gearItem);
    }

    @Override
    public GearItemResponse update(
            UUID id,
            GearItemRequest request) {
        GearItem gearItem = repository.findById(id)
                .orElseThrow(() -> new GearItemNotFoundException(id));

        Setup setup = setupRepository.findById(
                request.setupId()).orElseThrow(() -> new SetupNotFoundException(request.setupId()));

        gearItem.setName(request.name());
        gearItem.setBrand(request.brand());
        gearItem.setType(request.type());
        gearItem.setPrice(request.price());
        gearItem.setSetup(setup);

        return mapper.toResponse(
                repository.save(gearItem));
    }

    @Override
    public void delete(UUID id) {
        GearItem gearItem = repository.findById(id)
                .orElseThrow(() -> new GearItemNotFoundException(id));

        repository.delete(gearItem);
    }
}
