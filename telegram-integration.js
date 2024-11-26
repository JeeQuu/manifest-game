class TelegramIntegration {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.user = this.tg.initDataUnsafe?.user;
        this.init();
    }

    init() {
        // Initialize Telegram Mini App
        this.tg.ready();
        this.tg.expand();

        // Set theme
        document.body.style.backgroundColor = this.tg.backgroundColor;
    }

    getUserInfo() {
        if (!this.user) return null;
        return {
            username: this.user.username || 'Anonymous'
        };
    }

    handleViewportChange() {
        // Adjust game container size if needed
        const container = document.getElementById('game-container');
        if (container) {
            container.style.height = `${this.tg.viewportHeight}px`;
        }
    }

    handleThemeChange() {
        document.body.style.backgroundColor = this.tg.backgroundColor;
        // Add any other theme-related adjustments
    }

    async shareScoreWithImage(imageUrl) {
        const chatId = this.tg.initDataUnsafe?.chat?.id || this.user?.id;
        if (!chatId) return;

        try {
            const score = this.scene?.score || 0;
            const username = this.user?.username || 'Anonymous';
            
            await this.tg.sendData(JSON.stringify({
                action: 'share_score_with_image',
                chat_id: chatId,
                username: username,
                score: score,
                image: imageUrl
            }));
        } catch (err) {
            console.error('Error sharing score with image:', err);
        }
    }

    async shareLeaderboard(scores) {
        const chatId = this.tg.initDataUnsafe?.chat?.id || this.user?.id;
        if (!chatId) return;

        try {
            const leaderboardText = `🏆 *Manifest Cat-astronaut Leaderboard* 🏆\n\n` +
                scores.map((score, index) => 
                    `${index + 1}. ${score.name}: $${score.score.toLocaleString()}`
                ).join('\n') +
                '\n\n🚀 Play now to reach the moon!';

            await this.tg.sendData(JSON.stringify({
                action: 'share_leaderboard',
                chat_id: chatId,
                message: leaderboardText
            }));
        } catch (err) {
            console.error('Error sharing leaderboard:', err);
        }
    }

    async sendMessage(chatId, text) {
        try {
            const response = await fetch(
                'https://api.github.com/repos/JeeQuu/manifest-game/dispatches',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.getGitHubToken()}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        event_type: 'telegram-message',
                        client_payload: {
                            chat_id: chatId,
                            text: text
                        }
                    })
                }
            );
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.statusText}`);
            }
            
            console.log('Message sent successfully');
            return true;
        } catch (error) {
            console.error('Error sending message:', error);
            return false;
        }
    }

    // Helper method to get GitHub token
    getGitHubToken() {
        // This should be set in your GitHub repository secrets and exposed via environment
        return process.env.GITHUB_PAT;
    }
}

window.telegramIntegration = new TelegramIntegration();
