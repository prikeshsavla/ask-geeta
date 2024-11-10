**Table of Contents**

1. [Overview](#overview)
2. [Features](#features)
3. [How it works](#how-it-works)
4. [Requirements](#requirements)
5. [Installation](#installation)
6. [Usage](#usage)
7. [Contributing](#contributing)
8. [License](#license)
9. [Special Thanks](#special-thanks)

**Overview**
------------

Ask Geeta is a LangChain RAG application built on JavaScript, utilizing large language models (LLMs) to answer questions based on the Bhagavad
Geeta. The app accepts user input in the form of questions and provides relevant answers drawn from its knowledge graph.


**Features**
------------

*   Supports multiple question types (e.g., direct quote, paraphrase, analogy)
*   Incorporates various Bhagavad Geeta verses for reference
*   Offers suggestions for further learning resources
*   Designed to learn from user interactions and improve over time

**How it works**
-----------------

1.  User submits a question `yarn run ask-geeta 'Why is Arjun hesitating from war?'`
2.  Application's LLM analyzes the query and generates potential answers based on its knowledge graph of Bhagavad Geeta verses.
3.  App presents user with answer options, allowing them to select or modify the response as needed.

**Requirements**
---------------

*   Node.js 20.x or higher 
*   `Langchain JS/TS` (https://js.langchain.com/)
*   `Ollama`(https://ollama.com/)
*   `llama3.2` for Chat
*   `nomic-embed-text` for embedding
*   Uses LanceDB for Local Vector DB storage
*   Values configurable in .env file look at `.env.example`

**Installation**
--------------

1. Clone repository: `git clone https://github.com/your-username/ask-geeta.git`
2. Install required dependencies:

```bash
yarn install -D
```

**Usage**
--------

To use the app, simply run `yarn run ask-geeta 'Why is Arjun hesitating from war?'` (assuming you've cloned the repo). Follow prompts to submit questions and explore answers.

**Contributing**
--------------

*   Fork this repository: [Your GitHub URL]
*   Create a new branch for your feature/bug fix
*   Commit changes with descriptive messages
*   Send pull request for review

**License**
----------

MIT License


**Special Thanks**
-----------

To Kaggle Dataset: https://www.kaggle.com/datasets/yashnarnaware/bhagavad-gita-versewise
and the source for the data - https://www.holy-bhagavad-gita.org/
