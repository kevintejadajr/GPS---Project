package com.siead.backend.dto;

public class RankingDTO {
    private Integer postulacionId;
    private String nombreAspirante;
    private String emailAspirante;
    private Double puntajeFinal;
    private String estado;
    private String observaciones;

    public RankingDTO() {}

    public RankingDTO(Integer postulacionId, String nombreAspirante, String emailAspirante, Double puntajeFinal, String estado, String observaciones) {
        this.postulacionId = postulacionId;
        this.nombreAspirante = nombreAspirante;
        this.emailAspirante = emailAspirante;
        this.puntajeFinal = puntajeFinal;
        this.estado = estado;
        this.observaciones = observaciones;
    }

    public Integer getPostulacionId() { return postulacionId; }
    public void setPostulacionId(Integer postulacionId) { this.postulacionId = postulacionId; }

    public String getNombreAspirante() { return nombreAspirante; }
    public void setNombreAspirante(String nombreAspirante) { this.nombreAspirante = nombreAspirante; }

    public String getEmailAspirante() { return emailAspirante; }
    public void setEmailAspirante(String emailAspirante) { this.emailAspirante = emailAspirante; }

    public Double getPuntajeFinal() { return puntajeFinal; }
    public void setPuntajeFinal(Double puntajeFinal) { this.puntajeFinal = puntajeFinal; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
}
