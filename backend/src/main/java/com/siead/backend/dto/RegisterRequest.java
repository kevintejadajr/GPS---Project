package com.siead.backend.dto;

public class RegisterRequest {
    private String nombre;
    private String email;
    private String password;
    private String tipoRol; // 'ASPIRANTE' o 'ADMIN'

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getTipoRol() { return tipoRol; }
    public void setTipoRol(String tipoRol) { this.tipoRol = tipoRol; }
}
