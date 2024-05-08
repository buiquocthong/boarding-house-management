package vn.edu.hcmute.boardinghousemanagementsystem.dto;

import lombok.ToString;
import vn.edu.hcmute.boardinghousemanagementsystem.entity.Room;
import vn.edu.hcmute.boardinghousemanagementsystem.util.enums.Floor;
import vn.edu.hcmute.boardinghousemanagementsystem.util.enums.RoomStatus;
import vn.edu.hcmute.boardinghousemanagementsystem.util.enums.RoomType;

public record RoomDto(
        Long id,
        Float rentAmount,
        String roomNumber,
        String floor,
        Float area,
        String type,
        String status
) {
    public RoomDto(Room room) {
        this(room.getId(), room.getRentAmount(), room.getRoomNumber(),
                room.getFloor().toString(), room.getArea(), room.getType().toString(),
                room.getStatus().toString());
    }

    public Room getNewRoom() {
        Room room = Room.builder()
                .roomNumber(roomNumber)
                .type(RoomType.valueOf(type))
                .rentAmount(rentAmount)
                .floor(Floor.valueOf(floor))
                .area(area)
                .status(RoomStatus.AVAILABLE)
                .build();
        return room;

    }
    public Room getRoom(){
        Room room = Room.builder()
                .roomNumber(roomNumber)
                .type(RoomType.valueOf(type))
                .rentAmount(rentAmount)
                .floor(Floor.valueOf(floor))
                .area(area)
                .status(RoomStatus.valueOf(status))
                .build();
        return room;
    }
    public static RoomDto of(Room room) {
        return new RoomDto(room);
    }
}
