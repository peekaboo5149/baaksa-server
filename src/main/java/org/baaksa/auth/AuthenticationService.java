package org.baaksa.auth;

import lombok.RequiredArgsConstructor;
import org.baaksa.auth.dto.AuthenticationRequest;
import org.baaksa.auth.dto.AuthenticationResponse;
import org.baaksa.auth.dto.RegisterRequest;
import org.baaksa.config.JwtService;
import org.baaksa.exception.UserAlreadyExist;
import org.baaksa.user.Role;
import org.baaksa.user.User;
import org.baaksa.user.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {

        Optional<User> existingUser = userRepository.findUserByEmail(request.getEmail());
        if (existingUser.isPresent())
            throw new UserAlreadyExist();

        var user = User.builder()
                .email(request.getEmail())
                .password(encoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(Role.USER)
                .build();
        userRepository.save(user);
        String token = jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(token).build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findUserByEmail(request.getEmail()).orElseThrow();
        String token = jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(token).build();

    }
}
