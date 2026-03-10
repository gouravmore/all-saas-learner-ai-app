import { pipeline, env } from "@xenova/transformers";

env.localModelPath = "https://huggingface.co/Xenova/whisper-tiny/resolve/main/";

let transcriberInstance = null;
let transcriberPromise = null;

export const loadTranscriber = async () => {
  if (transcriberInstance) {
    return transcriberInstance;
  }

  if (!transcriberPromise) {
    transcriberPromise = pipeline(
      "automatic-speech-recognition",
      "Xenova/whisper-tiny",
      { quantized: true }
    )
      .then((instance) => {
        transcriberInstance = instance;
        return instance;
      })
      .catch((err) => {
        transcriberPromise = null;
        throw err;
      });
  }

  return transcriberPromise;
};
