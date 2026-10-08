class RelayAudio extends AudioWorkletProcessor {
  constructor() { super(); this.buffer = new Float32Array(2048); this.offset = 0; }
  process(inputs) {
    const channels = inputs[0];
    if (channels?.[0]) for (let i = 0; i < channels[0].length; i++) {
      this.buffer[this.offset++] = channels.reduce((sum, channel) => sum + channel[i], 0) / channels.length;
      if (this.offset === this.buffer.length) { this.port.postMessage(this.buffer, [this.buffer.buffer]); this.buffer = new Float32Array(2048); this.offset = 0; }
    }
    return true;
  }
}
registerProcessor('relay-audio', RelayAudio);
