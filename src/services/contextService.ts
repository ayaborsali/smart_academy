// Service pour charger et gérer le contexte de l'application
export class ContextService {
  constructor() {
    this.context = '';
    this.isLoaded = false;
  }

  // Charger le contexte depuis le fichier MD
  async loadContext() {
    try {
      // Si vous avez un fichier MD dans le projet
      const response = await fetch('/context.md');
      if (response.ok) {
        this.context = await response.text();
      } else {
        // Fallback : contexte par défaut
        this.context = this.getDefaultContext();
      }
      this.isLoaded = true;
      console.log('✅ Contexte chargé avec succès');
    } catch (error) {
      console.error('❌ Erreur chargement contexte:', error);
      this.context = this.getDefaultContext();
      this.isLoaded = true;
    }
  }

  getDefaultContext() {
    return `
# SMART ACADEMY - Contexte de l'Application

## 📚 Formations Disponibles

### Intelligence Artificielle (IA)
- **Durée** : 120 heures
- **Niveau** : Intermédiaire  
- **Prix** : 2 999 €
- **Description** : Formation complète en Machine Learning, Deep Learning, Computer Vision et NLP
- **Compétences** : Python, TensorFlow, PyTorch, Data Science

### Internet des Objets (IoT)
- **Durée** : 100 heures
- **Niveau** : Débutant
- **Prix** : 2 499 €
- **Description** : Maîtrise des technologies IoT, capteurs, connectivité et cloud
- **Compétences** : Arduino, Raspberry Pi, MQTT, Cloud IoT

### Automatisation Industrielle
- **Durée** : 80 heures
- **Niveau** : Intermédiaire
- **Prix** : 1 999 €
- **Description** : Programmation d'automates, systèmes SCADA et réseaux industriels
- **Compétences** : PLC, Ladder, Profibus, Maintenance 4.0

## 🎯 Packs de Formation

### Pack Basique (Gratuit)
- Accès aux cours en ligne
- Support de cours PDF
- Exercices pratiques
- Certificat de participation

### Pack Standard (+500€)
- Tout le Pack Basique
- Support tutoriel par email
- Projets pratiques guidés
- Accès à la communauté
- Certificat de réussite

### Pack Premium (+1000€)
- Tout le Pack Standard  
- Mentorat individuel (5 sessions)
- Sessions de coaching
- Accès prioritaire au support
- Certificat premium
- Aide à la recherche d'emploi

## 💰 Tarifs et Paiements

### Formation seule
- IA : 2 999 €
- IoT : 2 499 €
- Automatisation : 1 999 €

### Formation + Pack
- Standard : +500€ au prix de base
- Premium : +1000€ au prix de base

### Modalités de paiement
- Carte bancaire
- Virement bancaire
- Paiement en 3 fois sans frais
- Paiement sur place

## 📋 Processus d'Inscription

1. **Sélection** : Choisir la formation et le pack
2. **Formulaire** : Remplir les informations personnelles
3. **Paiement** : Choisir le mode de paiement
4. **Confirmation** : Recevoir email de confirmation
5. **Accès** : Obtenir accès à la plateforme sous 48h

## 📞 Contact et Support

### Coordonnées
- **Email** : borsaliaya1@gmail.com
- **Téléphone** : +216 XX XXX XXX
- **Adresse** : Tunis, Tunisie
- **Site web** : http://localhost:5173

### Horaires de support
- Lundi - Vendredi : 9h00 - 18h00
- Samedi : 9h00 - 13h00
- Support email : Réponse sous 24h

## 🚀 Fonctionnalités de la Plateforme

### Pour les étudiants
- Cours en ligne avec vidéos
- Exercices pratiques et projets
- Forum de discussion
- Suivi de progression
- Support technique

### Méthodes pédagogiques
- Apprentissage mixte (présentiel + distantiel)
- Études de cas réels
- Projets pratiques
- Évaluations continues

## ❓ FAQ Courante

### Questions sur les formations
- **Prérequis** : Aucun pour IoT, bases en programmation pour IA
- **Matériel nécessaire** : Ordinateur avec connexion internet
- **Durée d'accès** : Accès à vie aux contenus
- **Certification** : Certificat reconnu

### Questions administratives
- **Annulation** : Possible sous 14 jours
- **Remboursement** : Selon conditions générales
- **Report** : Possible selon disponibilité

### Questions techniques
- **Plateforme** : Accessible sur tous devices
- **Support** : Assistance technique incluse
- **Communauté** : Groupe d'entraide disponible
    `;
  }

