package com.ohyes.soolsool;

import com.ohyes.soolsool.drink.domain.Category;
import com.ohyes.soolsool.notice.dao.NoticeRepository;
import com.ohyes.soolsool.notice.domain.Notice;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class NoticeTest {

    @Autowired
    private NoticeRepository noticeRepository;

    @Test
    void setNoticesToDB() {

        noticeRepository.deleteAllInBatch();

        String [] titles = {"첫번째 공지사항", "두번째 공지사항"};
        String [] contents = {"앱 출시 조금 더 미뤄질 예정입니다", "아마 이번주 안에는 되겠죠?"};

        for (int i = 0; i < 2; i++) {
            Notice notice = Notice.builder()
                .title(titles[i])
                .content(contents[i])
                .build();
            noticeRepository.save(notice);
        }
    }
}
