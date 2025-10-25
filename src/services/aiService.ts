// services/aiService.ts

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

class AIService {
  private formations = [
    {
      id: 1,
      nom: "Intelligence Artificielle",
      duree: "120h (3 mois)",
      prix: "2999€",
      description: "Maîtrisez le Machine Learning, Deep Learning et les réseaux de neurones",
      prerequis: "Bases en programmation Python, mathématiques niveau bac+2",
      competences: [
        "Machine Learning - Apprentissage supervisé et non supervisé",
        "Deep Learning - Réseaux de neurones convolutifs et récurrents", 
        "Computer Vision - Traitement et analyse d'images",
        "NLP - Traitement du langage naturel et chatbots",
        "Data Science - Analyse et visualisation de données",
        "TensorFlow & PyTorch - Frameworks de deep learning"
      ],
      niveau: "Intermédiaire"
    },
    {
      id: 2,
      nom: "IoT (Internet des Objets)",
      duree: "100h (2.5 mois)", 
      prix: "2499€",
      description: "Découvrez l'Internet des Objets, l'électronique et la programmation embarquée",
      prerequis: "Bases en électronique ou programmation",
      competences: [
        "Capteurs & Actionneurs - Types et implémentations",
        "Connectivité - WiFi, Bluetooth, LoRa, 5G",
        "Cloud IoT - Plateformes AWS IoT et Azure IoT", 
        "Sécurité - Cryptographie et authentification",
        "Protocoles - MQTT, CoAP, HTTP pour IoT",
        "Edge Computing - Traitement en temps réel"
      ],
      niveau: "Débutant"
    },
    {
      id: 3, 
      nom: "Automates Industriels",
      duree: "80h (2 mois)",
      prix: "1999€",
      description: "Maîtrisez la programmation d'automates industriels et les systèmes de contrôle-commande",
      prerequis: "Bases en électricité ou automatisme",
      competences: [
        "PLC Programming - Langage Ladder et Structured Text",
        "SCADA - Supervision et contrôle industriel", 
        "Industrial Networks - Profibus, Profinet, Ethernet/IP",
        "Maintenance 4.0 - Diagnostic prédictif",
        "Robotique Industrielle - Programmation de robots",
        "Sécurité Industrielle - Normes et certifications"
      ],
      niveau: "Intermédiaire"
    }
  ];

  async chatWithAI(userMessage: string, conversationHistory: ConversationMessage[] = []): Promise<string> {
    // Simulation d'un délai de traitement naturel
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    const message = userMessage.toLowerCase().trim();

    // Réponses contextuelles intelligentes
    if (this.containsAny(message, ['bonjour', 'salut', 'hello', 'coucou', 'hey'])) {
      return "👋 Bonjour ! Je suis votre assistant Smart Academy. Je peux vous renseigner sur nos formations en **Intelligence Artificielle, IoT et Automates Industriels**, les tarifs, inscriptions et bien plus ! Comment puis-je vous aider aujourd'hui ?";
    }

    if (this.containsAny(message, ['merci', 'remercie', 'parfait', 'super', 'génial'])) {
      return "Je vous en prie ! 😊 N'hésitez pas si vous avez d'autres questions. Souhaitez-vous des informations sur une formation spécifique ?";
    }

    if (this.containsAny(message, ['formation', 'cours', 'apprendre', 'étudier', 'programme'])) {
      return this.getFormationsResponse(message);
    }

    if (this.containsAny(message, ['prix', 'tarif', 'coût', 'combien', '€', 'euro'])) {
      return this.getPricingResponse(message);
    }

    if (this.containsAny(message, ['inscrire', 'inscription', 'admission', 'candidature', 'postuler'])) {
      return this.getInscriptionResponse();
    }

    if (this.containsAny(message, ['prérequis', 'niveau', 'expérience', 'compétence', 'connaissance'])) {
      return this.getPrerequisitesResponse(message);
    }

    if (this.containsAny(message, ['durée', 'temps', 'longtemps', 'mois', 'heures'])) {
      return this.getDurationResponse();
    }

    if (this.containsAny(message, ['ia', 'intelligence artificielle', 'machine learning', 'deep learning', 'ai'])) {
      return this.getFormationDetail('Intelligence Artificielle');
    }

    if (this.containsAny(message, ['iot', 'internet des objets', 'embarqué', 'arduino', 'raspberry', 'capteur'])) {
      return this.getFormationDetail('IoT (Internet des Objets)');
    }

    if (this.containsAny(message, ['automate', 'automates', 'industriel', 'plc', 'scada', 'robotique', 'industrie'])) {
      return this.getFormationDetail('Automates Industriels');
    }

    if (this.containsAny(message, ['support', 'contact', 'horaire', 'joindre', 'téléphone', 'email', 'mail'])) {
      return this.getContactResponse();
    }

    if (this.containsAny(message, ['au revoir', 'bye', 'à bientôt', 'fin', 'stop'])) {
      return "Au revoir ! 👋 N'hésitez pas à revenir si vous avez d'autres questions. Bonne journée !";
    }

    // Réponse par défaut
    return `Je comprends que vous souhaitez des informations concernant "${userMessage}". 
    
Pour une réponse précise et personnalisée, je vous invite à :
• Consulter nos formations en **IA, IoT ou Automates Industriels**
• Nous contacter au 📞 +216 XX XXX XXX  
• Nous envoyer un email à 📧 borsaliaya1@gmail.com

Notre équipe sera ravie de vous accompagner dans votre projet de formation ! 🚀`;
  }

