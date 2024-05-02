package vn.edu.hcmute.boardinghousemanagementsystem.service.impl;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import vn.edu.hcmute.boardinghousemanagementsystem.entity.Invoice;
import vn.edu.hcmute.boardinghousemanagementsystem.entity.Room;
import vn.edu.hcmute.boardinghousemanagementsystem.entity.RoomBooking;
import vn.edu.hcmute.boardinghousemanagementsystem.entity.User;
import vn.edu.hcmute.boardinghousemanagementsystem.repo.InvoiceRepository;
import vn.edu.hcmute.boardinghousemanagementsystem.service.InvoiceService;
import vn.edu.hcmute.boardinghousemanagementsystem.service.UserService;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Slf4j
@Service
public class InvoiceServiceImpl implements InvoiceService {
    private final InvoiceRepository invoiceRepository;
    private final UserService userService;
    @Override
    public List<Invoice> findAllInvoice() {
        return invoiceRepository.findAll();
    }

    @Override
    public List<Invoice> findInvoicesByUsername(String username) {
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found!"));

        List<Invoice> invoices = new ArrayList<>();

        for (RoomBooking roomBooking : user.getRoomBookings()) {
            invoices = roomBooking.getInvoices();
        }

        return invoices;
    }
}