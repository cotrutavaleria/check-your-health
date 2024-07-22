package com.example.backend.services.utils;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.example.backend.configuration.AmazonConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.InputStream;

@Service
public class AmazonService {
    public final AmazonConfiguration amazonConfiguration;
    public AmazonS3 client;

    @Autowired
    public AmazonService(AmazonConfiguration amazonConfiguration) {
        this.amazonConfiguration = amazonConfiguration;
        AWSCredentials credentials = new BasicAWSCredentials(
                this.amazonConfiguration.getAwsAccessKeyId(),
                this.amazonConfiguration.getAwsSecretKey()
        );

        this.client = AmazonS3ClientBuilder
                .standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(Regions.EU_CENTRAL_1)
                .build();
    }

    public void uploadImage(String path, InputStream inputStream) {
        ObjectMetadata objectMetadata = new ObjectMetadata();
        this.client.putObject(
                this.amazonConfiguration.getBucketName(),
                path,
                inputStream, objectMetadata
        );
    }

    public String getImage(String path) {
        String s3_BUCKET_URL = "https://symptochecker-media-bucket.s3.eu-central-1.amazonaws.com/";
        return s3_BUCKET_URL + path;
    }
}
