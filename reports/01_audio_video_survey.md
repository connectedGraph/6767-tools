# 音视频与多媒体工具 (Audio & Video) 开源生态调研报告

> **调研分类**: 音视频与多媒体 (Audio & Video)  
> **涉及工具**: 白噪音混音器、免插件屏幕录制、在线波形录音机/剪辑、电子节拍器与乐器调音器  
> **调研执行**: GitHub CLI (`gh search repos`) + 开源技术栈基准分析  
> **报告归档**: `reports/01_audio_video_survey.md`

---

## 一、调研工具清单与开源标杆盘点

### 1. 白噪音与专注助眠多轨混音器 (`/white-noise-player`)

- **功能定位**: 纯前端多音轨（雨声、雷鸣、海浪、森林鸟鸣、篝火、咖啡馆、白/粉/棕色噪音）混合播放、独立音量控制、场景预设、定时渐弱休眠。
- **GitHub 顶级开源项目盘点**:
  1. **Moodist** (`Remcostoeten/moodist` / `agarrharr/moodist`)
     - **Star 数**: 1.2k+ | **License**: MIT
     - **技术栈**: React / Next.js / Web Audio API + 音频资源预载
     - **核心特性**: 75+ 种精选无缝循环环境音、多音轨混合保存至本地、极简美学 UI。
  2. **Thames / A Soft Murmur Web** (`anastasop/thames`)
     - **Star 数**: 500+ | **License**: MIT
     - **技术栈**: Vanilla JS + Web Audio `AudioBufferSourceNode`
     - **核心特性**: 多音轨平滑增益调节 (`GainNode`)、定时器平滑淡出算法。
  3. **Web Audio Noise Generator** (`web-audio-components/white-noise`)
     - **Star 数**: 200+ | **License**: MIT
     - **技术栈**: Web Audio `ScriptProcessorNode` / `AudioWorklet`
     - **核心特性**: 零音频文件网络依赖，纯数学算法动态合成白噪音 (White)、粉红噪音 (Pink) 与棕色噪音 (Brown)。
- **与本项目当前实现对比**:
  - **当前实现**: 基于纯前端 Web Audio API 动态振荡器与噪声算法合成，完全零静态音频文件体积，即开即用。
  - **开源资产化建议**: **保留纯算法合成模式作为主力**；若后续需要极高保真度的真实自然录音，可将 `Moodist` 的 10 组核心轻量音频切片（如 200KB OGG 循环片段）引入本地 `audio/` 目录作为高保真音轨选项。

---

### 2. 免插件屏幕与窗口录制工具 (`/screen-recorder`)

- **功能定位**: 纯浏览器调用 `navigator.mediaDevices.getDisplayMedia` 录制整个桌面/应用窗口/标签页，支持麦克风/系统声音录制，本地生成 WebM/MP4。
- **GitHub 顶级开源项目盘点**:
  1. **RecordRTC** (`muaz-khan/RecordRTC`)
     - **Star 数**: **6,916⭐** | **License**: MIT
     - **技术栈**: JavaScript (WebRTC MediaStreamRecorder / StereoAudioRecorder)
     - **核心特性**: WebRTC 录屏与录音领域的跨浏览器标准库，支持屏幕+麦克风混音、Canvas 动画捕获、GIF 转换与分段切片导出。
  2. **Screenity** (`alyssaxuu/screenity`)
     - **Star 数**: **8,500+⭐** | **License**: GPL-3.0
     - **技术栈**: Chrome Extension / WebRTC MediaRecorder
     - **核心特性**: 屏幕录制时实时在屏幕上画笔标注、局部放大、摄像头画中画圆形浮窗。
  3. **screen-recorder-js** (`kasp1/screen-recorder-js`)
     - **Star 数**: 300+⭐ | **License**: MIT
     - **技术栈**: 原生 MediaRecorder API 极简封装
     - **核心特性**: 仅 3KB 体积，开箱即用，无任何构建打包负担。
