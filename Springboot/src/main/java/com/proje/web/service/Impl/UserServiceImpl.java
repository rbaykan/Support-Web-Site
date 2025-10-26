package com.proje.web.service.Impl;
import java.util.*;
import java.util.stream.Collectors;

import com.proje.security.exceptions.TicketClosed;
import com.proje.security.exceptions.TicketNotFound;
import com.proje.web.dto.*;
import com.proje.web.mapper.MessegaMapper;
import com.proje.web.mapper.TicketMapper;
import com.proje.web.model.*;
import com.proje.web.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.proje.security.exceptions.UserNotFound;
import com.proje.web.mapper.UserMapper;
import com.proje.web.repository.UserRepository;
import com.proje.web.service.UserService;




@Service
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final TicketRepository ticketRepository;
	private final UserMapper  userMapper;
	private final TicketMapper ticketMapper;
	private final MessegaMapper messegaMapper;


	private final PasswordEncoder encoder;




	public UserServiceImpl(UserRepository userRepository, UserMapper userMapper, TicketMapper ticketMapper,
			MessegaMapper messegaMapper,
			TicketRepository ticketRepository, @Qualifier("bEncoder")  PasswordEncoder encoder) {

		this.userRepository = userRepository;
		this.encoder = encoder;
		this.ticketRepository = ticketRepository;
		this.userMapper = userMapper;
		this.ticketMapper = ticketMapper;
		this.messegaMapper = messegaMapper;




	}



	@Override
	public List<UserDTO> getAllUser() {

		List<User> users = userRepository.findAll();
		return users.stream().map(
				userMapper::modelToDTO
				).collect(Collectors.toList());
	}



	@Override
	public UserDTO registerNewUser(final CreateUser user) {


		User newUser = new User();

		newUser.setPassword(encoder.encode(user.getPassword()));
		newUser.setUsername(user.getUsername());
		newUser.setFirstname(user.getFirstname());
		newUser.setLastname(user.getLastname());

		Set<Role> roles = new HashSet<>();
		Role role = new Role();
		role.setRole("ROLE_USER");
		roles.add(role);
		newUser.setRoles(roles);

		userRepository.save(newUser);


		return userMapper.modelToDTO(newUser);

	}



	@Override
	public String login(LoginUser user) {

		User loginUser = userRepository.findByUsername(user.getUsername())
				.orElseThrow(UserNotFound::new);

		if(encoder.matches(user.getPassword(), loginUser.getPassword())) {
			return user.getUsername();
		}

		throw new UserNotFound();
	}


	@Override
	public UserDTO getUserWithName(String username) {


		User user = userRepository.findByUsername(username).orElseThrow(UserNotFound::new);


        return userMapper.modelToDTO(user);

	}


	@Override
	public List<TicketDTO> allTickets() {
		List<Ticket> tickets = ticketRepository.findAll();

        return tickets.stream()
                .map(ticketMapper::modelToDTO)
                .toList();

	}


	@Override
	public TicketDTO createTicket(CreateTicket createTicket) {
		User user = userRepository.findById(createTicket.getUserID()).orElseThrow(UserNotFound::new);

		Ticket ticket = new Ticket();
		ticket.setTicketCategory(createTicket.getTicketCategory());
		ticket.setThread(createTicket.getThread());
		ticket.setStatus(TicketStatus.OPEN);
		ticket.setUser(user);



		List<Message> messages = new ArrayList<Message>();
		Message message = new Message();
		message.setUser(user.getUsername());
		message.setMessage(createTicket.getMessage());
		message.setTicket(ticket);

		messages.add(message);
		ticket.setMessages(messages);

		ticket = ticketRepository.save(ticket);



        return ticketMapper.modelToDTO(ticket);
	}

	@Override
	public MessageDTO sendMessage(SendMessage message) {


		Ticket ticket = ticketRepository.findById(message.getTicketId()).orElseThrow(TicketNotFound::new);

		if(ticket.getStatus() != TicketStatus.CLOSED){

		User user = userRepository.findById(message.getUserId()).orElseThrow(UserNotFound::new);
		ticket.setStatus(TicketStatus.REPLIED);

		Message m = new Message();

		if(ticket.getUser() == user) {
			String username = user.getUsername();
			String msg = message.getMes();


			m.setUser(user.getUsername());
			m.setMessage(message.getMes());
			m.setTicket(ticket);

			ticket.getMessages().add(m);
		} else {
			boolean admin = false;
			for(var role : user.getRoles()) {
				if(role.getRole().equals("ROLE_ADMIN")) {
					admin = true;
					break;
				}
			}

			if(admin) {
				m = new Message();
				m.setUser(user.getUsername());
				m.setMessage(message.getMes());
				m.setTicket(ticket);

				ticket.getMessages().add(m);
			}

			return messegaMapper.modelToDTO(m);
		}




		}

		throw new TicketClosed();
	}

	@Override
	public boolean closeTicket(CloseTicket closeTicket) {
		Ticket ticket = ticketRepository.findById(closeTicket.getId()).orElseThrow(TicketNotFound::new);

		ticket.setStatus(TicketStatus.CLOSED);

		Ticket closedTicket =  ticketRepository.save(ticket);

		return true;
	}
}


