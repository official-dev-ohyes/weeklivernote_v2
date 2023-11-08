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

        String[] titles = {"‘주간일기’ 첫 스토어 배포 안내", "1.0.2 업데이트 안내"};
        String [] contents = {"먼저, 어플을 사용해 주신 모든 분들에게 감사의 마음을 표현합니다.\n"
            + "\n"
            + "술, 알고 똑똑하게 마시자! 음주를 실시간으로 기록하며 간의 상태와 마신 양을 직관적으로 볼 수 있는 캘린더 기반 다이어리입니다.\n"
            + "\n"
            + "’주간일기’에서는 주종, 양, 그리고 메모와 사진을 첨부하여 음주 기록을 저장하고, 캘린더에서 날짜별로 상세한 이력을 확인할 수 있습니다.\n"
            + "\n"
            + "앱 평가와 리뷰 작성은 개발자에게 큰 도움이 됩니다.",

            "[개선 사항]\n"
                + "- 메인 화면의 배경 및 캐릭터가 변경되었습니다.\n"
                + "- 마이페이지 UI를 개선하였습니다.\n"
                + "- 로딩 화면 디자인을 수정하였습니다.\n"
                + "- 메인화면에서 주종 선택 시 캐러셀 가이드를 추가했습니다.\n"
                + "- 동일 주종으로 기록 시 바로 합산되도록 변경하였습니다.\n"
                + "- 특정 주종에서 잔 단위만 선택가능하도록 변경하였습니다.\n"
                + "- 새벽 시간으로 기록 시 전날 일기가 있을 경우 알림창을 띄웁니다.\n"
                + "- 술력 기록 시 주종과 단위에 기본값을 세팅했습니다.\n"
                + "- 마이페이지에서 회원 정보 수정이 가능합니다.\n"
                + "\n"
                + "[버그 수정]\n"
                + "- 메인화면에서 초기화 버튼 눌렀을 시 작동하지 않는 오류를 수정했습니다.\n"
                + "- 메인화면에서 주종 선택하기 버튼이 반응하지 않는 오류를 수정했습니다.\n"
                + "- 프로필 이미지가 뜨지 않는 현상을 수정했습니다.\n"
                + "- 시간을 선택하지 않았을 경우 알림창을 띄웁니다.\n"
                + "- 술력 기록 시 달력에 바로 반영되지 않는 오류를 수정했습니다.\n"
                + "- 공지사항이 제대로 뜨지 않는 오류를 수정했습니다."};

        for (int i = 0; i < 2; i++) {
            Notice notice = Notice.builder()
                .title(titles[i])
                .content(contents[i])
                .build();
            noticeRepository.save(notice);
        }
    }
}
