package com.ohyes.soolsool.notice.application;

import com.ohyes.soolsool.notice.dao.NoticeRepository;
import com.ohyes.soolsool.notice.domain.Notice;
import com.ohyes.soolsool.notice.dto.NoticeDetail;
import com.ohyes.soolsool.notice.dto.NoticeResponseDto;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NoticeService {

    private final NoticeRepository noticeRepository;

    public NoticeResponseDto noticeGet() {
        List<Notice> notices = noticeRepository.findAll();
        List<NoticeDetail> noticeDetails = new ArrayList<>();

        notices.forEach(e -> {
            NoticeDetail noticeDetail = NoticeDetail.builder()
                .title(e.getTitle())
                .content(e.getContent())
                .date(LocalDate.from(e.getCreateAt()))
                .build();

            noticeDetails.add(noticeDetail);
        });

        return NoticeResponseDto.builder()
            .notices(noticeDetails)
            .build();
    }
}
