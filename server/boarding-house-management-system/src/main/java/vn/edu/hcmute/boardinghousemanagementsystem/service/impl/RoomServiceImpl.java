package vn.edu.hcmute.boardinghousemanagementsystem.service.impl;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import vn.edu.hcmute.boardinghousemanagementsystem.dto.RoomDto;
import vn.edu.hcmute.boardinghousemanagementsystem.entity.Room;
import vn.edu.hcmute.boardinghousemanagementsystem.entity.RoomBooking;
import vn.edu.hcmute.boardinghousemanagementsystem.entity.User;
import vn.edu.hcmute.boardinghousemanagementsystem.repo.RoomRepository;
import vn.edu.hcmute.boardinghousemanagementsystem.service.RoomService;
import vn.edu.hcmute.boardinghousemanagementsystem.service.UserService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@AllArgsConstructor
@Slf4j
@Service
public class RoomServiceImpl implements RoomService {
    private final RoomRepository roomRepository;
    private final UserService userService;

    @Override
    public Optional<Room> findById(long id) {
        if (id <= 0) {
            return Optional.empty();
        }
        return roomRepository.findById(id);
    }

    @Override
    public List<Room> findAllRooms() {
        return roomRepository.findAll();
    }


    @Override
    public List<Room> findRoomsByUsername(String username) {
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found!"));

        List<Room> rooms = new ArrayList<>();

        for (RoomBooking roomBooking : user.getRoomBookings()) {
            rooms.add(roomBooking.getRoom());
        }

        return rooms;
    }

    @Override
    public Room save(Room room) {
        if (room == null) {
            log.error("Room instance is null");
            return null;
        }
        return roomRepository.save(room);
    }

    @Override
    public void save(List<Room> rooms) {
        if (rooms == null) {
            log.error("Rooms is null");
            return;
        }
        roomRepository.saveAll(rooms);
    }

    @Override
    public void delete(long id) {
        if (id <= 0) {
            return;
        }
        if (!roomRepository.existsById(id)) {
            return;
        }
        Room room = roomRepository.findById(id).get();
        List<RoomBooking> roomBookings = room.getRoomBookings();
        for (RoomBooking roomBooking: roomBookings){
            roomBooking.setRoom(null);
        }
        room.getRoomBookings().clear();
        roomRepository.delete(room);
    }

}
