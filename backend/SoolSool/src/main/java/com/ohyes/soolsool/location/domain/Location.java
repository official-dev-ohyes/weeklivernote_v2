package com.ohyes.soolsool.location.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Getter
@Setter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Entity
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_pk")
    private Integer locationPk;

    @Column(name = "now_lat")
    private double nowLat;

    @Column(name = "now_long")
    private double nowLong;

    @Column(name = "home_lat")
    private double homeLat;

    @Column(name = "home_long")
    private double homeLong;

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Builder
    private Location(double nowLat, double nowLong, double homeLat, double homeLong) {
        this.nowLat = nowLat;
        this.nowLong = nowLong;
        this.homeLat = homeLat;
        this.homeLong = homeLong;
    }
}
