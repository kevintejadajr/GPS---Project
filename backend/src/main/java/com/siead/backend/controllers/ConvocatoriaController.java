package com.siead.backend.controllers;

import com.siead.backend.dto.ConvocatoriaRequest;
import com.siead.backend.models.Convocatoria;
import com.siead.backend.models.Requisito;
import com.siead.backend.services.ConvocatoriaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/convocatorias")
@CrossOrigin(origins = "*") // Permitir CORS temporalmente para desarrollo
public class ConvocatoriaController {

    private final ConvocatoriaService convocatoriaService;

    public ConvocatoriaController(ConvocatoriaService convocatoriaService) {
        this.convocatoriaService = convocatoriaService;
    }

    @GetMapping
    public ResponseEntity<List<Convocatoria>> getAll() {
        return ResponseEntity.ok(convocatoriaService.getAllConvocatorias());
    }

    @GetMapping("/{id}/requisitos")
    public ResponseEntity<List<Requisito>> getRequisitos(@PathVariable Integer id) {
        return ResponseEntity.ok(convocatoriaService.getRequisitosByConvocatoria(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Convocatoria> create(@RequestBody ConvocatoriaRequest request) {
        try {
            return ResponseEntity.ok(convocatoriaService.createConvocatoria(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
