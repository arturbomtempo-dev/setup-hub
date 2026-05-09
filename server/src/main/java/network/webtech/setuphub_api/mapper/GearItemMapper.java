package network.webtech.setuphub_api.mapper;

import network.webtech.setuphub_api.dto.response.GearItemResponse;
import network.webtech.setuphub_api.entity.GearItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface GearItemMapper {

    @Mapping(source = "setup.id", target = "setupId")
    GearItemResponse toResponse(GearItem gearItem);
}
