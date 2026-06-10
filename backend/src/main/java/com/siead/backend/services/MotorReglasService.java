package com.siead.backend.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.siead.backend.models.Aspirante;
import com.siead.backend.models.Convocatoria;
import com.siead.backend.models.Requisito;
import com.siead.backend.models.Resultado;
import com.siead.backend.repositories.RequisitoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MotorReglasService {

    private final RequisitoRepository requisitoRepository;
    private final ObjectMapper objectMapper;

    public MotorReglasService(RequisitoRepository requisitoRepository, ObjectMapper objectMapper) {
        this.requisitoRepository = requisitoRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Evalúa a un aspirante contrastando su JSON extraído con los requisitos de la convocatoria.
     */
    public Resultado evaluar(Aspirante aspirante, Convocatoria convocatoria) {
        List<Requisito> requisitos = requisitoRepository.findByConvocatoriaId(convocatoria.getId());
        double puntajeTotal = 0.0;
        StringBuilder observaciones = new StringBuilder();

        try {
            JsonNode datos = objectMapper.readTree(aspirante.getDatosExtraidos());
            
            // Lógica de evaluación simple basada en palabras clave
            for (Requisito req : requisitos) {
                String desc = req.getDescripcion().toLowerCase();
                boolean cumple = false;

                // Ejemplo: si el requisito menciona "experiencia"
                if (desc.contains("experiencia") && datos.has("experiencia_anios")) {
                    double exp = datos.get("experiencia_anios").asDouble();
                    if (exp >= req.getValorMinimo()) cumple = true;
                }
                
                // Ejemplo: si el requisito menciona "maestría" o "título"
                if (desc.contains("maestría") && datos.has("educacion")) {
                    for (JsonNode titulo : datos.get("educacion")) {
                        if (titulo.asText().toLowerCase().contains("maestría")) {
                            cumple = true;
                            break;
                        }
                    }
                }

                if (cumple) {
                    puntajeTotal += req.getPeso();
                    observaciones.append("Cumple: ").append(req.getDescripcion()).append(". ");
                } else {
                    observaciones.append("No cumple: ").append(req.getDescripcion()).append(". ");
                }
            }

        } catch (JsonProcessingException | NullPointerException e) {
            observaciones.append("Error al procesar los datos del CV del aspirante.");
        }

        Resultado resultado = new Resultado();
        resultado.setPuntajeTotal(puntajeTotal);
        resultado.setObservaciones(observaciones.toString());
        return resultado;
    }
}
