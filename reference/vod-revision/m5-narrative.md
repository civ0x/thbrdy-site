This document describes a large, multi-year effort to build semantic representations of Amazon-specific entities such as ASINs, queries, customers, sellers, shopping sessions and beyond, and vend them to machine learning (ML) systems across Amazon. The representations we build will be multi-entity, multi-modal, multi-lingual, multi-locale, and multi-task (M5), and will utilize **all** available data for each entity, preferably using their combination. The key advantage the representations will provide is that they will be label efficient, that is, it will be easy to adapt them to a new task using only a handful of labeled data. Moreover, it will be possible to compress the model generating the representations to a lean and efficient model with a small number of parameters for online deployment with tight latency constraints. Initially, we will focus on a subset of applications from Search, Catalog, and Ads, and eventually expand to all major Amazon services and experiences.

To take advantage of the fact that the Amazon-specific entity types are related, we will use graph-based deep learning to facilitate the exchange of information between their representations. It is the confluence of multiple data sources and their joint use that allows us to build better models for each of the constituents. These representations will be trained using 1000x more data than existing models in Amazon, and will have 1000x more parameters than the largest models in current use at Amazon. They will be updated continuously to include more data, parameters, and tasks. 

If successful, our proposal will fundamentally change the way deep learning (DL) systems are built and deployed inside Amazon. Not only will this bring the varying capabilities of Amazon’s services uniformly beyond the current state-of-the-art (SOTA), but we anticipate that it will also unlock many new downstream applications. 

**The 5 Customer Questions**

**Who is the customer?**   
Any team that trains task-specific ML models on Amazon entities, and who wants to get a step function improvement in their model performance. 

**What is the customer problem or opportunity?**  
Conventional wisdom says that to harness the full potential of DL for a specific task, one needs vast amounts of task-specific labeled training data. Current SOTA side steps this by pre-training representations on a very large and generic dataset, and then fine-tuning using a small amount of task-specific labeled data (see Appendix A for details). This approach has yielded notable gains in many computer vision and natural language processing applications. However, the ML tasks in Amazon involve complex Amazon specific entities that are not only highly inter-related, but are also constituted from diverse sources of information. For instance, ASINs contain text, images, videos, reviews, customer behavioral data etc., and they are connected to other ASINs, queries, customers, and sellers. Because we lack pre-trained representations for such entities, teams in Amazon train their models using partial, piecemeal information (e.g., ASINs are represented only by their titles). Moreover, because acquiring labeled data is expensive, teams train with small amounts of labeled data. Lastly, since the gain per additional dataset can be small (e.g. synergies of using Amazon Music data in Retail), few teams have the economic incentive to invest in data integration, even though the net benefit of this process across teams would be substantial. Consequently, Amazon as a whole expends significant resources in acquiring labels and training models, without a commensurate return on investment.

**What is the most important customer benefit?**  
Teams that already rely on pre-trained or task-specific SOTA representations will be able to realize step function improvements in their model performance by transitioning to M5 representations. Teams that want to deploy new ML-based solutions will be able to build SOTA models by adopting M5 representations. They do not require deep ML/DL expertise and will need only a small amount of labeled data (easily acquired, for instance, by using AWS Sagemaker GroundTruth). This will democratize the practice of DL within Amazon while also raising the bar. It will also free up ML experts to focus on using M5 representations to power innovative products, services, and experiences.

**How do you know what the customer needs or wants?**  
This proposal is put together by a consortium of scientists and engineers from various organizations including Search, Catalog, Ads, and AWS AI. Collectively, we feel that there are a number of applications in these domains that can benefit from M5 representations. For instance, Search alone spends over $14MM to collect labeled data every year (Ads and Catalog also spend comparable amounts, and Alexa spends significantly more). Moreover, the AWS AI team spoke to major AI services across consumer, devices, and web services and they spend $TK on IMR training many million parameter models for TK tasks, and spend $TKMM on human evaluation, annotation, and labeling. Lastly, due to its federated design, additional customers can bring their specific task definition, thus ensuring that their needs are accounted for.  
**What does the customer experience look like?**  
Getting started with M5 is easy. With just a few lines of code, and a handful of labeled data, a developer can create a fine-tuned SOTA, task-specific ML model using M5 representations. To see how we will vend these representations please see below.

