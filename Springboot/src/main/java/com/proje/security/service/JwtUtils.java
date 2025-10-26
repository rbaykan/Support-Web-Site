package com.proje.security.service;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;



@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expirations}")
    private int jwtExpirations;

    public String getJwtFromHeader(HttpServletRequest request){

        String bearer = request.getHeader("Authorization");

        if(bearer != null && bearer.startsWith("Bearer ")){
            return bearer.substring(7);
        }

        return null;
    }


    private Key key(){
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String generateTokenFromUsername(final UserDetails userDetails){

        String username = userDetails.getUsername();

        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + jwtExpirations))
                .signWith(key())
                .compact();


    }

    public String generateTokenFromUsername(String username){


        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + jwtExpirations))
                .signWith(key())
                .compact();


    }

    public String getUsernameFromToken(String token){
        return Jwts.parser().verifyWith((SecretKey) key()).build()
                .parseSignedClaims(token).getPayload().getSubject();
    }

    public boolean validateToken(String authToken)
    {
        try {

            Jwts.parser().verifyWith((SecretKey) key()).build().parseSignedClaims(authToken);

            return  true;
        }catch(Exception e){

            if(e instanceof MalformedJwtException){
                System.err.println("Invaild JWT Token " + e.getMessage());
            }

            if(e instanceof ExpiredJwtException){
                System.err.println("Jwt token is expired " + e.getMessage());
            }

            if(e instanceof UnsupportedJwtException){
                System.err.println("Jwts token is not supported " + e.getMessage());
            }

            if(e instanceof  IllegalArgumentException){
                System.err.println("Jwt claims string is empty " + e.getMessage());
            }
        }

        return  false;
    }

}
