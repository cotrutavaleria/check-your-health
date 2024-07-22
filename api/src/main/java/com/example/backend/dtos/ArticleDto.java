package com.example.backend.dtos;

import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ArticleDto implements Serializable {
    private String title;
    private String description;
    private String image;
    private String content;
    private String url;
    private String publishedAt;
    private ArticleSourceDto source;
}