**Frequently Asked Questions**

**Why is this novel? Why can't I simply use GPT-3/BERT/AmaBERT/Quipus/GrokNet?**   
While existing representations such as BERT/GPT-3/Groknet are a good starting point for many applications, they are limited to either text or images. Moreover, they are trained on a single task (GrokNet is an exception), and on publicly available data such as Wikipedia or web crawled text. These models cannot meet our needs for four reasons. First, we need to compute rich semantic representations of Amazon specific entities (e.g., ASINs, queries, documents, customers, and sellers) and not just text and images. Second, these representations need to incorporate the relations that exist between the different types of entities and information from different types of data and modalities (e.g., product descriptions, tabular data, images, product graphs, user interactions, and reviews) most of which are internal to Amazon. While AmaBERT and Quipus address the vocabulary mismatch, by training on Amazon specific data, they do not take into account the multi-modal nature of the data and the relationships between entities. Third, these representations need to be trained to encode information about the wide-range of tasks that they will be used for, which will allow them to perform well for these tasks and, after limited fine-tuning, generalize to related tasks of relevance to Amazon. This is something neither AmaBERT nor Quipus address. M5’s novelty stems from developing new science and engineering tools to train a massive DL model that addresses these gaps (see Appendices B & C for more details). Lastly, many of these models (e.g., GPT-3, GShard) are excessively large single-domain models purpose-built to demonstrate scalability. Our design is purpose built for aggregate accuracy and with optimizations for economically viable deployment, e.g., via distillation (training a smaller model that has comparable accuracy).

**What is in it for each business unit?**  
Catalog. The Catalog team has three primary uses cases that will benefit from M5 representations a) ASIN to Product Type (PT) classification, b) Classification and Policy Platform (CPP) and c) Item Authority (IA). A PT identifies a group of real-world products and defines their scope (i.e. "what the product is") based on visible and functional characteristics, primarily to support ingestion (i.e. collecting relevant information from suppliers) and enrichment (e.g. validation, normalization) of product data in the Catalog, as well as for customer discovery (i.e. searching and browsing). The CPP team enables non-tech users to self-serve build, deploy, maintain and improve ML classifiers for ASINs through the act of annotation alone. A key objective for the team is to deliver and maintain classifiers with minimal number of labels and thereby expedite time to market. IA tackles the issue of sellers listing the same product using different ASINs across two or more marketplaces, i.e. cross-marketplace duplicates. This is important to enable our list once, sell globally mission and to produce a consistent customer experience. 

Search. The Amazon Shopping experience primarily uses lexical representations of customer queries and the product catalog, supplemented with behavioral associations such as customer clicks, add to cart and purchase events. Behavioral data is absent for tail queries or in tail locales, which leads to low quality search results (as measured by HERO, a measure of search quality). As we march towards our mission to provide “Search Quality Parity Worldwide, from Day One” it is imperative for us to develop richer representations of WW ASINs, queries, and customer behavior in order to provide a step function improvement in search quality and create an effortless and delightful shopping experience. For more details see https://quip-amazon.com/YwPIA1WihRzR and https://quip-amazon.com/VxH6AMA5aUR1. 

Ads**.** Ads sourcing and relevance use similar algorithms to Search and will benefit from richer representations of queries and ASINs, especially for tail queries or tail locales. In addition, Ad auctions and Click Through Rate (CTR) prediction tasks will also benefit. Ads sourcing and CTR prediction teams have recently experimented with BERT models for representing ASIN and query text and observed large offline improvements. They have been unable to deploy these models to production yet due to the computational cost and high latency of BERT model inference.  

AWS AI/ML. A number of AWS AI/ML services rely on pre-trained language models (e.g., Kendra, Contact Lens, Merlin, Comprehend, Translate, Lex) and they stand to directly benefit by distilling larger language models that require minimal (if any) fine-tuning. However, the major benefits will come from the new capabilities that these models will enable. The joint training of language models with multi-modal, product graph, and customer behavioral data and tasks, will enable multi-modal retrieval (Visual Kendra), improve the alignment between schemas and free-form-text (Merlin), and allow the no-shot/few-shot extraction of product information from free-form-text to improve recommendations, especially in cold-start scenarios (Personalize). Finally, from an infrastructure standpoint, M5 will further develop AWS AI/ML’s scalable distributed training and inference capabilities of large heterogeneous sequence and graph models, which will benefit AWS and its customers.

