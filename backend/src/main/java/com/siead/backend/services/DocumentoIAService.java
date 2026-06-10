package com.siead.backend.services;

import org.springframework.stereotype.Service;

@Service
public class DocumentoIAService {

    /**
     * MOCK TEMPORAL
     * Simula la llamada a la API de LLM (ej. Gemini) para extraer datos de un CV.
     * @param rutaCv Ruta o contenido del archivo subido.
     * @return String en formato JSON con la información extraída.
     */
    public String extraerDatos(String rutaCv) {
        // En una implementación real, aquí se usaría un cliente HTTP 
        // para llamar a la API de IA (ej. Google Gemini API) enviando el documento.
        
        return "{\n" +
                "  \"experiencia_anios\": 5,\n" +
                "  \"educacion\": [\"Maestría en Educación\", \"Ingeniería de Software\"],\n" +
                "  \"habilidades\": [\"Java\", \"React\", \"Docencia\", \"Spring Boot\"]\n" +
                "}";
    }
}
