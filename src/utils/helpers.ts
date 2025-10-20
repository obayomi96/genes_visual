export const getBiotypeColor = (biotype: string): string => {
  const colorMap: { [key: string]: string } = {
    'Protein Coding': '#1890ff',
    'Linc R N A': 'green',
    'Processed Pseudogene': '#3B38A0',
    'Unprocessed Pseudogene': '#E5C95F',
    Antisense: '#B95E82',
    'Misc R N A': '#483AA0',
    'Transcribed Unprocessed Pseudogene': '#BF092F',
    'Transcribed Unitary Pseudogene': '#4C763C',
    'T E C': '#132440',
    'Sense Intronic': '#1C476A',
  };

  return colorMap[biotype] || 'gray';
};

// simple deterministic RNG based on string seed - AI generated
export function seededRandom(seed: string) {
  // xorshift-ish from seed string
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h += (h << 5) + (h << 0);
    h >>>= 0;
  }
  return () => {
    // Robert Jenkins' 32 bit integer hash
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967295;
  };
}

// create simulated expression for a gene: an array of N samples - AI generated
export function simulateExpressionForGene(seed: string, n = 100) {
  const rng = seededRandom(seed);
  // base expression scaled by gene length / 1e3 to vary values somewhat
  const base = 10 + Math.floor(rng() * 50);
  const values = new Array(n).fill(0).map(() => {
    // log-normal-ish: produce a positive-skewed distribution
    const noise = rng() ** 2 * base; // skewed
    return +Math.max(0, base + noise * (rng() - 0.5)).toFixed(3);
  });
  return values;
}