Alexa. Alexa Search and Alexa NLU rely on different-size language models followed by fine-tuning for a wide-range of problems including retrieval; Q\&A/dialog; common knowledge graph construction and curation; entity extraction, linking, and mapping; and semantic parsing. M5 representations will address issues associated with the high cost of labeled data acquisition and the need to keep customers’ data for limited time due to privacy reasons (i.e., only use for fine-tuning). M5 will also address cost-related training and inference requirements by amortizing training across different orgs and admitting aggressive distillation with negligible quality loss. Finally, the expressiveness of M5’s representations will improve the quality of existing services (e.g., long-range customer behavior, utterance-to-ASIN mapping) and enable new ones (e.g., long dialogs).

**What are the risks?**  
Science & Engineering. We hypothesize that semantic representations of Amazon specific entities can be easily fine-tuned for many internal applications. While this idea is very successful for text, graph, and image embeddings, we are the first to explore them for complex, multi-entity, multi-modal data. Fusing these multiple sources of data, judiciously selecting and combining tasks, and performing model distillation in order to make the models deployable are challenges. Moreover, we are proposing to train our models with 1000x more data and 1000x more parameters than any model currently being trained in Amazon and using training approaches that exploit the relations between the different types of entities. This will require significant science and engineering innovation to scale our infrastructure to train these representations continuously in a cost-effective manner. Appendix B briefly outlines the scientific hypotheses that we plan to test as part of this effort.

Execution. We plan to build and vend the representations to teams inside Amazon. It is possible that we are unable to develop a successful vending strategy and therefore are unable to onboard other teams. Some online tasks have strict latency constraints and we may not be able to distill our trained representations to meet these constraints without unacceptable loss of accuracy.

**What is the risk of not investing in M5?**  
As we articulated above, we will miss an opportunity to build a rising tide which will lift all boats, in terms of improving the performance of DL models inside Amazon. Consequently, teams would continue with the status quo which is sub-optimal, inefficient and not cost effective. There are diminishing returns in adding data sources. Hence each team would only integrate with a small number of additional sources, if any at all. On the other hand, the aggregate benefit makes such integrations immediately economically viable. Furthermore, many teams which could innovate on behalf of our customers will be unable to do so because they lack the expertise and resources to collect large labeled datasets and/or use these to train large models. 

M5 provides a proprietary capability purpose-built for many of the most important machine learning tasks across Amazon. If we decided to use or leverage the work from GPT-3 (OpenAI), BERT (Google), or GrokNet (Facebook), then we run the risk that it may not always be accessible (or even legal) because it is controlled by a competitor, and it may not meet the needs of our customers who use Amazon’s AI services.

**What resources do you need?**   
We need 30 HC and $15MM annual IMR budget. The core team will focus on Training (2 APSCI, 5 SDE), Inference (1 APSCI, 3 SDE), Data (1 APSCI, 2 SDE), and DL models (3 APSCI, 1 SDE) for a total of 18 HC. We ask that Search, Catalog, and AWS each contribute 6 HC towards this. The rest of the HC will work on Search tasks (2 APSCI, 2 SDE), Catalog Tasks (2 APSCI, 2 SDE), and Ads tasks (2 APSCI, 2 SDE) for a total of 12 HC with each team providing HC for their tasks. Each team working on an activity listed above will be led by an L6/L7 leader. In addition, we have dependencies with concurrent compiler (Meta) and custom hardware efforts (Sunda) to reduce IMR costs for model training and inference.

**What are your timelines, deliverables, and milestones?**  
We will divide the work into four milestones. See Appendix E for the IMR requirements for each milestone.

Milestone 1: M3-lite (Q1 2021\). For our first milestone we will train multi-modal, multi-lingual and multi-locale ASIN representations that achieve SOTA on a Search, Catalog, and Ads application as detailed in Appendix F.

