package com.siead.backend.services;

import com.siead.backend.dto.PostulacionRequest;
import com.siead.backend.models.Aspirante;
import com.siead.backend.models.Convocatoria;
import com.siead.backend.models.Postulacion;
import com.siead.backend.models.Resultado;
import com.siead.backend.repositories.AspiranteRepository;
import com.siead.backend.repositories.ConvocatoriaRepository;
import com.siead.backend.repositories.PostulacionRepository;
import com.siead.backend.repositories.ResultadoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.siead.backend.dto.RankingDTO;
import java.util.List;
import java.util.stream.Collectors;

import java.time.LocalDate;

@Service
public class PostulacionService {

    private final PostulacionRepository postulacionRepository;
    private final AspiranteRepository aspiranteRepository;
    private final ConvocatoriaRepository convocatoriaRepository;
    private final ResultadoRepository resultadoRepository;
    private final MotorReglasService motorReglasService;

    public PostulacionService(PostulacionRepository postulacionRepository, 
                              AspiranteRepository aspiranteRepository, 
                              ConvocatoriaRepository convocatoriaRepository, 
                              ResultadoRepository resultadoRepository, 
                              MotorReglasService motorReglasService) {
        this.postulacionRepository = postulacionRepository;
        this.aspiranteRepository = aspiranteRepository;
        this.convocatoriaRepository = convocatoriaRepository;
        this.resultadoRepository = resultadoRepository;
        this.motorReglasService = motorReglasService;
    }

    @Transactional
    public Postulacion crearPostulacionYEvaluar(PostulacionRequest request) {
        Aspirante aspirante = aspiranteRepository.findById(request.getAspiranteId())
                .orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));
        
        Convocatoria convocatoria = convocatoriaRepository.findById(request.getConvocatoriaId())
                .orElseThrow(() -> new RuntimeException("Convocatoria no encontrada"));

        // 1. Guardar el JSON validado en el Aspirante
        aspirante.setDatosExtraidos(request.getDatosValidadosJson());
        aspiranteRepository.save(aspirante);

        // 2. Crear la Postulación
        Postulacion postulacion = new Postulacion();
        postulacion.setUsuario(aspirante);
        postulacion.setConvocatoria(convocatoria);
        postulacion.setFechaPostulacion(LocalDate.now());
        postulacion.setEstado("EVALUADO");
        postulacion = postulacionRepository.save(postulacion);

        // 3. Motor de Reglas: Evaluar
        Resultado resultado = motorReglasService.evaluar(aspirante, convocatoria);
        resultado.setPostulacion(postulacion);
        resultadoRepository.save(resultado);

        // 4. Actualizar puntaje del aspirante
        aspirante.setPuntajeFinal(resultado.getPuntajeTotal());
        aspiranteRepository.save(aspirante);

        return postulacion;
    }

    @Transactional(readOnly = true)
    public List<RankingDTO> getRankingByConvocatoria(Integer convocatoriaId) {
        List<Postulacion> postulaciones = postulacionRepository.findByConvocatoriaId(convocatoriaId);
        return postulaciones.stream().map(p -> {
            RankingDTO dto = new RankingDTO();
            dto.setPostulacionId(p.getId());
            dto.setNombreAspirante(p.getUsuario().getNombre());
            dto.setEmailAspirante(p.getUsuario().getEmail());
            dto.setEstado(p.getEstado());

            resultadoRepository.findByPostulacionId(p.getId()).ifPresentOrElse(res -> {
                dto.setPuntajeFinal(res.getPuntajeTotal());
                dto.setObservaciones(res.getObservaciones());
            }, () -> {
                dto.setPuntajeFinal(0.0);
                dto.setObservaciones("Sin evaluar.");
            });

            return dto;
        })
        .sorted((a, b) -> Double.compare(b.getPuntajeFinal() != null ? b.getPuntajeFinal() : 0.0, a.getPuntajeFinal() != null ? a.getPuntajeFinal() : 0.0))
        .collect(Collectors.toList());
    }
}
