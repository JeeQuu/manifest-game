// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD3IZlrpusRfIa8VgmYMqtt-UepWyTVOy4",
    authDomain: "shy-score.firebaseapp.com",
    databaseURL: "https://shy-score-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "shy-score",
    storageBucket: "shy-score.appspot.com",
    messagingSenderId: "323096951218",
    appId: "1:323096951218:web:27f70f8ec5fa2f05608cab"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Test Firebase connection
firebase.database().ref().child('test').set({
    timestamp: firebase.database.ServerValue.TIMESTAMP
})
.then(() => console.log('Firebase connected successfully'))
.catch(error => console.error('Firebase connection error:', error));

// Score submission function with enhanced error handling
async function submitScore(score, telegramUser) {
    if (!window.database) return null;
    
    try {
        const scoreRef = await window.database.ref('scores').push({
            name: telegramUser?.username || 'Anonymous',
            score: score,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            telegram_id: telegramUser?.id
        });
        
        // After submitting score, share it in the chat
        if (window.telegramIntegration) {
            await window.telegramIntegration.shareScoreWithImage(null); // We'll add image capture later
        }
        
        return scoreRef.key;
    } catch (error) {
        console.error('Error submitting score:', error);
        throw error;
    }
}

// Function to fetch high scores
async function getHighScores(limit = 10) {
    if (!window.database) {
        console.error('Firebase database not initialized');
        return [];
    }

    try {
        const snapshot = await window.database.ref('scores')
            .orderByChild('score')
            .limitToLast(limit)
            .once('value');
        
        const scores = [];
        snapshot.forEach((childSnapshot) => {
            scores.push({
                id: childSnapshot.key,
                ...childSnapshot.val()
            });
        });

        return scores.sort((a, b) => b.score - a.score);
    } catch (error) {
        console.error('Error fetching high scores:', error);
        throw error;
    }
}

// Function to get user's best score
async function getUserBestScore(telegramId) {
    if (!window.database || !telegramId) {
        console.error('Firebase database not initialized or invalid telegram ID');
        return null;
    }

    try {
        const snapshot = await window.database.ref('scores')
            .orderByChild('telegram_id')
            .equalTo(telegramId)
            .once('value');
        
        let bestScore = 0;
        snapshot.forEach((childSnapshot) => {
            const score = childSnapshot.val().score;
            if (score > bestScore) bestScore = score;
        });

        return bestScore;
    } catch (error) {
        console.error('Error fetching user best score:', error);
        throw error;
    }
}

// Export all necessary functions and database instance
window.database = firebase.database();
window.submitScore = submitScore;
window.getHighScores = getHighScores;
window.getUserBestScore = getUserBestScore;
