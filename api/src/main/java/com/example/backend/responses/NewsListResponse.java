package com.example.backend.responses;

import com.example.backend.dtos.ArticleDto;
import lombok.*;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class NewsListResponse {
    private List<ArticleDto> articles;
}
