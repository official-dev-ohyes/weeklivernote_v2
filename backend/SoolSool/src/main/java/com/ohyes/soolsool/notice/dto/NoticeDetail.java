package com.ohyes.soolsool.notice.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoticeDetail {

    private String title;
    private String content;

    @Builder
    private NoticeDetail(String title, String content) {
        this.title = title;
        this.content = content;
    }
}
