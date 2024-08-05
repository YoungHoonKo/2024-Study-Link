package com.project.project.controller;

import com.project.project.dto.BoardDTO;
import com.project.project.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/board")
public class BoardController {

    private final BoardService boardService;
    private final DefaultErrorAttributes errorAttributes;

    @GetMapping("/save")
    public String saveFrom(){
        System.out.println("들어옴");
        return "Board/save"; // 경로 수정
    }

    @PostMapping("/save")
    public String save(@ModelAttribute BoardDTO boardDTO) {
        System.out.println("boardDTO = " + boardDTO);
        boardService.save(boardDTO);
        return "Board/index"; // 경로 수정
    }

    @GetMapping("/")
    public String findAll(Model model){
        // DB에서 전체 게시글 데이터를 가져와서 list.html에 보여준다.
        List<BoardDTO> boardDTOList = boardService.findAll();
        model.addAttribute("boardList", boardDTOList);
        return "Board/list"; // 경로 수정
    }

    @GetMapping("/{id}")
    public String findById(@PathVariable Long id, Model model){
        /*
         * 해당 게시글의 조회수를 하나 올리고
         * 게시글 데이터를 가져와서 detail.html에 출력
         * */
        boardService.updateHits(id);
        BoardDTO boardDTO = boardService.findById(id);
        model.addAttribute("board", boardDTO);
        return "Board/detail"; // 경로 수정
    }

    @GetMapping("/update/{id}")
    public String updateFrom(@PathVariable Long id, Model model){
        BoardDTO boardDTO = boardService.findById(id);
        model.addAttribute("boardUpdate", boardDTO);
        return "Board/update"; // 경로 수정
    }

    @PostMapping("/update")
    public String update(@ModelAttribute BoardDTO boardDTO, Model model) {
        BoardDTO board = boardService.update(boardDTO);
        model.addAttribute("board", board);
        return "Board/detail"; // 경로 수정
//        return "redirect:/board/" + boardDTO.getId();
    }
}
