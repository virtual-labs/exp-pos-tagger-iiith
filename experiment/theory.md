 A Hidden Markov Model (HMM) is a statistical Markov model in which the system being modeled is assumed to be a Markov process with unobserved (hidden) states.In a regular Markov model (Markov Model (Ref: http://en.wikipedia.org/wiki/Markov_model)), the state is directly visible to the observer, and therefore the state transition probabilities are the only parameters. In a hidden Markov model, the state is not directly visible, but output, dependent on the state, is visible.

<img src="images/hmm.jpg">

Hidden Markov Model has two important components-

1)Transition Probabilities: The one-step transition probability is the probability of transitioning from one state to another in a single step.

2)Emission Probabilties: : The output probabilities for an observation from state. Emission probabilities B = { b<sub>i,k</sub> = b<sub>i</sub>(o<sub>k</sub>) = P(o<sub>k</sub> | q<sub>i</sub>) }, where o<sub>k</sub> is an Observation. Informally, B is the probability that the output is o<sub>k</sub> given that the current state is q<sub>i</sub>

For POS tagging, it is assumed that POS are generated as random process, and each process randomly generates a word. Hence, transition matrix denotes the transition probability from one POS to another and emission matrix denotes the probability that a given word can have a particular POS. Word acts as the observations. Some of the basic assumptions are:

```
1. First-order (bigram) Markov assumptions:
   	a. Limited Horizon: Tag depends only on previous tag
		P(t<sub>i+1</sub> = t<sub>k</sub> | t<sub>1</sub>=t<sub>j1</sub>,.....,t<sub>i</sub>=t<sub>ji</sub>) = P(t<sub>i+1</sub> = t<sub>k</sub> | t<sub>i</sub> = t<sub>j</sub>)
	b. Time invariance: No change over time
		P(t<sub>i+1</sub> = t<sub>k</sub> | t<sub>i</sub> = t<sub>j</sub>) = P(t<sub>2</sub> = t<sub>k</sub> | t<sub>1</sub> = t<sub>j</sub>) = P(t<sub>j</sub> -> t<sub>k</sub>)
2. Output probabilities:
   - Probability of getting word wk for tag tj: P(wk | tj) is independent of other tags or words!

```
### Calculating the Probabilities

####  Consider the given toy corpus

```
EOS/eos
                            They/pronoun
                            cut/verb
                            the/determiner
                            paper/noun
                            EOS/eos He/pronoun
                            asked/verb
                            for/preposition
                            his/pronoun
                            cut/noun.
                            EOS/eos
                            Put/verb
                            the/determiner

                            paper/noun
                            in/preposition
                            the/determiner
                            cut/noun
                            EOS/eos

```