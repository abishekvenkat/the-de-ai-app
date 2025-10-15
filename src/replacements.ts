type CapitalizationStyle = 'lowercase' | 'capitalized' | 'titlecase' | 'uppercase';

interface ReplacementRule {
  pattern: RegExp;
  replace: (match: string) => string;
}

function detectCapitalizationStyle(text: string): CapitalizationStyle {
  if (text === text.toUpperCase() && text !== text.toLowerCase()) {
    return 'uppercase';
  }

  const words = text.split(/\s+/);
  const capitalizedWords = words.filter(w => w.length > 0 && w[0] === w[0].toUpperCase());

  if (capitalizedWords.length === words.length && words.length > 1) {
    return 'titlecase';
  }

  if (text[0] === text[0].toUpperCase() && text.slice(1) === text.slice(1).toLowerCase()) {
    return 'capitalized';
  }

  return 'lowercase';
}

function applyCapitalizationStyle(text: string, style: CapitalizationStyle): string {
  switch (style) {
    case 'uppercase':
      return text.toUpperCase();
    case 'titlecase':
      return text.split(/\s+/).map(w =>
        w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
      ).join(' ');
    case 'capitalized':
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case 'lowercase':
    default:
      return text.toLowerCase();
  }
}

const inflectionMap: Record<string, Record<string, string>> = {
  'underscore': {
    'underscores': 'highlights',
    'underscored': 'highlighted',
    'underscoring': 'highlighting',
  },
  'facilitate': {
    'facilitate': 'enable',
    'facilitates': 'enables',
    'facilitated': 'enabled',
    'facilitating': 'enabling',
  },
  'bolster': {
    'bolster': 'support',
    'bolsters': 'supports',
    'bolstered': 'supported',
    'bolstering': 'supporting',
  },
  'streamline': {
    'streamline': 'simplify',
    'streamlines': 'simplifies',
    'streamlined': 'simplified',
    'streamlining': 'simplifying',
  },
  'revolutionize': {
    'revolutionize': 'transform',
    'revolutionizes': 'transforms',
    'revolutionized': 'transformed',
    'revolutionizing': 'transforming',
  },
  'harness': {
    'harness': 'use',
    'harnesses': 'uses',
    'harnessed': 'used',
    'harnessing': 'using',
  },
  'illuminate': {
    'illuminate': 'explain',
    'illuminates': 'explains',
    'illuminated': 'explained',
    'illuminating': 'explaining',
  },
};