Milestone 2: M4-lite (Q3 2021\). During our second milestone will extend our M3 ASIN representations to queries and improve their quality via multi-task training on 10+ Search, Catalog, and Ads tasks. We will add customer review text to our training data for ASIN representations. We will use our M4 representations to demonstrate SOTA performance on TK Search, Catalog, and Ads tasks via fine-tuning. We will distill M4 representations for low latency online execution (p99 \< 30ms) and power the launch of Magnus in UAE, TK catalog task and TK Ads task.

Milestone 3: M5-base (Q1 2022\). For our third milestone we will use graph-based deep learning to facilitate the exchange of information between different entity representations, support generative representations and introduce Q\&A tasks for training. We will scale up the M5 representation model size to 10B parameters and use these representations to power the launch of a dozen additional tasks across Catalog, Search, Ads, and Alexa. We will finalize the set of 50+ supervised tasks for M5 representation training, support on-boarding new tasks for representation fine-tuning, and vend M5 representations to teams across Amazon.

Milestone 4: M5-large (Q3 2022\). For our final milestone, we will scale our M5 representation model size to 100B parameters and demonstrate its capability to achieve SOTA performance via fine-tuning on all Search, Catalog, Ads and Alexa tasks.

**How will you vend representations to internal teams?**   
The M5 system comprises of two training pipelines—core training and fine-tuning—that will vend trained representations, including distilled versions, e.g. via Sagemaker endpoints, or cached embeddings. The main training pipeline performs unsupervised and core multi-task and multi-modal training. The fine-tuning pipeline performs task specific full model fine-tuning. We will automate hyper-parameter optimization for tuning the learning rate and other model parameters during fine-tuning. Our goal is to simplify onboarding a new task to the fine-tuning pipeline to only entail supplying a small labeled training, validation and test data set. We will evaluate tasks supplied for model fine-tuning for potential inclusion in core multi-task model training. Search, Catalog, Ads, and Alexa teams can directly consume core-trained or fine-tuned representations from these pipelines via Sagemaker endpoints and/or integrate these into their current systems for vending semantic representations.

**How will you handle training data from partner teams?**  
We will not use red data for core model training and require that our partners use their own established protocols to remove this from their data sets. We will carefully select and vet training data sets used for the core training pipeline. Datasets that do not make the cut can be used in the fine-tuning pipeline where they cannot pollute the core model. We will design our core training objective function to be resilient to adding and removing partner datasets but will need to reserve the right to retain past representations from a partner to limit the collateral damage to our customers. Finally, we plan to explore differential privacy solutions for data contributions.  

**What does success look like?**  
M5 will provide high-quality contextual semantic representations of different types of entities that require minimal fine-tuning to achieve SOTA performance and realize step function improvements in downstream tasks of relevance to Amazon.   
For example, for the Search task listed in milestone 1 (Appendix F), we estimate that M5-based models will generate over $1B annualized OPS gains through improvements in search quality for emerging and new markets. For the Ads CTR prediction task, each 1% improvement in model accuracy will generate an additional $300MM annualized Ads revenue. By training a core model on multiple tasks that can be fine-tuned for specific tasks, M5 will consolidate and reduce IMR training costs across Amazon. For example, independently training a (much smaller) model for the Search task listed in milestone 1 will require $1.4MM/yr in IMR costs. The Ads CTR prediction task consumed $170K in IMR costs over a 4 day period training and fine-tuning a BERT model, which translates to $3.5MM for a yearly lease with the internal rate card. M5 representations will require 10-100x less human labeled training data for task-specific fine-tuning. In 2020, Search spent $2.4MM on human labeled training data and Catalog spent $TK. By not requiring deep ML/DL expertise and only a small amount of labeled data, we expect M5 representations will see broad adoption by teams across Amazon. Finally, M5 will enable ML experts across Amazon to focus on delivering new products, services, and experiences that exploit the rich information encoded in M5’s representations.

# **Appendices**

Appendix A: Background of Semantic Representations  
Appendix B: Science and Engineering Innovations  
Appendix C: Using Graphs to Unify the Training of the Representations  
Appendix D: M5 RACI Chart  
Appendix E: M5 training machine requirements  
Appendix F: M5 Milestone 1

# 

# **Appendix A: Background of Semantic Representations**

