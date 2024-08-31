import Sentiment from 'sentiment';

interface SentimentLexicon {
  [key: string]: number;
}

class CustomSentiment extends Sentiment {
  public defaultLexicon: SentimentLexicon;
  analyzer: any;

  constructor() {
    super();
    this.defaultLexicon = this.analyzer.lexicon;
  }

  addCustomWords(customWords: SentimentLexicon) {
    this.defaultLexicon = { ...this.defaultLexicon, ...customWords };
  }
}

export default CustomSentiment;
