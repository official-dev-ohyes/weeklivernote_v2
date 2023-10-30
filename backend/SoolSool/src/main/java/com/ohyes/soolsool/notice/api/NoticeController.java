package com.ohyes.soolsool.notice.api;

import com.ohyes.soolsool.notice.application.NoticeService;
import com.ohyes.soolsool.notice.dto.NoticeResponseDto;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Notice", description = "공지사항 API document")
public class NoticeController {

    private final NoticeService noticeService;

    @GetMapping("/v1/notice")
    public ResponseEntity<Object> noticeGet() {
        NoticeResponseDto noticeResponseDto = noticeService.noticeGet();
        return new ResponseEntity<>(noticeResponseDto, HttpStatus.OK);
    }
}