First-generation semantic representations emerged in 2013 in the form of word embeddings (fixed dimensional vectors) as popularized by word2vec. These representations achieved state-of-the-art (SOTA) performance on several tasks when used as features in task specific architectures. The next breakthrough followed in 2017 with the transformer architecture that eliminated the need for a recurrent model to capture global dependencies between input and output sequences and permitted more parallelization during model training. In 2018, second-generation semantic representations appeared in the form of BERT, which used this transformer architecture to train deep bidirectional language representations. BERT representations were able to achieve SOTA performance on several tasks without needing task specific architectures by directly training the model on the downstream task to fine-tune all pre-trained parameters (i.e., representations as executable and trainable models). Third-generation representations appeared in 2019 in the form of GPT-2, which used a similar transformer architecture but a much bigger model with 5x more parameters (1.5B) as compared to BERT. In addition to achieving SOTA on several tasks via fine-tuning, these representations were able to achieve good task performance with only a small number of training examples (few shot learning). Few shot learning is important for tasks where gathering labeled training data is difficult or expensive. Recently, fourth-generation representations have emerged in the form of GPT-3 which uses a 100x larger model (175B parameters) than GPT-2. These representations achieve SOTA on several tasks via fine-tuning, perform better on few shot learning tasks and are even capable of zero shot learning without any training data on some new tasks.  
   
Since the emergence of the deep transformer architecture for NLP tasks in 2017 (akin to the deep convolutional architecture for vision tasks) we have seen three generations of advances in representational power in three years driven primarily by training larger models. BERT used a 350MM parameter model trained on 250B text tokens and GPT-3 used a 175B model (500x larger) trained on 400B tokens. However, the improvement from third-generation (GPT-2, 1.5B parameters) to fourth-generation models (GPT-3) saw diminishing returns from the 100x increase in parameters suggesting an opportunity to focus on improving other aspects of training in lieu of only focusing on size.

**Appendix B: Science and Engineering Innovations**

These are the key hypothesis we plan to explore and address as part of this effort.

*Hypothesis 1:* Multi-modal training using all available information for an entity will provide grounding and enable us to train a better model.

*Hypothesis 2:* Combining supervised multi-task training along with unsupervised training will accelerate learning and result in better model accuracy especially for shopping where product facets matter. 

*Hypothesis 3:* We can use graphs to unify the multi-task training of the different representations and employ deep graph neural networks to learn more expressive representations that account for the relations among the different entities.

*Hypothesis 4:* We can use a multi-task training objective with datasets in multiple languages to learn multilingual representations.

*Hypothesis 5:* Training a deep bidirectional transformer-based model using a de-noising approach will enable us to exceed the performance of GPT-3 if everything else is held constant and can be extended to other modalities such as tabular data.

*Hypothesis 6:* We can improve training sample efficiency by filtering easy examples and focusing on hard examples and reduce training IMR costs.

*Hypothesis 7:* We can innovate in model and data parallel distributed training and use compilers and custom hardware to accelerate training and reduce IMR costs.

*Hypothesis 8:* We can use a combination of model distillation, quantization and compilers and custom hardware to reduce model inference time by 100x relative to GPT-3 and GShard for online scenarios with negligible loss in accuracy.

*Hypothesis 9:* We can use graphs to integrate knowledge representations with unstructured sequence data.

**Appendix C: Using Graphs to Unify the Training of the Representations**

M5 will learn functions that compute representations of various Amazon entities based on different supervision signals. Examples of the entity types include queries, ASINs, customers, sellers, product descriptions, product reviews, seller reviews, images, ads, and long-chunks-of text. Examples of supervision signals include masking tasks (e.g., word/column masking for language/tabular models), generative tasks (e.g., predict an ASIN’s embedding from its product description embedding, its review embedding, or its product image embedding and vice versa), ASIN tasks (e.g., similar ASINs, counterfeit ASINs, price prediction), query tasks (e.g., next query prediction, query to product type classification, entity tagging), and query-ASIN tasks (e.g., query-ASIN relevance score, ads ranking). In addition, many of the entities will have attributes describing the properties of the specific instance of that entity (e.g., the text associated with a query entity, the part of the product graph associated with an ASIN, the past queries of a customer). 

