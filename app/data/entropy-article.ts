export const entropyArticle = {
  title: 'Comprendre l’entropie des mots de passe',
  description: 'Ce que mesure l’entropie, comment elle se calcule, et pourquoi une passphrase reste souvent plus réaliste qu’un mot de passe illisible.',
  publishedAt: '2024-11-03',
  author: 'Alexandre Monchain',
  heroImage: '/images/blog-entropie.webp',
  formula: 'Entropie = longueur × log2(taille de l’ensemble de caractères)',
  sections: [
    {
      title: 'À quoi sert l’entropie ?',
      paragraphs: [
        'L’entropie estime à quel point un mot de passe est difficile à deviner. Plus elle est haute, plus l’espace de recherche à parcourir pour un attaquant devient grand.',
        'Sur Passphrase, cet indicateur aide à comparer plusieurs variantes d’une même idée de mot de passe sans perdre en mémorisation.'
      ]
    },
    {
      title: 'Comment la mesurer',
      paragraphs: [
        'Le calcul combine deux éléments : la longueur totale et la taille du jeu de caractères réellement mobilisé.',
        'Ajouter des chiffres, des séparateurs, des majuscules et des caractères accentués augmente généralement l’espace de recherche. Allonger la phrase reste souvent le levier le plus rentable.'
      ]
    },
    {
      title: 'Pourquoi une passphrase est utile',
      paragraphs: [
        'Un mot de passe totalement aléatoire peut atteindre une entropie très élevée, mais il devient rarement agréable à saisir ou à retenir.',
        'Une passphrase combine plusieurs mots, parfois un séparateur, quelques chiffres et un symbole final. Le résultat reste plus mémorisable tout en gardant une bonne résistance théorique.'
      ]
    },
    {
      title: 'Attention aux habitudes de génération',
      paragraphs: [
        'Répéter toujours le même schéma réduit l’intérêt du générateur. Deux mots, le même séparateur et toujours trois chiffres à la fin forment un motif prévisible.',
        'Faites varier les options d’une utilisation à l’autre, surtout pour les comptes importants.'
      ]
    }
  ],
  examples: [
    {
      label: 'Mot de passe très aléatoire',
      password: '9$g3c55r@D}TF%n6Ge{P',
      notes: [
        'Longueur : 20 caractères',
        'Jeu de caractères maximal, peu réaliste à mémoriser au quotidien',
        'Entropie théorique : environ 131 bits'
      ]
    },
    {
      label: 'Passphrase générée',
      password: 'Mélodie/Déboussoler18*',
      notes: [
        'Longueur : 22 caractères',
        'Combinaison de mots mémorisables, séparateur, chiffres et symbole',
        'Entropie théorique : environ 142 bits'
      ]
    }
  ],
  recommendations: {
    companies: [
      {
        name: 'KeePass',
        description: 'Solide et gratuit, pertinent quand un coffre local convient aux contraintes internes.'
      },
      {
        name: 'LockPass',
        description: 'Approche plus simple à déployer en entreprise, avec une ergonomie plus guidée.'
      },
      {
        name: 'Passbolt',
        description: 'Alternative orientée collaboration, à évaluer selon vos exigences de conformité et d’hébergement.'
      }
    ],
    individuals: [
      {
        name: 'Bitwarden',
        description: 'Très bon point d’entrée pour centraliser des mots de passe forts sur plusieurs appareils.'
      },
      {
        name: 'Proton Pass',
        description: 'Option moderne et cohérente pour celles et ceux déjà dans l’écosystème Proton.'
      },
      {
        name: 'KeePass',
        description: 'Toujours valable hors cloud, mais moins accessible pour un usage très occasionnel.'
      }
    ]
  }
} as const
