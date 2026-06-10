package com.siead.backend.models;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import jakarta.persistence.*;

@Entity
@Table(name = "Aspirante")
@PrimaryKeyJoinColumn(name = "usuario_id")
public class Aspirante extends Usuario {

    @Column(name = "ruta_cv")
    private String rutaCv;

    // El JSONB se puede manejar como String o usar librerías específicas como Hibernate Types,
    // usaremos String por simplicidad inicial, que se mapea a JSONB según la BD.
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "datos_extraidos", columnDefinition = "jsonb")
    private String datosExtraidos; 

    @Column(name = "puntaje_final")
    private Double puntajeFinal = 0.0;

    // Getters y Setters
    public String getRutaCv() {
        return rutaCv;
    }

    public void setRutaCv(String rutaCv) {
        this.rutaCv = rutaCv;
    }

    public String getDatosExtraidos() {
        return datosExtraidos;
    }

    public void setDatosExtraidos(String datosExtraidos) {
        this.datosExtraidos = datosExtraidos;
    }

    public Double getPuntajeFinal() {
        return puntajeFinal;
    }

    public void setPuntajeFinal(Double puntajeFinal) {
        this.puntajeFinal = puntajeFinal;
    }
}