M5 will unify the representation of all this information—entities, their attributes, and the supervision signals—by using an attributed heterogeneous relational graph. This graph will contain different types of nodes for the different entity types of interest (e.g., there will be a set of vertices representing the different ASINs, a set of vertices representing the different queries, a set of vertices representing the different sellers, etc). The entity attributes will be represented as node features (e.g., text, price) or as additional node types that connect to the entity nodes via a feature-specific relation type (e.g., connecting an ASIN node to its corresponding node in the product knowledge graph via a relation of type is-described-by-knowledge-graph-node). The supervision signals involving pairs of entities will be represented by connecting the corresponding nodes via a supervision-signal specific relation type (e.g., asin-similar-asin, query-viewed-asin, query-next-query, asin-has-review, etc), whereas the supervision signals involving predicting properties of the entity itself (e.g., masking, price, category) will be represented by adding the corresponding properties as target features on the nodes.

Given this graph, the joint end-to-end training of the different entity embeddings using all the supervision signals can be performed by using graph neural networks (GNNs) to learn node representations that can predict all the links in the graph and all the target features. Besides providing a unified training framework, the GNN framework allows the representations to learn how to take into account information from other entities, even if they are multiple hops away. This improves the expressiveness of the representations and enables them to capture relations between different types of related entities. Furthermore, by using a GNN of depth 0, this approach reduces to the standard multi-task training approach (e.g., as that used in GrokNet); thus, providing a framework that is strictly more flexible and more expressive than existing approaches.

**Appendix D- M5 RACI Chart**

| Key Activity | Core Team | AWS Machine Learning | Search | Catalog & Selection | Ads | Alexa-NLU | Alexa Search |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **Training** | R, A | C | C | C | C | C | C |
| **Inference** | R, A | C | C | C | C | C | C |
| **Data** | R, A | R | R | R | R | R | R |
| **DL Models** | R, A | C | C | C | C | C | C |
| **Search Tasks** | C, I | I | R, A | I | I | I | C, I |
| **Catalog Tasks** | C, I | I | C, I | R, A | I | I | I |
| **Ads Tasks** | C, I | I | I | I | R, A | I | I |
| **R \= Responsible \= The team who performs the work. A \= Accountable \= The team ultimately accountable for the work or decision being made.C \= Consulted \= Teams who must be consulted with prior to a decision being made or the task completed.I \= Informed \= Teams who must be informed when a decision is made or work** |  |  |  |  |  |  |  |

**Appendix E: M5 training machine requirements**

**M3/M4-lite**: 1.5B parameter Transformer model  
Training set size \= 250B tokens.  
Training time \= 48 hours  
Number of trainer machines \= 66 (p3), 36 (p4, n2)  
   
**M5-base**: 10B parameter Transformer model  
Training set size \= 250B tokens  
Training time \= 7 days  
Number of trainer machines \= 310 (p3), 152 (p4, n2)  
   
**M5-large**: 100B parameter Transformer model  
Training set size \= 500B  
Training time \= 14 days  
Number of trainer machines \= 3000 (p3), 1500 (p4, n2)

**Appendix F: M5 Milestone 1**

Consider the following three distinct applications:

**Application 1: Duplicate Detection (Catalog)**

