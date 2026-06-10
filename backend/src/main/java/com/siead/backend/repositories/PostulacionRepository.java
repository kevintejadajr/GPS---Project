package com.siead.backend.repositories;

import com.siead.backend.models.Postulacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostulacionRepository extends JpaRepository<Postulacion, Integer> {
    List<Postulacion> findByConvocatoriaId(Integer convocatoriaId);
    List<Postulacion> findByUsuarioId(Integer usuarioId);
}
