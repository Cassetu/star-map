const AudioManager = {
    bgMusic: null,
    battleMusic: document.getElementById('battle-music'),
    victoryMusic: document.getElementById('victory-music'),
    musicEnabled: false,
    sfxEnabled: true,
    currentMusic: null,
    currentTrackIndex: 0,
    isLooping: true,
    musicTracks: [
        { name: 'Ambient Space 1', url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_4c91a3f6c1.mp3' },
        { name: 'Cosmic Journey', url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3' },
        { name: 'Deep Space', url: 'https://cdn.pixabay.com/audio/2022/03/24/audio_3fb91eb9d4.mp3' },
        { name: 'Stellar Winds', url: 'https://cdn.pixabay.com/audio/2023/08/11/audio_c8a8c7c6c0.mp3' },
        { name: 'Nebula Dreams', url: 'https://cdn.pixabay.com/audio/2022/11/22/audio_bbc8e65321.mp3' },
        { name: 'Galactic Horizon', url: 'https://cdn.pixabay.com/audio/2023/02/13/audio_41b96357c9.mp3' },
        { name: 'Orbital Station', url: 'https://cdn.pixabay.com/audio/2022/08/02/audio_c8f7e1e8a6.mp3' },
        { name: 'Solar Flare', url: 'https://cdn.pixabay.com/audio/2023/05/16/audio_dd23a8d5c8.mp3' },
        { name: 'Asteroid Field', url: 'https://cdn.pixabay.com/audio/2022/09/29/audio_09f55e9f89.mp3' },
        { name: 'Zero Gravity', url: 'https://cdn.pixabay.com/audio/2023/01/09/audio_98f0e0c629.mp3' },
        { name: 'Warp Speed', url: 'https://cdn.pixabay.com/audio/2022/12/06/audio_f1e20a5cb7.mp3' },
        { name: 'Planet Surface', url: 'https://cdn.pixabay.com/audio/2023/03/21/audio_8c61d5e6fb.mp3' },
        { name: 'Lunar Base', url: 'https://cdn.pixabay.com/audio/2022/10/18/audio_2f5c2e5a8d.mp3' },
        { name: 'Supernova', url: 'https://cdn.pixabay.com/audio/2023/04/14/audio_b2e9c4f7a3.mp3' },
        { name: 'Interstellar', url: 'https://cdn.pixabay.com/audio/2022/07/25/audio_c7d8f6e2b1.mp3' }
    ],

    init() {
        this.bgMusic = new Audio(this.musicTracks[0].url);
        this.bgMusic.volume = 0.3;
        this.battleMusic.volume = 0.4;
        this.victoryMusic.volume = 0.35;

        this.bgMusic.addEventListener('ended', () => {
            if (this.isLooping) {
                this.bgMusic.currentTime = 0;
                this.bgMusic.play();
            } else {
                this.nextTrack();
            }
        });

        document.getElementById('music-btn').onclick = () => this.toggleMusicMenu();
        this.createMusicMenu();
    },

    createMusicMenu() {
        const menu = document.createElement('div');
        menu.id = 'music-menu';
        menu.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 300px;
            max-height: 500px;
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid #00ff00;
            border-radius: 10px;
            padding: 15px;
            z-index: 10001;
            display: none;
            overflow-y: auto;
        `;

        menu.innerHTML = `
            <h3 style="color: #00ff00; margin-bottom: 10px; font-size: 14px;">Music Player</h3>
            <div style="margin-bottom: 15px;">
                <button id="music-toggle-btn" style="width: 100%; margin-bottom: 5px;">Enable Music</button>
                <label style="display: flex; align-items: center; gap: 5px; font-size: 12px; cursor: pointer;">
                    <input type="checkbox" id="loop-toggle" checked style="cursor: pointer;">
                    Loop Current Track
                </label>
            </div>
            <div style="margin-bottom: 10px;">
                <div id="current-track" style="font-size: 12px; color: #ffaa00; margin-bottom: 5px;">No track playing</div>
                <div style="display: flex; gap: 5px;">
                    <button id="prev-track-btn" style="flex: 1;">◀</button>
                    <button id="next-track-btn" style="flex: 1;">▶</button>
                </div>
            </div>
            <div id="track-list"></div>
        `;

        document.body.appendChild(menu);

        document.getElementById('music-toggle-btn').onclick = () => this.toggleMusic();
        document.getElementById('loop-toggle').onchange = (e) => this.isLooping = e.target.checked;
        document.getElementById('prev-track-btn').onclick = () => this.prevTrack();
        document.getElementById('next-track-btn').onclick = () => this.nextTrack();

        this.updateTrackList();
    },

    updateTrackList() {
        const trackList = document.getElementById('track-list');
        trackList.innerHTML = '';

        this.musicTracks.forEach((track, index) => {
            const trackBtn = document.createElement('button');
            trackBtn.textContent = track.name;
            trackBtn.style.cssText = `
                width: 100%;
                margin: 3px 0;
                padding: 8px;
                font-size: 11px;
                text-align: left;
                background: ${index === this.currentTrackIndex ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
                border: 1px solid ${index === this.currentTrackIndex ? '#00ff00' : 'rgba(255, 255, 255, 0.3)'};
            `;
            trackBtn.onclick = () => this.selectTrack(index);
            trackList.appendChild(trackBtn);
        });
    },

    toggleMusicMenu() {
        const menu = document.getElementById('music-menu');
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    },

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        const btn = document.getElementById('music-toggle-btn');
        const mainBtn = document.getElementById('music-btn');

        if (this.musicEnabled) {
            this.playBgMusic();
            btn.textContent = 'Disable Music';
            mainBtn.textContent = '🔊';
        } else {
            this.stopAllMusic();
            btn.textContent = 'Enable Music';
            mainBtn.textContent = '🔇';
        }
    },

    selectTrack(index) {
        this.currentTrackIndex = index;
        const track = this.musicTracks[index];

        this.bgMusic.pause();
        this.bgMusic.src = track.url;
        this.bgMusic.currentTime = 0;

        if (this.musicEnabled) {
            this.bgMusic.play().catch(e => console.log('Music blocked'));
            this.currentMusic = this.bgMusic;
        }

        document.getElementById('current-track').textContent = `Now Playing: ${track.name}`;
        this.updateTrackList();
    },

    nextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.musicTracks.length;
        this.selectTrack(this.currentTrackIndex);
    },

    prevTrack() {
        this.currentTrackIndex = (this.currentTrackIndex - 1 + this.musicTracks.length) % this.musicTracks.length;
        this.selectTrack(this.currentTrackIndex);
    },

    playBgMusic() {
        if (!this.musicEnabled) return;
        this.stopAllMusic();
        this.bgMusic.play().catch(e => console.log('Music blocked'));
        this.currentMusic = this.bgMusic;
        const track = this.musicTracks[this.currentTrackIndex];
        document.getElementById('current-track').textContent = `Now Playing: ${track.name}`;
    },

    playBattleMusic() {
        if (!this.musicEnabled) return;
        this.stopAllMusic();
        this.battleMusic.currentTime = 0;
        this.battleMusic.play().catch(e => console.log('Music blocked'));
        this.currentMusic = this.battleMusic;
    },

    playVictoryMusic() {
        this.stopAllMusic();
        this.victoryMusic.currentTime = 0;
        this.victoryMusic.play().catch(e => console.log('Music blocked'));
        this.currentMusic = this.victoryMusic;
    },

    stopAllMusic() {
        this.bgMusic.pause();
        this.battleMusic.pause();
        this.victoryMusic.pause();
    },

    playSFX(sfxId, volume = 0.5) {
        if (!this.sfxEnabled) return;
        const sfx = document.getElementById(sfxId);
        if (sfx) {
            sfx.volume = volume;
            sfx.currentTime = 0;
            sfx.play().catch(e => console.log('SFX blocked'));
        }
    }
};

AudioManager.init();