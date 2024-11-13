document.addEventListener("DOMContentLoaded", function () {
    const tracks = [];
    let currentTrackIndex = 0;

    const audioPlayer = document.getElementById("audio-player");
    const playPauseBtn = document.getElementById("play-pause-btn");

    // Функция для добавления трека
    function addTrack(title, src) {
        tracks.push({ title, src });
    }

    // Добавление треков
    addTrack("AMMO", "audio/ammo.mp3");
    addTrack("Cristoforo Colombo", "audio/CristoforoColombo.mp3");
    addTrack("Трек 3", "audio/ne-very.mp3");

    // Функция для обновления текущего трека
    function loadTrack(index) {
        const track = tracks[index];
        audioPlayer.src = track.src;
    }

    // Функция для воспроизведения и паузы
    function togglePlayPause() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseBtn.textContent = "⏸️";
        } else {
            audioPlayer.pause();
            playPauseBtn.textContent = "▶️";
        }
    }

    // Функция для перехода к следующему треку
    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(currentTrackIndex);
        audioPlayer.play();
        playPauseBtn.textContent = "⏸️";
    }

    // Функция для перехода к предыдущему треку
    function prevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrackIndex);
        audioPlayer.play();
        playPauseBtn.textContent = "⏸️";
    }

    // Инициализация первого трека
    loadTrack(currentTrackIndex);

    // Попытка запустить воспроизведение сразу после загрузки страницы
    audioPlayer.play().then(() => {
        // Если воспроизведение началось, сразу переключаем кнопку на "⏸️"
        playPauseBtn.textContent = "⏸️";
    }).catch(error => {
        // Если браузер блокирует автозапуск, установим обработчик для первого взаимодействия
        console.error("Автовоспроизведение заблокировано браузером:", error);
        document.body.addEventListener("click", () => {
            audioPlayer.play();
            playPauseBtn.textContent = "⏸️";
        }, { once: true }); // Один раз запускаем музыку по первому клику
    });

    // Привязка событий к кнопкам
    playPauseBtn.addEventListener("click", togglePlayPause);
    document.getElementById("next-btn").addEventListener("click", nextTrack);
    document.getElementById("prev-btn").addEventListener("click", prevTrack);

    // Автоматическое переключение на следующий трек по завершению текущего
    audioPlayer.addEventListener("ended", nextTrack);
});
