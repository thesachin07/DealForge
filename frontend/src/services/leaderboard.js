const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

export async function loadLeaderboard() {
  try {
    const response = await fetch(`${API_BASE}/leaderboard`);
    if (!response.ok) {
      throw new Error('Failed to load leaderboard');
    }
    const scores = await response.json();
    return scores;
  } catch (error) {
    console.error('Error loading leaderboard:', error);
    // Fallback to local storage if API fails
    try {
      const result = await window.storage.get("negotiation_leaderboard", true);
      return result ? JSON.parse(result.value) : [];
    } catch {
      return [];
    }
  }
}

export async function saveToLeaderboard(entry) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE}/leaderboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      throw new Error('Failed to save score');
    }

    const updatedLeaderboard = await response.json();
    return updatedLeaderboard;
  } catch (error) {
    console.error('Error saving to leaderboard:', error);
    
    try {
      let board = await loadLeaderboard();
      if (Array.isArray(board)) {
        board.push(entry);
        board.sort((a, b) => a.price - b.price);
        board = board.slice(0, 50);
        await window.storage.set("negotiation_leaderboard", JSON.stringify(board), true);
        return board;
      }
    } catch {
        console.error('Error saving to local storage:', error);
    }
    throw error;
  }
}

export async function loadUserScores() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return [];
    }

    const response = await fetch(`${API_BASE}/leaderboard/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to load user scores');
    }

    const scores = await response.json();
    return scores;
  } catch (error) {
    console.error('Error loading user scores:', error);
    return [];
  }
}
