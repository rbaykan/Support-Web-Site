package com.proje.web.dto;

import com.proje.web.model.TicketCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateTicket {
    private Long userID;
    private String thread;
    private String message;
    private TicketCategory ticketCategory;



}
