package com.example.backend.dtos;

import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ArticleSourceDto implements Serializable {
    private String name;
    private String url;

}
