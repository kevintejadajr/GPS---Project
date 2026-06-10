package com.siead.backend.controllers;

import com.siead.backend.dto.PostulacionRequest;
import com.siead.backend.models.Postulacion;
import com.siead.backend.services.DocumentoIAService;
import com.siead.backend.services.PostulacionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.siead.backend.dto.RankingDTO;
import java.util.List;

@RestController
@RequestMapping("/api/postulaciones")
@CrossOrigin(origins = "*")
public class PostulacionController {

    private final PostulacionService postulacionService;
    private final DocumentoIAService documentoIAService;

    public PostulacionController(PostulacionService postulacionService, DocumentoIAService documentoIAService) {
        this.postulacionService = postulacionService;
        this.documentoIAService = documentoIAService;
    }

    // Endpoint 1: Extraer CV mediante IA (HU01, HU02)
    @PostMapping("/extraer-cv")
    @PreAuthorize("hasRole('ASPIRANTE')")
    public ResponseEntity<String> extraerCV(@RequestParam("file") MultipartFile file) {
        try {
            // Llama al servicio de IA para extraer datos del PDF
            String jsonResult = documentoIAService.extraerDatos(file.getOriginalFilename());
            return ResponseEntity.ok(jsonResult);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error extrayendo datos del documento.");
        }
    }

    // Endpoint 2: Guardar Postulación y Evaluar Automáticamente (HU03)
    @PostMapping
    @PreAuthorize("hasRole('ASPIRANTE')")
    public ResponseEntity<Postulacion> crearPostulacion(@RequestBody PostulacionRequest request) {
        try {
            return ResponseEntity.ok(postulacionService.crearPostulacionYEvaluar(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Endpoint 3: Obtener Ranking por Convocatoria (HU03)
    @GetMapping("/convocatoria/{convocatoriaId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RankingDTO>> getRankingByConvocatoria(@PathVariable Integer convocatoriaId) {
        try {
            return ResponseEntity.ok(postulacionService.getRankingByConvocatoria(convocatoriaId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
