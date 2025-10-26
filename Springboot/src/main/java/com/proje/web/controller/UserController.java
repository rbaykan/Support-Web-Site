package com.proje.web.controller;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.proje.security.exceptions.UserAlReady;
import com.proje.security.service.JwtUtils;
import com.proje.web.dto.*;
import com.proje.web.model.Message;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.proje.web.service.UserService;

import jakarta.validation.Valid;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/api/user")
public class UserController {


	private final UserService userService;
	private final AuthenticationManager authenticationManager;
	private final JwtUtils jwtUtils;


	public UserController(UserService service, AuthenticationManager authenticationManager, JwtUtils jwtUtils){

		this.userService = service;
		this.authenticationManager = authenticationManager;
		this.jwtUtils = jwtUtils;


	}




	@GetMapping()
	@PreAuthorize("hasRole('ADMIN')")
	public List<UserDTO> allUser(){
		return userService.getAllUser();
	}



	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody CreateUser user) {
		try {
			UserDTO userDTO = userService.registerNewUser(user);
			return ResponseEntity.status(HttpStatus.CREATED).body(userDTO);
		} catch (UserAlReady e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}


	@PostMapping("/login")
	public ResponseEntity<?> authenticateUser(@RequestBody LoginUser loginUser){
		Authentication authentication;
		{
			try {
				authentication = authenticationManager.authenticate(
						new UsernamePasswordAuthenticationToken(loginUser.getUsername(), loginUser.getPassword())
				);
			} catch (AuthenticationException e) {
				Map<String, Object> map = new HashMap<>();
				map.put("message", "Bad Creditials");
				map.put("status", false);
				return  new ResponseEntity<Object>(map, HttpStatus.NOT_FOUND);
			}
		}


		UserDetails details = (UserDetails)  authentication.getPrincipal();

		String jwtToken = jwtUtils.generateTokenFromUsername(details);


		return  ResponseEntity.ok(jwtToken);
	}

   // Test için bir API. JWT ile kullanıcı bilgilerine erişmek
	@GetMapping("/loginJWT")
	public ResponseEntity<?> loginJWT(HttpServletRequest request){

		String jwt = jwtUtils.getJwtFromHeader(request);
		boolean isValidete = jwtUtils.validateToken(jwt);

		if(!isValidete){
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token invalid");
		}

		String username = jwtUtils.getUsernameFromToken(jwt);

		UserDTO user = userService.getUserWithName(username);

		return ResponseEntity.ok(user);
	}



	@PostMapping("/createTicket")
	@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
	public ResponseEntity<?> createTick(@RequestBody CreateTicket createTicket) {



		TicketDTO ticket = userService.createTicket(createTicket);
		return ResponseEntity.status(HttpStatus.CREATED).body(ticket);
	}

	@GetMapping("/tickets")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getTickets() {


		List<TicketDTO> tickets = userService.allTickets();

		return ResponseEntity.status(HttpStatus.CREATED).body(tickets);
	}

	@PutMapping("/sendMessage")
	@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
	public ResponseEntity<?> getTickets(@RequestBody SendMessage message) {


		MessageDTO messageDTO = userService.sendMessage(message);

		return ResponseEntity.ok(messageDTO);
	}



	@PutMapping("/closeTicket")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> closeTicket(@RequestBody CloseTicket closeTicket) {

		return ResponseEntity.ok(userService.closeTicket(closeTicket));
	}





}
