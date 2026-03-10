export interface User {
  username: string;
  loginTime: string;
  lastActive: string;
}

export interface SessionData {
  currentUser: User | null;
  users: User[];
}

class SessionManager {
  private readonly STORAGE_KEY = 'axl_game_session';
  private readonly MAX_USERS = 5; // Maximum number of users to store

  // Get session data from localStorage
  private getSessionData(): SessionData {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : { currentUser: null, users: [] };
    } catch (error) {
      console.error('Error reading session data:', error);
      return { currentUser: null, users: [] };
    }
  }

  // Save session data to localStorage
  private saveSessionData(data: SessionData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving session data:', error);
    }
  }

  // Login a user
  login(username: string): boolean {
    if (!username.trim()) {
      return false;
    }

    const sessionData = this.getSessionData();
    const now = new Date().toISOString();

    // Check if user already exists
    let existingUser = sessionData.users.find(user => user.username === username.trim());
    
    if (existingUser) {
      // Update existing user's last active time
      existingUser.lastActive = now;
    } else {
      // Create new user
      const newUser: User = {
        username: username.trim(),
        loginTime: now,
        lastActive: now
      };
      
      // Add new user and maintain max users limit
      sessionData.users.unshift(newUser);
      if (sessionData.users.length > this.MAX_USERS) {
        sessionData.users = sessionData.users.slice(0, this.MAX_USERS);
      }
    }

    // Set as current user
    sessionData.currentUser = existingUser || sessionData.users[0];
    this.saveSessionData(sessionData);
    
    return true;
  }

  // Logout current user
  logout(): void {
    const sessionData = this.getSessionData();
    sessionData.currentUser = null;
    this.saveSessionData(sessionData);
  }

  // Get current user
  getCurrentUser(): User | null {
    const sessionData = this.getSessionData();
    return sessionData.currentUser;
  }

  // Get all users
  getUsers(): User[] {
    const sessionData = this.getSessionData();
    return sessionData.users;
  }

  // Delete a user
  deleteUser(username: string): boolean {
    const sessionData = this.getSessionData();
    const userIndex = sessionData.users.findIndex(user => user.username === username);
    
    if (userIndex === -1) {
      return false;
    }

    // Remove user from list
    sessionData.users.splice(userIndex, 1);
    
    // If deleted user was current user, clear current user
    if (sessionData.currentUser?.username === username) {
      sessionData.currentUser = null;
    }
    
    this.saveSessionData(sessionData);
    return true;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Update last active time for current user
  updateLastActive(): void {
    const sessionData = this.getSessionData();
    if (sessionData.currentUser) {
      sessionData.currentUser.lastActive = new Date().toISOString();
      this.saveSessionData(sessionData);
    }
  }

  // Clear all session data
  clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

// Export singleton instance
export const sessionManager = new SessionManager();
