package com.siead.backend.repositories;

import com.siead.backend.models.Requisito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequisitoRepository extends JpaRepository<Requisito, Integer> {
    List<Requisito> findByConvocatoriaId(Integer convocatoriaId);
}
