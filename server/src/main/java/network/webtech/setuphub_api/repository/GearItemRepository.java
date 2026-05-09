package network.webtech.setuphub_api.repository;

import network.webtech.setuphub_api.entity.GearItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface GearItemRepository extends JpaRepository<GearItem, UUID> {

    List<GearItem> findBySetupId(UUID setupId);
}
