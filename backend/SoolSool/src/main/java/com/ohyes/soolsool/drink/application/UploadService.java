package com.ohyes.soolsool.drink.application;

import com.amazonaws.SdkClientException;
import com.ohyes.soolsool.drink.dao.DiaryRepository;
import com.ohyes.soolsool.drink.domain.Diary;
import com.ohyes.soolsool.user.dao.UserRepository;
import com.ohyes.soolsool.user.domain.User;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;


@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UploadService {

    private final UserRepository userRepository;
    private final DiaryRepository diaryRepository;
    private final S3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.s3.directory}")
    private String directory;

    private String upload(File uploadFile, String dirName) {
        String fileName = dirName + "/" + uploadFile.getName();
        String uploadUrl = putS3(uploadFile, fileName);

        removeNewFile(uploadFile);  // 로컬에 생성된 File 삭제 (MultipartFile -> File 전환 하며 로컬에 파일 생성됨)

        return uploadUrl;      // 업로드된 파일의 S3 URL 주소 반환
    }

    private void removeNewFile(File targetFile) {
        System.gc();
        System.runFinalization();
        if (targetFile.delete()) {
            log.info("파일이 삭제되었습니다.");
        } else {
            log.info("파일이 삭제되지 못했습니다.");
        }
    }

    private Optional<File> convert(MultipartFile file) throws IOException {
        String fileName = file.getOriginalFilename();
        String ext = fileName.substring(fileName.lastIndexOf(".") + 1);

        File convertFile = new File(UUID.randomUUID() + "." + ext);
        if (convertFile.createNewFile()) {
            try (FileOutputStream fos = new FileOutputStream(convertFile)) {
                fos.write(file.getBytes());
            }
            return Optional.of(convertFile);
        }
        return Optional.empty();
    }

    private String putS3(File uploadFile, String fileName) {
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
            .bucket(bucket)
            .key(fileName)
            .acl(ObjectCannedACL.BUCKET_OWNER_FULL_CONTROL)
            .build();
        s3Client.putObject(putObjectRequest, RequestBody.fromFile(uploadFile));
        return String.valueOf(s3Client.utilities()
            .getUrl(GetUrlRequest.builder().bucket(bucket).key(fileName).build()));
    }

    @Transactional
    public void drinkPhotoAdd(LocalDate drinkDate, MultipartFile multipartFile, Long socialId)
        throws IOException {
        User user = userRepository.findBySocialId(socialId)
            .orElseThrow(() -> new NullPointerException("해당 유저가 존재하지 않습니다."));
        Diary existingDiary = diaryRepository.findByDrinkDateAndUser(drinkDate, user)
            .orElseThrow(() -> new NullPointerException("해당 날짜의 일기가 존재하지 않습니다."));

        // 이미 사진이 있는 상태면 먼저 삭제
        if (existingDiary.getImg() != null) {
            drinkPhotoDelete(existingDiary, existingDiary.getImg());
        }
        if (multipartFile != null) {
            File uploadFile = convert(multipartFile)
                .orElseThrow(() -> new IllegalArgumentException("MultipartFile에서 File로의 전환 실패"));

            String url = upload(uploadFile, directory);
            existingDiary.setImg(url);
            diaryRepository.save(existingDiary);
        } else {
            existingDiary.setImg(null);
        }
    }

    @Transactional
    public void drinkPhotoDelete(Diary diary, String fileName) throws IOException {
        try {
            String key = fileName.split("/")[3] + "/" + fileName.split("/")[4];
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();
            s3Client.deleteObject(deleteObjectRequest);
            diary.setImg(null);
        } catch (SdkClientException e) {
            throw new IOException("S3 사진 삭제 실패");
        }
    }
}
