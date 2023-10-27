package com.ohyes.soolsool;

import com.ohyes.soolsool.drink.dao.CategoryRepository;
import com.ohyes.soolsool.drink.domain.Category;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class CategoryTest {

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    void setCategoriesToDB() {

        categoryRepository.deleteAllInBatch();

        String [] categoryNames = {"소주", "맥주", "소맥", "와인", "막걸리", "하이볼", "칵테일(약)", "칵테일(강)", "위스키"};
        float [] volumes = {19, 5, 10, 11, 6, 8, 8, 20, 40};
        int[] glasses = {50, 200, 200, 150, 200, 400, 200, 200, 45};
        int[] bottles = {360, 500, 400, 750, 750, 400, 200, 200, 750};


        for (int i = 0; i < 9; i++) {
            Category category = Category.builder()
                .categoryName(categoryNames[i])
                .volume(volumes[i])
                .glass(glasses[i])
                .bottle(bottles[i])
                .build();
            categoryRepository.save(category);
        }

    }
}