export const replacementRules: ReplacementRule[] = [
  {
    pattern: /—/g,
    replace: (match) => ' - ',
  },

  {
    pattern: /\bdelve\s+into\b/gi,
    replace: (match) => {
      const style = detectCapitalizationStyle(match);
      return applyCapitalizationStyle('explore', style);
    },
  },

  {
    pattern: /\bdelve\b/gi,
    replace: (match) => {
      const style = detectCapitalizationStyle(match);
      return applyCapitalizationStyle('dive deep', style);
    },
  },

  {
    pattern: /\bat\s+its\s+core\b/gi,
    replace: (match) => {
      const style = detectCapitalizationStyle(match);
      if (style === 'capitalized' || style === 'titlecase') {
        return applyCapitalizationStyle('fundamentally', style);
      }
      return applyCapitalizationStyle('as its backbone', style);
    },
  },

  {
    pattern: /\bto\s+put\s+it\s+simply\b/gi,
    replace: (match) => {
      const style = detectCapitalizationStyle(match);
      return applyCapitalizationStyle('in simpler terms', style);
    },
  },

  {
    pattern: /\bthat\s+being\s+said\b/gi,
    replace: (match) => {
      const style = detectCapitalizationStyle(match);
      return applyCapitalizationStyle('however', style);
    },
  },

  {
    pattern: /\ba\s+key\s+takeaway\s+is\b/gi,
    replace: (match) => {
      const style = detectCapitalizationStyle(match);
      return applyCapitalizationStyle('one important lesson is', style);
    },
  },

  {
    pattern: /\bfrom\s+a\s+broader\s+perspective\b/gi,
    replace: (match) => {
      const style = detectCapitalizationStyle(match);
      return applyCapitalizationStyle('on a larger scale', style);
    },
  },

  {
    pattern: /\bgenerally\s+speaking\b/gi,
    replace: (match) => {
      const style = detectCapitalizationStyle(match);
      return applyCapitalizationStyle('in most cases', style);
    },
  },

  {
    pattern: /\bbroadly\s+speaking\b/gi,
    replace: (match) => {
      const style = detectCapitalizationStyle(match);
      return applyCapitalizationStyle('in a general sense', style);
    },
  },

  {
    pattern: /\bseamless\s+integration\b/gi,
    replace: (match) => {
      const style = detectCapitalizationStyle(match);
      return applyCapitalizationStyle('smooth compatibility', style);
    },
  },

  {
    pattern: /\b(underscore[sd]?|underscoring)\b/gi,
    replace: (match) => {
      const lowerMatch = match.toLowerCase();
      const style = detectCapitalizationStyle(match);
      const replacement = inflectionMap['underscore'][lowerMatch] || 'highlights';
      return applyCapitalizationStyle(replacement, style);
    },
  },

  {
    pattern: /\b(facilitate[sd]?|facilitating)\b/gi,
    replace: (match) => {
      const lowerMatch = match.toLowerCase();
      const style = detectCapitalizationStyle(match);
      const replacement = inflectionMap['facilitate'][lowerMatch] || 'enable';
      return applyCapitalizationStyle(replacement, style);
    },
  },

  {
    pattern: /\b(bolster[sd]?|bolstering)\b/gi,
    replace: (match) => {
      const lowerMatch = match.toLowerCase();
      const style = detectCapitalizationStyle(match);
      const replacement = inflectionMap['bolster'][lowerMatch] || 'support';
      return applyCapitalizationStyle(replacement, style);
    },
  },

  {
    pattern: /\b(streamline[sd]?|streamlining)\b/gi,
    replace: (match) => {
      const lowerMatch = match.toLowerCase();
      const style = detectCapitalizationStyle(match);
      const replacement = inflectionMap['streamline'][lowerMatch] || 'simplify';
      return applyCapitalizationStyle(replacement, style);
    },
  },

  {
    pattern: /\b(revolutionize[sd]?|revolutionizing)\b/gi,
    replace: (match) => {
      const lowerMatch = match.toLowerCase();
      const style = detectCapitalizationStyle(match);
      const replacement = inflectionMap['revolutionize'][lowerMatch] || 'transform';
      return applyCapitalizationStyle(replacement, style);
    },
  },

  {
    pattern: /\b(harness(?:es)?|harnessed|harnessing)\b/gi,
    replace: (match) => {
      const lowerMatch = match.toLowerCase();
      const style = detectCapitalizationStyle(match);
      const replacement = inflectionMap['harness'][lowerMatch] || 'use';
      return applyCapitalizationStyle(replacement, style);
    },
  },

  {
    pattern: /\b(illuminate[sd]?|illuminating)\b/gi,
    replace: (match) => {
      const lowerMatch = match.toLowerCase();
      const style = detectCapitalizationStyle(match);
      const replacement = inflectionMap['illuminate'][lowerMatch] || 'explain';
      return applyCapitalizationStyle(replacement, style);
    },
  },

  {
    pattern: /\btypically\b/gi,
    replace: (match) => {
      const style = detectCapitalizationStyle(match);
      return applyCapitalizationStyle('usually', style);
    },
  },

  {
    pattern: /\btends\s+to\b/gi,
    replace: (match) => {
      const style = detectCapitalizationStyle(match);
      return applyCapitalizationStyle('is often', style);
    },
  },

  {
    pattern: /\bcutting-edge\b/gi,
    replace: (match) => {
      const style = detectCapitalizationStyle(match);
      return applyCapitalizationStyle('advanced', style);
    },
  },

  {
    pattern: /\bgame-changing\b/gi,
    replace: (match) => {
      const style = detectCapitalizationStyle(match);
      return applyCapitalizationStyle('significant', style);
    },
  },

  {
    pattern: /\btransformative\b/gi,
    replace: (match) => {
      const style = detectCapitalizationStyle(match);
      return applyCapitalizationStyle('impactful', style);
    },
  },

  {
    pattern: /\brealm\b/gi,
    replace: (match) => {
      const style = detectCapitalizationStyle(match);
      return applyCapitalizationStyle('area', style);
    },
  },
];

export function applyReplacements(text: string): string {
  let result = text;

  for (const rule of replacementRules) {
    result = result.replace(rule.pattern, rule.replace);
  }

  result = result.replace(/\s+-\s+/g, (match, offset) => {
    if (offset > 0 && result[offset - 1] !== ' ') {
      return ' - ';
    }
    return match;
  });

  result = result.replace(/\s{2,}/g, ' ');

  return result;
}
