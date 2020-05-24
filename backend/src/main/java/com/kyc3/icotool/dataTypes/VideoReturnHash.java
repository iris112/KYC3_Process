package com.kyc3.icotool.dataTypes;

public class VideoReturnHash {
    private RecognitionHash faceRec;
    private Boolean[] wordMatch;

    public VideoReturnHash() {

    }

    public VideoReturnHash(RecognitionHash recognitionHash,
                             Boolean[] wordMatch) {
        this.faceRec = recognitionHash;
        this.wordMatch = wordMatch;
    }

    public void setRecognitionResult(RecognitionHash recognitionHash) {
        this.faceRec = recognitionHash;
    }

    public void setWordMatch(Boolean[] wordMatch) {
        this.wordMatch = wordMatch;
    }

    public RecognitionHash getRecognitionResult() {
        return this.faceRec;
    }

    public Boolean[] getWordMatch() {
        return this.wordMatch;
    }
}
