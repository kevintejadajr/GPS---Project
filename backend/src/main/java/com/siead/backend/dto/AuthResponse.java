package com.siead.backend.dto;

public class AuthResponse {
    private String token;
    private String tipoRol;
    private Integer usuarioId;
    private String nombre;

    public AuthResponse(String token, String tipoRol, Integer usuarioId, String nombre) {
        this.token = token;
        this.tipoRol = tipoRol;
        this.usuarioId = usuarioId;
        this.nombre = nombre;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getTipoRol() { return tipoRol; }
    public void setTipoRol(String tipoRol) { this.tipoRol = tipoRol; }
    public Integer getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Integer usuarioId) { this.usuarioId = usuarioId; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}
