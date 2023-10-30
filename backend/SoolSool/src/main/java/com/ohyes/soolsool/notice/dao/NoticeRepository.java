package com.ohyes.soolsool.notice.dao;

import com.ohyes.soolsool.notice.domain.Notice;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Byte> {

    List<Notice> findAll();
}