  // Extraire les informations spécifiques du contexte
  extractInformation(category) {
    if (!this.isLoaded) return '';

    const sections = {
      formations: this.extractFormations(),
      packs: this.extractPacks(),
      tarifs: this.extractTarifs(),
      inscription: this.extractInscription(),
      contact: this.extractContact(),
      faq: this.extractFAQ()
    };

    return sections[category] || this.context;
  }

  extractFormations() {
    const formationRegex = /### (.*?)\n- \*\*Durée\*\* : (.*?)\n- \*\*Niveau\*\* : (.*?)\n- \*\*Prix\*\* : (.*?)\n- \*\*Description\*\* : (.*?)\n- \*\*Compétences\*\* : (.*?)(?=\n### |\n## |$)/gs;
    const formations = [];
    let match;

    while ((match = formationRegex.exec(this.context)) !== null) {
      formations.push({
        nom: match[1],
        duree: match[2],
        niveau: match[3],
        prix: match[4],
        description: match[5],
        competences: match[6]
      });
    }

    return formations;
  }

  extractPacks() {
    const packRegex = /### (.*?)\n- (.*?)(?=\n### |\n## |$)/gs;
    const packs = [];
    let match;

    while ((match = packRegex.exec(this.context)) !== null) {
      const features = match[2].split('\n- ').filter(f => f.trim());
      packs.push({
        nom: match[1],
        features: features
      });
    }

    return packs;
  }

  extractTarifs() {
    const tarifRegex = /### Formation seule\n(.*?)(?=\n### |\n## |$)/s;
    const match = tarifRegex.exec(this.context);
    return match ? match[1] : '';
  }

  extractContact() {
    const contactRegex = /### Coordonnées\n(.*?)(?=\n### |\n## |$)/s;
    const match = contactRegex.exec(this.context);
    return match ? match[1] : '';
  }

  // Recherche intelligente dans le contexte
  searchContext(query) {
    const lowerQuery = query.toLowerCase();
    
    // Recherche par mots-clés
    const keywords = {
      formation: ['formation', 'cours', 'apprentissage', 'étude'],
      prix: ['prix', 'tarif', 'coût', 'combien', '€'],
      inscription: ['inscrire', 'inscription', 's\'inscrire', 'admission'],
      contact: ['contact', 'email', 'téléphone', 'adresse', 'appeler'],
      pack: ['pack', 'forfait', 'formule'],
      durée: ['durée', 'temps', 'longtemps', 'heures'],
      niveau: ['niveau', 'difficulté', 'prérequis']
    };

    for (const [category, terms] of Object.entries(keywords)) {
      if (terms.some(term => lowerQuery.includes(term))) {
        return this.extractInformation(category);
      }
    }

    // Recherche textuelle générale
    const lines = this.context.split('\n');
    const relevantLines = lines.filter(line => 
      line.toLowerCase().includes(lowerQuery) && 
      line.trim().length > 10
    );

    return relevantLines.length > 0 ? relevantLines.join('\n') : null;
  }

  getContextSummary() {
    return `
Je suis l'assistant intelligent de Smart Academy. Voici un résumé de ce que je sais :

🏫 **FORMATIONS DISPONIBLES** :
- Intelligence Artificielle (2 999€ - 120h)
- Internet des Objets (2 499€ - 100h) 
- Automatisation Industrielle (1 999€ - 80h)

🎯 **PACKS** :
- Basique (Gratuit) : Cours + Exercices
- Standard (+500€) : Support + Projets
- Premium (+1000€) : Mentorat + Coaching

📞 **CONTACT** :
Email: borsaliaya1@gmail.com
Téléphone: +216 XX XXX XXX

Je peux vous aider avec les inscriptions, les tarifs, les programmes détaillés et toute autre question !
    `;
  }
}

export const contextService = new ContextService();