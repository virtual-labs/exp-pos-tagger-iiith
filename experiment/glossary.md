### Core POS Tagging Terms

**Part-of-Speech (POS) Tagging**: The process of assigning grammatical categories (tags) to each word in a sentence based on its definition and context.

**POS Tag**: A label that indicates the grammatical category of a word (e.g., NOUN, VERB, ADJECTIVE, ADVERB).

**Tagset**: A standardized set of POS tags used in linguistic annotation. Examples include Penn Treebank tagset, Universal POS tags.

**Lexical Ambiguity**: The phenomenon where a single word can have multiple grammatical functions depending on context (e.g., "book" as noun vs. verb).

**Context**: The surrounding words or linguistic environment that helps determine the correct POS tag for an ambiguous word.

**Sequence Labeling**: A machine learning task where labels are assigned to each element in a sequence, which POS tagging exemplifies.

### Grammatical Categories

**Noun (NN)**: A word representing a person, place, thing, or concept. Examples: cat, house, freedom.

**Verb (VB)**: A word expressing an action, occurrence, or state of being. Examples: run, exist, sleep.

**Adjective (JJ)**: A word describing or modifying a noun. Examples: beautiful, tall, red.

**Adverb (RB)**: A word modifying a verb, adjective, or another adverb. Examples: quickly, very, often.

**Pronoun (PRP)**: A word substituting for a noun. Examples: he, she, it, they.

**Determiner (DT)**: A word specifying which entities are being referred to. Examples: the, a, an, this, these.

**Preposition (IN)**: A word showing relationships between other words. Examples: in, on, at, under.

**Conjunction (CC)**: A word connecting words, phrases, or clauses. Examples: and, but, or, while.

**Interjection**: A word expressing emotion or sudden feeling. Examples: oh, wow, alas.

### Algorithm-Specific Terms

**Hidden Markov Model (HMM)**: A probabilistic model that assigns POS tags by considering transition probabilities between tags and emission probabilities of words given tags.

**Conditional Random Field (CRF)**: A discriminative probabilistic model that can incorporate rich features and dependencies for sequence labeling tasks like POS tagging.

**Transition Probability**: In HMM, the probability of moving from one POS tag to another in a sequence.

**Emission Probability**: In HMM, the probability of observing a particular word given a specific POS tag.

**Viterbi Algorithm**: A dynamic programming algorithm used to find the most likely sequence of POS tags given a sentence.

**Feature Function**: In CRF, a function that captures relevant properties of the input (words) and output (tags) for making predictions.

### Context and Features

**Unigram**: Using only the current word as a feature for POS tagging, without considering context.

**Bigram**: Using the current word and one neighboring word/tag as features for POS tagging.

**Trigram**: Using the current word and two neighboring words/tags as features for POS tagging.

**N-gram**: A sequence of n consecutive elements (words or tags) used as features in POS tagging models.

**Contextual Features**: Information about surrounding words, capitalization, word length, prefixes, suffixes used to improve tagging accuracy.

**Out-of-Vocabulary (OOV)**: Words that appear in the test data but were not seen during training, posing challenges for POS taggers.

### Evaluation Terms

**Accuracy**: The percentage of correctly tagged words in a test dataset, the primary evaluation metric for POS tagging.

**Precision**: For a specific POS tag, the proportion of words tagged with that label that are actually correct.

**Recall**: For a specific POS tag, the proportion of words that should have that tag that are correctly identified.

**F1-Score**: The harmonic mean of precision and recall, providing a balanced measure of performance.

**Confusion Matrix**: A table showing which POS tags are confused with others, helping identify systematic errors.

**Cross-Validation**: A method of evaluating model performance by training and testing on different portions of the data.

### Training and Data Terms

**Training Corpus**: A collection of sentences with manually annotated POS tags used to train the tagging model.

**Test Set**: A separate collection of tagged sentences used to evaluate the performance of the trained model.

**Annotation**: The process of manually assigning POS tags to words in a corpus, typically done by linguistic experts.

**Inter-Annotator Agreement**: The degree to which different human annotators assign the same POS tags to the same words.

**Data Sparsity**: The problem that occurs when there isn't enough training data to reliably estimate model parameters.

**Smoothing**: Techniques used to handle unseen word-tag combinations in statistical models.

### Language-Specific Terms

**Morphologically Rich Language**: A language like Hindi that uses extensive inflection to encode grammatical information.

**Agglutinative Language**: A language that forms words by combining many morphemes, affecting POS tagging complexity.

**Code-Switching**: The practice of alternating between languages within a conversation, creating challenges for POS tagging.

**Devanagari Script**: The writing system used for Hindi and other Indian languages.

**Penn Treebank Tagset**: A widely used English POS tagset with detailed grammatical distinctions.

**Universal Dependencies**: A framework for consistent grammatical annotation across languages.

### Technical Implementation Terms

**Beam Search**: An algorithm for finding the best sequence of POS tags by keeping track of the most promising partial solutions.

**Forward-Backward Algorithm**: An algorithm used in HMM training to compute probabilities efficiently.

**Maximum Likelihood Estimation**: A method for estimating model parameters by maximizing the likelihood of the observed training data.

**Regularization**: Techniques to prevent overfitting in machine learning models, important for POS tagging with limited data.

**Feature Engineering**: The process of selecting and designing input features that help the model make better POS tagging decisions.

**Cross-Linguistic Transfer**: Using knowledge from one language to improve POS tagging performance in another language.
