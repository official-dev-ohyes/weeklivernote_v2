package com.ohyes.soolsool.notice.dto;

import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoticeResponseDto {

    private List<NoticeDetail> notices;

    @Builder
    private NoticeResponseDto(List<NoticeDetail> notices) {
        this.notices = notices;
    }
}