The [Item Authority](https://w.amazon.com/bin/view/Catalog_Item_Authority/) project aims to tackle the issues of (1) sellers listing the same product using different ASINs across two more marketplaces and (2) “FrankenItems”, which represent different products mapped onto the same ASIN. The underlying ML task is binary classification (duplicate or not). The Item Authority team has collected (of the order of) 10 million “hard” training examples using manual labeling and heuristic techniques. A notable learning of the Item Authority team was that the use of image and text embeddings together were the biggest factor in improving their model’s ability to scale to production use cases, including the prevention of, and ability to fix duplicates and FrankenItems across marketplaces \[5\]. 

**Application 2: Search for Emerging Locales (Search)**

The [Magnus Search project](https://quip-amazon.com/YwPIA1WihRzR/Magnus-PRFAQ-Draft) aims to provide search quality comparable to US head-queries for new/emerging locales on Day 1\. Towards this end, the team creates semantic representations of ASINs WW and learns to map queries from different languages into this common semantic space. Currently, the ASIN representations are learned using Resnet and [Multilingual AmaBERT](https://w.amazon.com/bin/view/Model_Factory/Feature_Repository/Quipus#HWhatisavailableinQuipustoday3F) embeddings, using data from US and UAE. The underlying ML task here is to predict, given a (query, ASIN) pair, if the ASIN is Exact, Substitute, Complement, or Irrelevant ([ESCI](https://quip-amazon.com/RJG9A9BphJYw/Astria-what-is-HERO) label) for the ASIN, and if the customer will purchase this ASIN after issuing the query. 

**Application 3: CTR Prediction (Ads)**

Given a (query, ASIN) pair, predict the click-through rate (CTR) \[1\]. The current approach uses a 12-layer base BERT model trained on the titles and descriptions of 1.5 billion ASINs with a sequence length of 128, and embedding dimension of 768\. The model is then fine-tuned through a supervised learning task using SP data (ad impressions and clicks). This produced a 1% offline Area under the ROC curve (AUC) lift for page ASINs and ad ASINs on US Detail Pages, and almost 2.4% AUC lift for page ASIN and ad ASIN pairs with little history (0.5% offline AUC lift is considered significant) \[1\].

As part of Milestone-1 we will test the following hypothesis:

**Can a universal multi-modal, multi-lingual, and multi-locale ASIN representation (M3-lite) be fine-tuned to achieve better performance than existing models for the above three applications?** 

We chose the above three applications because they represent tasks with well-understood figures of merit, mature experimentation frameworks, and which rely heavily on BERT-style models to generate ASIN representations for their implementation. Our hypothesis is that training a trunk network and then fine-tuning it on these individual tasks will achieve comparable or better performance than state-of-the-art (SOTA) because the trunk model has more parameters and is trained with larger quantities of richer data. We do not choose to embed other entities in this milestone, because a) an ASIN representation suffices for the above three tasks, and b) embedding multiple entities requires significant research to incorporate richer entities and their relationships. Also, we will focus on [cloze](https://en.wikipedia.org/wiki/Cloze_test)\-style tasks (fill in the blanks) for pre-training \[3\]; true multi-task will be added to the model in the next milestone. 

We will train the model on text and image data for three languages (English, Arabic, and German) in three locales (US, UAE, and DE). The model will be presented with ASIN text with randomly chosen substrings masked off and asked to produce the missing text. For multi-modal training we will use a modification to the sentence agreement task in which the model is either presented with an image and ASIN text and asked to determine whether the image belongs to that product, or presented with one and asked to predict the other. The trunk network will combine a ResNexT model for image data and a scaled-up 1.5B parameter BERT-style transformer model for text data.

**Implementation Roadmap:**

We will target a completion date of March 31st 2021 with a checkpoint on Jan 4th 2021, and 6 confirmed headcount by October 1st 2020, to be expanded by 4-6 per month to a total of 24 by February 1st, 2021 as outlined in the Implementation Roadmap table below.  
We will decompose progress towards this milestone into four separate sub-goals: (1) acquiring the title description and image data we will use for training and building the initial implementation of our data and model parallel training infrastructure, (2) training a 1.5B parameter English-only BERT-style transformer model, (3) combining that model with a ResNexT model, and (4) extending that model to three locales: English, Arabic, and German. To achieve these goals in roughly six months, we assume the following schedule and headcount allocation.

| Duration | Sub-goal | Data | DL model | Core Training | Core Inference | Search Task | Catalog Task | Ads Task | Cadence | Parallelism | IMR per month | HC |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| 1 mo | Training Infra | 1 SDE | \- | 1APSCI, 4SDE | \- | \- | \- | \- | \- | 1x | $18K | x |
| 1 mo | Training Infra \+ 0.5B English | 1 APSCI, 1 SDE | 1 APSCI | 1 APSCI, 4 SDE | 1 APSCI, 1 SDE | 1 APSCI\*, 1 SDE\* | 1 APSCI\*, 1 SDE\* | 1 APSCI\*, 1 SDE\* | 48 hr | 1x | $100K | x |
| 1 mo | 1.5B English | 1 APSCI, 1 SDE | 1 APSCI | 1 APSCI, 4SDE | 1 APSCI, 1 SDE | 1 APSCI, 1 SDE | 1 APSCI, 1 SDE | 1 APSCI, 1 SDE | 48 hr | 1x | $300K | x |
| 1 mo | \+Multi-modal | 1 APSCI, 2 SDE | 2 APSCI, 1 SDE | 2 APSCI, 5 SDE | 1 APSCI, 2 SDE | 1 APSCI, 1 SDE | 1 APSCI, 1 SDE | 1 APSCI, 1 SDE | 28 hr | 2x | $1MM | x |
| 2 mo | \+Multi-lingual | 1 APSCI, 2 SDE | 3 APSCI, 1 SDE | 2 APSCI, 5 SDE | 1 APSCI, 3 SDE | 1 APSCI, 1 SDE | 1 APSCI, 1 SDE | 1 APSCI, 1 SDE | 28 hr | 2x | $1MM | x |

\* Denotes partial engagement to help evaluate preliminary model output

**IMR:**

The total hardware cost of training a ResNexT model is negligible compared to the cost of training a 1.5B parameter BERT model. As a result, our total investment will be roughly that of the latter. This value can be calculated based on desired training cadence and the maximum number of simultaneous experiments which we wish to support. For example (see IMR Derivation below for details), 66 P3 GPU instances comprising 44 dedicated to training and 22 dedicated to parameter serving could support a cadence of 2 days for a single experiment at a time. At an internal reserved lease of $4.5K/mo/instance for a p3dn.24xlarge, this would cost $300K/mo. Few options exist for reducing these costs. p3.16xlarge instances are an option. However, using these would result in a large reduction in performance (25 Gbps NIC vs 100 GBps, 16 GB memory vs 32 GB) at only a 10% reduction in cost. Spot instances are unavailable for p3dn.24xlarge, and the spot price for p3.16xlarge is double the reserved rate: $7.3k/mo/instance. 

Training time and parallelism scale linearly with IMR costs, making it easy to adjust these estimates relative to our proposed investment. A $1MM/mo IMR investment would purchase 220 GPU instances capable of supporting a training cadence of 14 hours. Dividing these resources to support two parallel experiments would reduce that cadence to 28 hours. These figures also scale linearly with parameters: halving the size of a model would allow us to either double experimental parallelism or to halve training cadence early on during development.

**Rationale for Locales/Languages**

We choose US (English) since it is the largest marketplace by customer query volume and catalog size for Amazon. Note that for the marketplaces described below, EN data will be used as well, as it typically represents the majority of query/catalog data.  
We choose UAE (Arabic) because:

* It is an emerging marketplace, displaying problems of a different nature to US

* Arabic is grammatically distinct from English

* We will be collaborating with Magnus which has a tech/org partnership with the MENA-Tech team that will be critical when analyzing actual examples (e.g. access to native AR speakers)

We choose DE (German) because:

* It is an established marketplace, but has a large proportion of German queries and ASIN data 

* German has unique properties which distinguish it from English (e.g. compounding of words)

We would consider JP (Japanese) as more interestingly distinct from DE (German) were it not the case that:

* It is easier for native English speakers to analyze German examples than Japanese

* We already have raised our degree of difficulty one notch, above, with Arabic.


**References**

\[1\] [https://quip-amazon.com/gL35AnSv4Jnq/Detail-Page-BERT-Features-Science-Review](https://quip-amazon.com/gL35AnSv4Jnq/Detail-Page-BERT-Features-Science-Review)  
\[2\] [http://stack-tools.na-prod.search.amazon.com/sdm.cgi?docid=B07LCVMN2G](http://stack-tools.na-prod.search.amazon.com/sdm.cgi?docid=B07LCVMN2G)  
\[3\] [https://arxiv.org/pdf/1910.10683.pdf](https://arxiv.org/pdf/1910.10683.pdf)  
\[4\] [https://apttool.amazon.com/weblab/regression\_results/jobID=1595611517433485\&weblabID=SEARCH\_GEHRA\_285736](https://apttool.amazon.com/weblab/regression_results/?jobID=1595611517433485&weblabID=SEARCH_GEHRA_285736)  
\[5\] Paper from Item Authority describing their multi-lingual multimodal duplicate detection work, as well as dataset-collection: [GEM\_Submitted.pdf](https://quip-amazon.com/-/blob/PKH9AA7nPjb/cHUXLiADSISm5_YudmQVzg?s=hZLcA9auuR1z&name=GEM_Submitted.pdf)