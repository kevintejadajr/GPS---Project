package com.siead.backend.dto;

import java.time.LocalDate;
import java.util.List;

public class ConvocatoriaRequest {
    private String nombreConvocatoria;
    private String titulo;
    private String descripcion;
    private LocalDate fechaCierre;
    private List<RequisitoRequest> requisitos;

    public String getNombreConvocatoria() { return nombreConvocatoria; }
    public void setNombreConvocatoria(String nombreConvocatoria) { this.nombreConvocatoria = nombreConvocatoria; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public LocalDate getFechaCierre() { return fechaCierre; }
    public void setFechaCierre(LocalDate fechaCierre) { this.fechaCierre = fechaCierre; }
    public List<RequisitoRequest> getRequisitos() { return requisitos; }
    public void setRequisitos(List<RequisitoRequest> requisitos) { this.requisitos = requisitos; }
}
