package com.siead.backend.dto;

public class PostulacionRequest {
    private Integer aspiranteId;
    private Integer convocatoriaId;
    private String datosValidadosJson; // JSON string con la data corregida por el usuario

    public Integer getAspiranteId() { return aspiranteId; }
    public void setAspiranteId(Integer aspiranteId) { this.aspiranteId = aspiranteId; }
    public Integer getConvocatoriaId() { return convocatoriaId; }
    public void setConvocatoriaId(Integer convocatoriaId) { this. convocatoriaId = convocatoriaId; }
    public String getDatosValidadosJson() { return datosValidadosJson; }
    public void setDatosValidadosJson(String datosValidadosJson) { this.datosValidadosJson = datosValidadosJson; }
}
