package com.project.project.controller;

import com.project.project.dto.userServiceDto.InterestDTO;
import com.project.project.entity.UserInterest;
import com.project.project.service.User.UserInterestService;
import com.project.project.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/")
@Slf4j
@RequiredArgsConstructor
public class UserInterestController {
    private final UserInterestService userInterestService;
    private final JWTUtil jwtUtil;

    @GetMapping("/interests")
    public ResponseEntity<List<InterestDTO>> getUserInterest(@RequestHeader("access") String accessToken) {
        String email = jwtUtil.getEmail(accessToken);
        List<InterestDTO> userInterest = userInterestService.getUserInterests(email);

        return ResponseEntity.ok().body(userInterest);
    }

    @PostMapping("/add-interest")
    public ResponseEntity<UserInterest> addInterest(
            @RequestHeader("access") String accessToken,
            @RequestBody InterestDTO interestDTO
    ){
        try {
            String email = jwtUtil.getEmail(accessToken);
            UserInterest userInterest = userInterestService.addUserInterest(email,interestDTO.getInterest());
            return ResponseEntity.ok().body(userInterest);
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/delete-interest")
    public ResponseEntity<Void> deleteInterest(@RequestHeader("access") String accessToken,
                                               @RequestBody InterestDTO interestDTO){
        String email = jwtUtil.getEmail(accessToken);

        boolean success = userInterestService.deleteInterest(email,interestDTO.getInterest());

        if(success){
            return ResponseEntity.noContent().build();
        }else{
            return ResponseEntity.status(401).build();
        }
    }
}
