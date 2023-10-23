package com.ohyes.soolsool.sample.dao;

import com.ohyes.soolsool.sample.domain.Sample;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SampleRepository extends JpaRepository<Sample, Long> {

}
