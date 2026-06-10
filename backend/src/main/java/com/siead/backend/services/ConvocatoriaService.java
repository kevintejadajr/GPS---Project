package com.siead.backend.services;

import com.siead.backend.dto.ConvocatoriaRequest;
import com.siead.backend.dto.RequisitoRequest;
import com.siead.backend.models.Convocatoria;
import com.siead.backend.models.Requisito;
import com.siead.backend.repositories.ConvocatoriaRepository;
import com.siead.backend.repositories.RequisitoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ConvocatoriaService {

    private final ConvocatoriaRepository convocatoriaRepository;
    private final RequisitoRepository requisitoRepository;

    public ConvocatoriaService(ConvocatoriaRepository convocatoriaRepository, RequisitoRepository requisitoRepository) {
        this.convocatoriaRepository = convocatoriaRepository;
        this.requisitoRepository = requisitoRepository;
    }

    public List<Convocatoria> getAllConvocatorias() {
        return convocatoriaRepository.findAll();
    }

    public Optional<Convocatoria> getConvocatoriaById(Integer id) {
        return convocatoriaRepository.findById(id);
    }

    public List<Requisito> getRequisitosByConvocatoria(Integer convocatoriaId) {
        return requisitoRepository.findByConvocatoriaId(convocatoriaId);
    }

    @Transactional
    public Convocatoria createConvocatoria(ConvocatoriaRequest request) {
        Convocatoria convocatoria = new Convocatoria();
        convocatoria.setNombreConvocatoria(request.getNombreConvocatoria());
        convocatoria.setTitulo(request.getTitulo());
        convocatoria.setDescripcion(request.getDescripcion());
        convocatoria.setFechaCierre(request.getFechaCierre());
        
        Convocatoria savedConvocatoria = convocatoriaRepository.save(convocatoria);

        if (request.getRequisitos() != null && !request.getRequisitos().isEmpty()) {
            for (RequisitoRequest req : request.getRequisitos()) {
                Requisito requisito = new Requisito();
                requisito.setConvocatoria(savedConvocatoria);
                requisito.setDescripcion(req.getDescripcion());
                requisito.setPeso(req.getPeso());
                requisito.setValorMinimo(req.getValorMinimo());
                requisitoRepository.save(requisito);
            }
        }
        return savedConvocatoria;
    }
}
