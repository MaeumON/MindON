package com.ssafy.mindon.meeting.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class OpenAIService {

    @Value("${openai.api-key}")
    private String apiKey;

    private final String API_URL = "https://api.openai.com/v1/chat/completions";

    public String getChatGPTResponse(String prompt) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalStateException("API key is missing. Please check your configuration.");
        }
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String requestBody = """
                {
                  "model": "gpt-3.5-turbo",
                  "messages": [
                    {"role": "user", "content": "%s"}
                  ]
                }
                """.formatted(prompt);

        try {
            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.exchange(API_URL, HttpMethod.POST, request, Map.class);

            Map responseBody = response.getBody();
            if (responseBody != null) {
                Map choices = ((List<Map>) responseBody.get("choices")).get(0);
                return (String) ((Map) choices.get("message")).get("content");
            }
            return "No response from ChatGPT.";
        } catch (Exception e) {
            return "Error while communicating with ChatGPT: " + e.getMessage();
        }
    }
}