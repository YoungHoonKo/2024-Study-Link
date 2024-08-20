package com.project.project.dto.Admin_user;

import com.project.project.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoardDTO {
    private Long id;
    private String boardWriter;
    private String boardTitle;
    private String boardContent;
    private String status;
    private String boardPass;

    private String boardlink;
}
