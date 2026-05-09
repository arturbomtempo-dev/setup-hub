package network.webtech.setuphub_api.mapper;

import org.mapstruct.Mapper;

import network.webtech.setuphub_api.dto.response.SetupResponse;
import network.webtech.setuphub_api.entity.Setup;

@Mapper(componentModel = "spring")
public interface SetupMapper {

    SetupResponse toResponse(Setup setup);
}
