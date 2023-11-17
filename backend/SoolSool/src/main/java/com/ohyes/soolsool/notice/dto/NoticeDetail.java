package com.ohyes.soolsool.notice.dto;

import java.time.LocalDate;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoticeDetail {

    private String title;
    private String content;
    private LocalDate date;

    @Builder
    private NoticeDetail(String title, String content, LocalDate date) {
        this.title = title;
        this.content = content;
        this.date = date;
    }
}
