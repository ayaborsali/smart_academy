// src/services/authService.ts
export interface User {
  email: string;
  name?: string;
  isAuthenticated: boolean;
}

class AuthService {
  // Détecter les emails Windows réels
  async detectWindowsEmails(): Promise<string[]> {
    try {
      const emails: string[] = [];

      // Méthode 1: Via les variables d'environnement Windows
      if (typeof process !== 'undefined' && process.env) {
        const username = process.env.USERNAME || process.env.USER;
        if (username) {
          emails.push(`${username}@outlook.com`);
          emails.push(`${username}@hotmail.com`);
          emails.push(`${username}@gmail.com`);
        }
        
        const userdomain = process.env.USERDOMAIN;
        if (userdomain) {
          emails.push(`${username}@${userdomain}.com`);
        }
      }

      // Méthode 2: Via le navigateur (limité pour des raisons de sécurité)
      if (navigator.credentials && navigator.credentials.get) {
        try {
          const credential = await navigator.credentials.get({
            publicKey: {
              challenge: new Uint8Array(32),
              rpId: window.location.hostname,
              timeout: 60000,
              userVerification: 'required'
            }
          });
          
          if (credential && 'id' in credential) {
            // Utiliser l'identifiant Windows Hello
            emails.push('windows-user@system.com');
          }
        } catch (error) {
          console.log('Windows Hello non disponible');
        }
      }

      // Méthode 3: Email stocké localement
      const lastUsedEmail = localStorage.getItem('lastUsedEmail');
      if (lastUsedEmail) {
        emails.push(lastUsedEmail);
      }

      // Méthode 4: Simulation d'emails basés sur le nom d'utilisateur système
      this.simulateSystemEmails(emails);

      return [...new Set(emails.filter(email => email))];
    } catch (error) {
      console.error('Error detecting Windows emails:', error);
      return this.getFallbackEmails();
    }
  }

  private simulateSystemEmails(emails: string[]): void {
    // Simulation d'emails basés sur des patterns communs
    const commonDomains = [
      'outlook.com', 'hotmail.com', 'gmail.com', 'yahoo.com',
      'live.com', 'msn.com', 'office365.com'
    ];

    // Essayer de deviner l'email basé sur le nom d'utilisateur
    const systemUsername = this.getSystemUsername();
    if (systemUsername) {
      commonDomains.forEach(domain => {
        emails.push(`${systemUsername}@${domain}`);
        emails.push(`${systemUsername.toLowerCase()}@${domain}`);
      });
    }
  }

  private getSystemUsername(): string | null {
    try {
      // Tentative de récupération du nom d'utilisateur Windows
      if (typeof process !== 'undefined' && process.env) {
        return process.env.USERNAME || process.env.USER || null;
      }
      
      // Fallback pour le navigateur
      if (navigator.userAgent.includes('Windows')) {
        const match = navigator.userAgent.match(/Windows NT [0-9.]+; (.*?)(;|$)/);
        if (match && match[1]) {
          return match[1].trim();
        }
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  private getFallbackEmails(): string[] {
    const fallbackEmails = [
      'utilisateur@windows.com',
      'user@system.com',
      localStorage.getItem('lastUsedEmail')
    ].filter(Boolean) as string[];
    
    return [...new Set(fallbackEmails)];
  }

  // Authentifier avec email Windows
  async loginWithWindows(email: string): Promise<User> {
    try {
      // Simulation d'authentification Windows
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user: User = {
        email,
        name: this.extractNameFromEmail(email),
        isAuthenticated: true
      };

      // Sauvegarder dans le localStorage
      localStorage.setItem('windowsUser', JSON.stringify(user));
      localStorage.setItem('lastUsedEmail', email);
      localStorage.setItem('isLoggedIn', 'true');

      return user;
    } catch (error) {
      console.error('Windows login error:', error);
      throw new Error('Échec de l\'authentification Windows');
    }
  }

  private extractNameFromEmail(email: string): string {
    const username = email.split('@')[0];
    return username.charAt(0).toUpperCase() + username.slice(1);
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  // Déconnexion
  logout(): void {
    localStorage.removeItem('windowsUser');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('lastUsedEmail');
  }

  // Récupérer l'utilisateur courant
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('windowsUser');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export const authService = new AuthService();