  private containsAny(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword));
  }

  private getFormationsResponse(message: string): string {
    if (this.containsAny(message, ['toutes', 'liste', 'quoi', 'disponible', 'proposez'])) {
      let response = "🎯 **Nos formations disponibles :**\n\n";
      this.formations.forEach(formation => {
        response += `• **${formation.nom}** (${formation.duree}) - ${formation.prix}\n`;
        response += `  ${formation.description}\n`;
        response += `  📊 Niveau : ${formation.niveau}\n\n`;
      });
      response += "💡 *Dites-moi simplement 'IA', 'IoT' ou 'Automates' pour plus de détails sur une formation spécifique !*";
      return response;
    }
    
    // Si une formation spécifique est mentionnée
    for (const formation of this.formations) {
      if (message.includes(formation.nom.toLowerCase()) || 
          (formation.nom === 'Intelligence Artificielle' && this.containsAny(message, ['ia', 'ai'])) ||
          (formation.nom === 'IoT (Internet des Objets)' && this.containsAny(message, ['iot'])) ||
          (formation.nom === 'Automates Industriels' && this.containsAny(message, ['automate']))) {
        return this.getFormationDetail(formation.nom);
      }
    }
    
    return "Nous proposons des formations en **Intelligence Artificielle (IA), IoT (Internet des Objets) et Automates Industriels**. \n\nQuel domaine vous intéresse le plus ? Dites-moi simplement 'IA', 'IoT' ou 'Automates' 😊";
  }

  private getFormationDetail(formationName: string): string {
    const formation = this.formations.find(f => f.nom === formationName);
    if (!formation) return "Formation non trouvée.";

    return `📚 **${formation.nom}**\n
⏱️ **Durée :** ${formation.duree}
💰 **Prix :** ${formation.prix} (paiement échelonné disponible)
🎯 **Niveau :** ${formation.niveau}
📝 **Description :** ${formation.description}
📋 **Prérequis :** ${formation.prerequis}

🔧 **Compétences acquises :**
${formation.competences.map(comp => `• ${comp}`).join('\n')}

✨ **Cette formation inclut :**
• Projets pratiques et cas réels
• Support individualisé  
• Certificat de fin de formation
• Accès à la communauté des alumni

💬 *Intéressé(e) par cette formation ? Je peux vous donner les informations pour vous inscrire !*`;
  }

  private getPricingResponse(message: string): string {
    let response = "💰 **Nos tarifs :**\n\n";
    this.formations.forEach(formation => {
      response += `• ${formation.nom} : ${formation.prix}\n`;
    });
    
    response += `\n💳 **Options de paiement :**
• Paiement en 3, 6 ou 10 fois sans frais
• Financement Pôle Emploi possible  
• Réduction early-bird de 10% pour inscriptions anticipées
• Tarifs spéciaux pour étudiants et demandeurs d'emploi

📞 *Contactez-nous pour un devis personnalisé et des conditions adaptées !*`;
    
    return response;
  }

  private getInscriptionResponse(): string {
    return `📝 **Processus d'inscription :**\n\n
1. **Choisissez votre formation** (IA, IoT ou Automates)
2. **Remplissez le formulaire** d'inscription en ligne  
3. **Entretien personnalisé** avec notre équipe pédagogique
4. **Finalisation administrative** et début de formation !

🕐 **Délai :** Inscription possible jusqu'à 15 jours avant le début de session

📞 **Pour vous inscrire :**
Téléphone : +216 XX XXX XXX
Email : borsaliaya1@gmail.com
Site : www.smart-academy.com

🎯 *Nous vous accompagnons à chaque étape !*`;
  }

  private getPrerequisitesResponse(message: string): string {
    // Si une formation spécifique est demandée
    for (const formation of this.formations) {
      if (message.includes(formation.nom.toLowerCase()) || 
          (formation.nom === 'Intelligence Artificielle' && this.containsAny(message, ['ia', 'ai'])) ||
          (formation.nom === 'IoT (Internet des Objets)' && this.containsAny(message, ['iot'])) ||
          (formation.nom === 'Automates Industriels' && this.containsAny(message, ['automate']))) {
        return `📋 **Prérequis pour la formation ${formation.nom} :**\n\n${formation.prerequis}\n\n💡 *Des tests de niveau et des modules de mise à niveau sont disponibles si nécessaire.*`;
      }
    }
    
    return `🎓 **Prérequis généraux :**\n\n
• **Motivation et assiduité** sont essentielles
• **Ordinateur portable** personnel requis  
• **Bases en informatique** recommandées
• **Niveau d'étude** : Bac minimum (sauf exceptions)

🔍 *Pour les prérequis spécifiques d'une formation, dites-moi 'IA', 'IoT' ou 'Automates'*`;
  }

  private getDurationResponse(): string {
    let response = "⏱️ **Durées des formations :**\n\n";
    this.formations.forEach(formation => {
      response += `• ${formation.nom} : ${formation.duree}\n`;
    });
    
    response += `\n📅 **Modalités :**
• Cours en présentiel ou à distance
• Horaires flexibles (jour/soir/week-end)  
• Projets pratiques inclus
• Support continu même après la formation

🕐 *Des formats intensifs sont également disponibles !*`;
    
    return response;
  }

  private getContactResponse(): string {
    return `📞 **Contactez-nous !**\n\n
**Téléphone :** +216 XX XXX XXX
**Email :** borsaliaya1@gmail.com  
**Site web :** www.smart-academy.com

🕐 **Horaires d'ouverture :**
Lundi - Vendredi : 9h00 - 18h00
Samedi : 9h00 - 13h00

📍 **Adresse :**
Smart Academy
[Votre adresse ici]
Tunisie

💬 **Support :**
Réponse sous 24h maximum
Accompagnement personnalisé  
Visites sur rendez-vous

🚀 *Nous sommes impatients de vous accompagner dans votre projet !*`;
  }

  async searchFormations(query: string): Promise<string> {
    return this.getFormationsResponse(query);
  }
}

export const aiService = new AIService();