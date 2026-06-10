package com.siead.backend.repositories;

import com.siead.backend.models.Resultado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResultadoRepository extends JpaRepository<Resultado, Integer> {
    Optional<Resultado> findByPostulacionId(Integer postulacionId);
}
