package com.siead.backend.services;

import com.siead.backend.dto.AuthRequest;
import com.siead.backend.dto.AuthResponse;
import com.siead.backend.dto.RegisterRequest;
import com.siead.backend.models.Aspirante;
import com.siead.backend.models.Usuario;
import com.siead.backend.repositories.AspiranteRepository;
import com.siead.backend.repositories.UsuarioRepository;
import com.siead.backend.security.CustomUserDetailsService;
import com.siead.backend.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final AspiranteRepository aspiranteRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public AuthService(UsuarioRepository usuarioRepository, 
                       AspiranteRepository aspiranteRepository, 
                       PasswordEncoder passwordEncoder, 
                       AuthenticationManager authenticationManager, 
                       JwtUtil jwtUtil, 
                       CustomUserDetailsService userDetailsService) {
        this.usuarioRepository = usuarioRepository;
        this.aspiranteRepository = aspiranteRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return new AuthResponse(token, usuario.getTipoRol(), usuario.getId(), usuario.getNombre());
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado.");
        }

        Usuario usuario;

        if ("ASPIRANTE".equalsIgnoreCase(request.getTipoRol())) {
            Aspirante aspirante = new Aspirante();
            aspirante.setNombre(request.getNombre());
            aspirante.setEmail(request.getEmail());
            aspirante.setPassword(passwordEncoder.encode(request.getPassword()));
            aspirante.setTipoRol("ASPIRANTE");
            aspirante.setPuntajeFinal(0.0);
            usuario = aspiranteRepository.save(aspirante);
        } else {
            usuario = new Usuario();
            usuario.setNombre(request.getNombre());
            usuario.setEmail(request.getEmail());
            usuario.setPassword(passwordEncoder.encode(request.getPassword()));
            usuario.setTipoRol("ADMIN");
            usuario = usuarioRepository.save(usuario);
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(usuario.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return new AuthResponse(token, usuario.getTipoRol(), usuario.getId(), usuario.getNombre());
    }
}