- **与本项目当前实现对比**:
  - **当前实现**: 采用原生 `MediaRecorder`，内置 720p/1080p/4K 与 30fps/60fps 分辨率选择，提供倒计时与本地直接下载。
  - **开源资产化建议**: **维持当前原生轻量实现**。后续若需要跨浏览器多音轨混合（同时捕获系统声音和麦克风输入并合并为单声道），可直接参考 `RecordRTC` 的 `MultiStreamRecorder` 混音算法。

---

### 3. 在线波形录音机与音频剪辑 (`/voice-recorder`)

- **功能定位**: 麦克风高清拾音、Canvas 实时动态波形与频谱渲染、时间轴选区拖拽裁切、WAV/MP3 本地导出。
- **GitHub 顶级开源项目盘点**:
  1. **wavesurfer.js** (`katspaugh/wavesurfer.js`)
     - **Star 数**: **10,391⭐** | **License**: BSD-3-Clause
     - **技术栈**: HTML5 Canvas / Web Audio API (TypeScript)
     - **核心特性**: 全球最顶级的开源音频波形可视化库，插件生态极其丰富（支持 `RecordPlugin` 实时录制、`RegionsPlugin` 选区高亮裁切、`TimelinePlugin` 毫米级时间轴刻度、`SpectrogramPlugin` 频谱图）。
  2. **audio-recorder-polyfill** (`ai/audio-recorder-polyfill`)
     - **Star 数**: **1,500+⭐** | **License**: MIT
     - **技术栈**: Pure JS / Web Audio API
     - **核心特性**: 为不支持原生 MediaRecorder 的 Safari / WebKit 浏览器提供无缝 Polyfill，纯前端高效编码标准 WAV 格式。
- **与本项目当前实现对比**:
  - **当前实现**: 本项目采用自研 Canvas 绘制时域振幅与频域 FFT 柱状图，纯原生轻量无依赖。
  - **开源资产化建议**: **建议后续将 `wavesurfer.js` 单文件 UMD 包作为专业音频处理核心库引入**。其选区裁切插件可直接提供专业级拖拽手柄、多段剪辑与波形放大预览。

---

### 4. 极简电子节拍器与乐器调音器 (`/metronome-tuner`)

- **功能定位**: 高精度 30~280 BPM 节拍器、多种拍号重音区分与敲击定速 (Tap Tempo)；麦克风实时 FFT 基准音高与 Cent 音分检测（吉他/尤克里里标准调音）。
- **GitHub 顶级开源项目盘点**:
  1. **pitchfinder** (`peterkhayes/pitchfinder`)
     - **Star 数**: **504⭐** | **License**: MIT
     - **技术栈**: JavaScript 纯数学算法 (YIN, AMDF, Dynamic Wavelet, McLeod)
     - **核心特性**: 专业级基频提取算法库，可在极低延迟下精准识别乐器音高与人声基准频率 (Hz)，抗背景噪声干扰能力强。
  2. **web-audio-metronome** (`cwilso/metronome`)
     - **Star 数**: **800+⭐** | **License**: MIT (W3C Audio 工作组联合主席官方范例)
     - **技术栈**: Web Audio Lookahead 调度算法
     - **核心特性**: 彻底解决 `setInterval` 在浏览器后台休眠掉帧导致节拍不准的痛点，通过 Web Audio 硬件时钟实现毫秒级精准对拍。
  3. **guitar-tuner** (`antimatter15/guitar-tuner` / `lillyand/guitar-tuner`)
     - **Star 数**: 400+⭐ | **License**: MIT
     - **技术栈**: HTML5 Audio / Canvas 指针仪表盘
     - **核心特性**: 标准 6 弦吉他调音界面、实时音分 (-50 ~ +50 Cent) 偏离度平滑动画。
- **与本项目当前实现对比**:
  - **当前实现**: 已完整融合 Lookahead 节拍调度与自相关 (Autocorrelation) 测频算法，功能与视觉体验完善。
  - **开源资产化建议**: **保留当前轻量纯前端实现**；如需增强人声伴奏提取或超低频乐器（如贝斯）调音，可将 `pitchfinder` 的 YIN 算法模块作为辅助解析引擎。
