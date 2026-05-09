package network.webtech.setuphub_api.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import network.webtech.setuphub_api.entity.Setup;
import network.webtech.setuphub_api.enums.SetupCategory;

public interface SetupRepository extends JpaRepository<Setup, UUID> {

    List<Setup> findByTitleContainingIgnoreCase(String title);

    List<Setup> findByCategory(SetupCategory category);

}
