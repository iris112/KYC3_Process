package com.kyc3.icotool.dataTypes;

public class VideoReturnObject {
    private RecognitionResult faceRec;
    private Boolean[] wordMatch;

    public VideoReturnObject() {

    }

    public VideoReturnObject(RecognitionResult recognitionResult,
                             Boolean[] wordMatch) {
        this.faceRec = recognitionResult;
        this.wordMatch = wordMatch;
    }

    public void setRecognitionResult(RecognitionResult recognitionResult) {
        this.faceRec = recognitionResult;
    }

    public void setWordMatch(Boolean[] wordMatch) {
        this.wordMatch = wordMatch;
    }

    public RecognitionResult getRecognitionResult() {
        return this.faceRec;
    }

    public Boolean[] getWordMatch() {
        return this.wordMatch;
    }
}
