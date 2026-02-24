# **M5 MBR \- March 2021**

## **Executive Summary**

Our first two MBRs focused primarily on establishing basic model training capabilities and performance baselines. In the last month we focused our attention on optimizing end-to-end results with the Duplicate Detection and Semantic Search teams, and increasing our active application partnerships to include the Brand Classification, CTR Prediction, and Document Understanding teams. We have finalized our training datasets with all five application partners, and our most recent experiments show (1) between 112-984 bps improvement in the precision and recall metric (PR-AUC) versus production for English language ASIN duplicate detection, (2) a 760 bps improvement in exact matches on the semantic search task, and (3) parity with production for the brand classification task and promising initial results for the CTR prediction task. These results follow directly from an improvement in experimental agility: we are able to perform round-trip experiments with Duplicate Detection in one day, and the Semantic Search and CTR prediction teams in 2-3 days. Concurrent with this effort, we have focused our attention on model distillation, which will be necessary to carry these improvements over production through to launch. Using a combination of student/teacher training and model quantization, we have demonstrated the ability to distill a 500MM parameter model into a 70MM parameter model with a 1.6% reduction in accuracy on the duplicate detection task. The smaller model can perform inference in 42.6ms on a C5 instance, which is an important milestone as 100ms latency is the latency threshold for offline partner applications.

In addition to these updates we have (1) grown our group by 2 L4 SDEs and 1 L4 AS, (2) completed a design doc with the UIFC team with the goal of developing an initial prototype for fine-tuning and embedding vending by early April, (3) integrated versioning into our data pipeline which allows us to rerun old experiments and perform regression testing, (4) added initial support for multi-task training and expanded our pre-trained model to include 9 languages from 14 locales putting us ahead of our model design roadmap, and (5) transitioned our training infrastructure to a mix of P3 and P4 instances to take advantage of the 6x reduction in cost for P3 instances. Having established a strong M5 baseline across our partner engagements our next goal will be to focus on designing and implementing a mature multi-task training framework to build on these gains.

## **Partner Engagements**

In the past month we have begun capitalizing on our model training and performance capabilities to produce state of the art results with two of our application partner teams: (1) the Duplicate Detection team was able to demonstrate a 112—984 bps improvement in PR-AUC by retraining their ensemble classification model using M5 ASIN embeddings as inputs, and (2) we were able to demonstrate that M5 ASIN embeddings are as effective as DSSM embeddings (the incumbent baseline) according to behavioral metrics and produce a 760 bps increase in exact matches in the top 16 results. Additionally, we were also able to show that (1) M5 ASIN embeddings can be used to automatically generate brand embeddings (without fine-tuning) which perform as well as those trained by the Brand Classification team for use in their ensemble classification model and (2) that a fine-tuned M5 model provides a 29 bps improvement over the Ads BERT model, which the CTR Prediction team has considered moving into production, despite being partially trained on only 15% of the available fine-tuning data. See Appendices A—D for an extended discussion of each of these application partner tasks and evaluation results. 

The results described above follow directly from improvements in our experimental agility. We have finalized training and test datasets with all five of our application partner teams (Duplicate Detection, Brand Classification, Semantic Search, CTR Prediction, and Document Understanding), and are performing regular roundtrip experiments with four out of the five with the expectation that the Document Understanding team will be incorporated by next month. Additionally, we have developed the infrastructure to perform round-trip experiments with the Duplicate Detection team at a one-day cadence, at a 2-3 day cadence with the CTR Prediction and Semantic Search teams, and are in the process of developing similar capabilities for the remaining two teams. We expect similar SLAs across all five teams to be complete by next month.

## **Performance**

In our previous MBR, we reported a TCO improvement of 4.4x by transitioning from P3 to P4 instances based on Q4 2020 rates, which priced P4 instances at only 5% more than P3s. In Q1 2021, the cost of P3s dropped by 6x for p3dn.24xlarge leading us to re-evaluate our fleet plan. 

Transitioning completely to P3 instances would produce the optimal TCO result, but managing the larger fleet would be difficult without the right tools. To address this, we have begun automating our development pipeline in order to minimize maintenance and enable reliable deployments. These new capabilities will be integrated with our AWS batch scheduler, allowing us to run training jobs across a large number of machines without managing individual instances, automatically restarting failed instances, and restarting failed training jobs from checkpoints. At the same time, preserving some P4 instances will allow us to run high-priority jobs and to maintain an experimental platform for model parallel training when future versions of the M5 model cannot fit on a single GPU. Model parallel training places higher demands on communication, and P4s have superior communication latency and bandwidth compared to P3 instances. As a result, we have transitioned our fleet to 200 P3s and 100 P4s. However, due to increased public demand for P4 instances and a lack of supply, we may be forced by AWS to transition our infrastructure almost entirely to P3 instances (see Discussion topic below).

## **Data Pipeline**

We finished ingesting datasets from all five of our application partners for use in both fine-tuning and downstream evaluation. In addition to a labeled corpus of ASIN pairs from the Duplicate Detection team, and historic query/result data from the Semantic Search team, we now have click data from the CTR Prediction team, and a corpus of human-audited brand and attribute values from the KPEX team for use with the brand classification and document understanding tasks. We also introduced dataset versioning into our experiment tracking infrastructure (the alternative would be to use SageMaker, however SageMaker only supports model versioning) to allow us to reproduce experiments and perform regression tests regardless of changes made to the content of the Amazon catalog. Along with these changes, we transitioned to the HuggingFace DataSet format as our standardized interface for dataset consumption allowing us to avoid spending time writing data adapters.

With increased model training agility and more data being used for training our storage requirements stands at close to 40TB. In the coming month we plan to pursue a strategy for making more efficient use of our data through retention policies and tools. As a first step in this direction, we migrated our experiment tracking (MLFlow) infrastructure from S3 to Amazon Relational Database Service (RDS), leading to 10% faster writes and 75x faster read times for experiment metadata.

## **Model Design and Fine-Tuning**

Our goal is to produce high quality pre-trained models that perform well on partner downstream tasks, ideally with no additional training or with very little training. To achieve this we have set the target for our pre-trained models to be multi-lingual, multi-locale, and multi-modal by the end of Q1 2021\. In the past month we refined our multi-modal training capabilities, developed the ability to train multi-lingual models with 9 languages and 14 locales, and took initial steps towards training on multiple tasks. See below and Appendix E for details.

**Multi-Modal** We evaluated a multi-modal model that uses title, bullet point, and structured data on the duplicate detection and semantic search tasks. As described in Appendix A, our current best multi-modal model outperforms the more complex ensemble model used by the Duplicate Detection team in 3 of the 4 categories. We expect that we will require information from images to produce further improvements. We have extended an offer to an L6 AS to lead the effort of integrating catalog images into our training and evaluation pipeline. 

**Multi-Lingual** We pre-trained our first multi-lingual model on 9 languages and 14 locales and evaluated it on the duplicate detection task in 3 languages: English, Spanish, and German. The performance of the multi-lingual model on English is similar to our monolingual multi-modal model with a ROC-AUC of 0.941 versus 0.945 and a PR-AUC of 0.877 versus 0.878. The performance on Spanish and German still lag behind the production ensemble model. One reason for the difference is that our multi-lingual duplicate detection training data contains unicode encoding errors. We are investigating this further.

**Multi-Task** We have implemented a basic multi-task framework that allows us to pre-train on N tasks using mixed-batch training and per-task loss-scaling (prior to this work all of our models used masked language prediction as their single pre-training task \--- going forward we expect to increase N to 20). To test this infrastructure, we took a model pre-trained on the MLM task and continued pre-training on two tasks: product type (PT) classification and duplicate detection. We then fine-tuned the model on the duplicate detection task and found that ROC-AUC was lowered by 160 bps from 0.945 to 0.929. This may be due either to overfitting or an insufficient number of tasks (prior work shows that multi-task training is harmful for low values of N). In the coming month, we plan to collect additional single-ASIN and pairwise-ASIN training tasks and incorporate these into our multi-task infrastructure.

## **Model Distillation**

In our previous MBR we described the use of model quantization to obtain a reduction in memory overhead and latency by representing model weights using 8-bit integer values as opposed to 16- or 32-bit floating-point values. Quantization is an instance of a class of techniques known as *model distillation* which aim to transfer knowledge from the original (teacher) model to a smaller or more performant (student) model. In the past month, we developed the ability to perform task-specific teacher/student training. Beginning with a 500MM parameter multi-modal cross-attention-based teacher model, we instantiated a smaller 70MM BERT-style model, trained that model on the masked language prediction task, and then used the teacher model to generate duplicate/not-duplicate judgements for ASIN pairs. The student model was then trained using a loss function which penalized results which differed from the teacher. Results are summarized below and in Appendix F.

Our distilled student model showed an ROC-AUC of 92.7% on the duplicate detection task, as compared to an ROC-AUC of 94.3% observed using the M5 teacher model it was trained from, for a difference of 1.6%. The student model showed a per-inference latency of 42.6ms (compared to 452.9ms for the teacher) on c5.24x instances and a latency of 5.64 ms (compared to 50.19ms for the teacher) on p3dn.24x instances \--- a 10x reduction in latency on both CPU and GPU instances. Crucially, this puts our student model below the 100ms latency threshold which is required for application partners with offline services (e.g. duplicate detection). This puts us one step closer to our goal of launching partner applications which make use of M5 technology. Additionally, we note that these numbers were computed using a fixed input sequence length of 512 which may be conservative compared to production where inputs may be of varying lengths up to 512 (latency improves more than 2x for every halving of sequence length).

In the coming month, we will focus on continuing to reduce the latency of student models as well as in automating the distillation process so that it can be run independently by scientists looking to produce models for application partner evaluation. We will also transition to using the distilled models as the default for application partner evaluation. 

## **Hiring**

We hired two returning interns: one L4 Applied Scientist and one L4 SDE. We also hired a second L4 SDE through internal transfer. We have offers out to one L5 Applied Scientist through internal transfer and one external L6 Applied Scientist who will potentially lead our image modeling efforts. We are continuing to recruit Applied Scientists and a Technical Program Manager.

## **Hits**

* We used M5 embeddings to obtain a 112 — 984 bps improvement in PR-AUC on the duplicate detection task and a 760 bps improvement in exact matches on the semantic search task. Bringing either of these results to production would put us ahead of schedule for satisfying our first application partner launch goal.  
* We have streamlined the process of performing round-trip experiments with the Duplicate Detection team and can now produce results in one day. We are also able to complete round-trip experiments with the CTR Prediction and Semantic Search teams in 2-3 days.

## **Misses**

* We identified two high severity bugs in our training infrastructure: (1) a data loading error which caused our models to forget what they learned in pre-training and effectively begin fine-tuning from scratch, and (2) a fine-tuning error which applied the soft-max function twice leading to unsound training. Fixing these bugs led to improvements on the duplicate detection task of 89% to 93%, and 93% to 94.6% respectively. However, prior to discovering these bugs we wasted approximately two weeks chasing dead ends looking for an explanation of why our models weren’t competitive with open source alternatives. In the coming month we will pursue regression testing and model visualization tools to help prevent against similar bugs.

## **Discussion Topics**

* AWS has requested that we convert all but 16 of our P4 instances to P3s due to large public demand and a shortage of available instances. Depending on P4 availability in the coming months, this may affect our ability to perform efficient model parallel experiments at scale.  
* 

## **Appendix A: Duplicate Detection**

The table below summarizes the results of retraining the Duplicate Detection team’s production ensemble model with ASIN embeddings generated by our best-performing M5 model. Our 500MM parameter multi-modal cross-attention model performs the best, producing between 112 and 984 bps improvement relative to the baseline on the (H)ardlines, (S)oftlines, (C)onsumables, and (M)edia product lines.

| Model | H | H-diff | S | S-diff | C | C-diff | M | M-diff |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Baseline | 84.42% | **\-** | 69.42% | **\-** | 83.75% | **\-** | 95.72% | **\-** |
| M5 | **88.93%** | **451** | **79.26%** | **984** | **90.99%** | **724** | **96.84%** | **112** |

The table below summarizes the performance of the same multi-modal M5 model as a drop-in replacement for the Duplicate Detection team’s production ensemble model. The results are not as strong as above (238—698 bps improvement, with a 302 bps decrease observed for media), but competitive enough to suggest that we may soon be able to replace the ensemble model entirely.

| Model | H | H-diff | S | S-diff | C | C-diff | M | M-diff |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Baseline | 84.42% | \- | 69.42% | \- | 83.75% | \- | 95.72% | \- |
| M5 | **86.80%** | **238** | **76.40%** | **698** | **89.40%** | **565** | **92.70%** | **\-302** |

## 

## **Appendix B: Brand Classification**

The table below summarizes the results of replacing the default brand embeddings in the Brand Classification team’s production ensemble model with M5 embeddings generated using a 500MM parameter multi-modal model with no fine-tuning. For a corpus of ASINs with human labeled brands, we define the centroid of the embeddings for each ASIN associated with a brand as the brand embedding. We observed no noticeable PR-AUC change which indicates that our embeddings capture a similar amount of information to the default embeddings. However, we note that these results were generated using test data which excludes an additional 30% “difficult” examples. As a result, the bar for demonstrating improvement is high. (The 20% drop in p99 is explained by 1 incorrect prediction.) Future training and evaluation will use the full dataset. 

| Model | PR AUC | P99 Recall | P95 Recall | P90 Recall | P80 Recall |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Baseline | 97.17% | 37.07% | 88.04% | 99.62% | 100.00% |
| M5 | 97.16% | 15.83% | 85.91% | 99.27% | 100.00% |

## 

## **Appendix C: CTR Prediction**

The production implementation of CTR prediction uses a 3-layer multilayer perceptron (MLP) which makes predictions based on Ad and Page ASIN title, GL group type, widget name, search engine, and historical click rates. The Ads team has also experimented with the use of transformer models. This implementation used a BERT model to generate embeddings based on Ad and Page ASIN title, and then passes those embeddings as inputs along with GL group type, widget name, search engine, and historical click rates to the 3-layer MLP. A two-phase fine-tuning process is used to train this model, the first starts with BERT and then fine-tunes on Ad and Page ASIN titles and CTR predictions. The second continues to fine-tune using GL group type, widget name, search engine, and historical click rates as well.

We adopted a similar strategy for training two 500MM parameter M5 models; the table below compares their performance. Both versions are phase 1 fine-tuned using Ad and Page ASIN text data (title and bullet points) along with GL group type, widget name, search engine, and historical click rates, and then phase 2 fine-tuned using Ad and Page ASIN text data along with just historical click rates. One version of the model also uses multi-modal ASIN data derived from EIP during both phases. The columns labeled Phase 1 compare the offline performance of the phase 1 fine-tuned models by themselves on the CTR prediction task. The columns labeled Phase 2 compare the result of passing inputs from the phase 2 fine-tuned models to the 3-layer MLP model.

Some results are unpopulated at this time, due to ongoing experiments. However, we observe that the use of M5 models produces an AUC lift of 434 bps over Ads BERT for phase 1 and an AUC lift of 238 bps over the Production model (according to partial results obtained after processing 15% of the second phase fine-tuning data).

|  | Phase 1 |  | Phase 2 |  |
| :---: | :---: | :---: | :---: | :---: |
| **Model** | **ROC AUC** | **Relative to Ads BERT** | **ROC AUC** | **Relative to Production** |
| Production Model | \- | \- | 79.23% | 0% |
| Ads BERT | 72.50% | 0.00% | 81.32% | 2.64% |
| M5 using CTR data | 76.84% | 5.99% | 81.61%\* | 3.00%\* |
| M5 using CTR/EIP data | 76.79% | 5.92% | \- | \- |

## 

## **Appendix D: Semantic Search**

The table below compares performance on the semantic matching task for a selection of 500MM parameter multi-modal and text-only M5 models which were fine-tuned on historical search log data. All models produce embeddings with arity 768 or 1024\. Where noted (projection to 256\) we scaled these representations down to 256 elements. In all cases, a DSSM model was used to generate query representations of matching arity to the ASIN representations. 

Compared to our previous MBR in which none of our models were competitive with the reference DSSM model as measured by behavioral metrics, we are now able to achieve MAP and recall scores which are just slightly worse (weighted recall of 0.852 vs 0.878 and weighted MAP of 0.511 vs 0.518). We note that the discrepancy in unweighted metrics is larger than in weighted metrics which is perhaps a result of differences in training on search log data. Compared to the DSSM model, M5 models use unweighted training and treat clicks instead of purchases as positives. 

More importantly, we are able to improve the number of exact results relative to the reference DSSM model by 760 bps from 67.1% to 74.7%. Our best 768-dimension multi-modal model improves %Exacts@16 in comparison to the DSSM baseline from 66.7% to 72.6%. However, it performs worse than the best 1024-dimension ASIN text-only model, which is able to achieve 74.7% Exacts@16. We note that both models perform slightly worse than the DSSM model in Recall@100 and Mean Average Precision (MAP) measured on historical purchase data.

| Embedding Dimension | ASIN Transformation | Pre-Training Data | Embedding Generation Data | Embedding Pooling | MAP (Weighted / Unweighted) | Recall@100 (Weighted / Unweighted) | %Exacts  |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 256 | DSSM | N/A | Title | N/A | 0.507/0.456 | 0.87/0.878 | 65.90% |
| 768 |  |  |  |  | **0.518/0.465** | **0.878/0.886** | 66.70% |
| 1024 |  |  |  |  | 0.515/0.467 | 0.874/0.885 | **67.10%** |
| 768 | \- | N/A | Title | avg | 0.333/0.334 | 0.651/0.685 | 65.60% |
|  | Projection to 256 |  |  |  | 0.438/0.372 | 0.777/0.763 | 64.40% |
| 768 | Projection to 256 | Title/Bullet/ Structured | Title | cls | **0.5/0.411** | **0.849/0.839** | 70.80% |
|  | \- |  | Title/ Description |  | 0.432/0.389 | 0.803/0.815 | **72.60%** |
| 1024 | Projection to 256 | Title/ Description | Title |  | **0.511/0.398** | **0.852/0.815** | 67.60% |
|  | \- | Title/ Description | Title/Bullet/ Structured |  | 0.404/0.389 | 0.768/0.797 | **74.70%** |

## 

## **Appendix E: Model Design and Fine-Tuning**

### **Multi-lingual models** We collected a new 9-language, 14-locale multilingual dataset consisting of 22B ASINs and trained our first very-multi-lingual model on this dataset. The 9 languages included are: English, French, German, Italian, Japanese, Portuguese, Spanish, Turkish, and Arabic, sourced from 14 locales: AE, BR, CA, DE, ES, FR, IN, IT, JP, MX, SA, TR, UK, US. To train this model we manually balanced ASIN data across languages and locales to ensure that no language represents over 25% of the data and all languages represent at least 5%. In the coming month, we will evaluate multinomial sampling as a strategy for balancing languages. Compared to our English-only multi-modal model, the multi-lingual text-only model achieves only a slight reduction in ROC-AUC from 0.946 to 0.941 and in PR-AUC from 0.881 to 0.877 on English duplicate detection. The performance on Spanish and German is somewhat worse. One reason for the difference is that our multi-lingual duplicate detection training data contains unicode encoding errors. We note that our results on the duplicate detection task are slightly better than a larger public model pre-trained on 7x more training examples indicating that pre-training a language model on public data is unnecessary for this task. 

| Language | Model | Model Size | Pre-Training Data | Pretraining Data Attributes | Fine-Tuning Data | Fine-tuning Test RoC-AUC | Fine-tuning PR-AUC |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| EN | XLM-Roberta-large | 560M | Public datasets | N/A | Title/Bullet/ Description | 0.941 | 0.871 |
|  | M5 | 500M | 9 language, 16 locale ASIN data | Title/Bullet/ Description | Title/Bullet/ Description | **0.941** | **0.877** |
| DE | XLM-Roberta-large | 560M | Public datasets | N/A | Title/Bullet/ Description | 0.893 | 0.711 |
|  | M5 | 500M | 9 language, 16 locale ASIN data | Title/Bullet/ Description | Title/Bullet/ Description | 0.893 | 0.716 |
| ES | XLM-Roberta-large | 560M | Public datasets | N/A | Title/Bullet/ Description | 0.919 | 0.737 |
|  | M5 | 500M | 9 language, 16 locale ASIN data | Title/Bullet/ Description | Title/Bullet/ Description | 0.922 | 0.739 |

### 

### **Multi-task models** Our initial implementation of multi-task training uses an approach called multi-task pre-fine-tuning. This approach starts with an ASIN MLM pre-trained model and then pre-fine-tunes the model on two additional tasks: product type classification and duplicate detection. For both tasks we use high-quality datasets provided by the Catalog team. The datasets are relatively small in comparison to the pre-training data, with \~900K and \~3M rows each (this size discrepancy was the primary reason for pursuing this approach as opposed to true multi-task pre-training). After pre-fine-tuning, we performed standard fine-tuning on the duplicate detection task. We observed that pre-fine-tuning followed by fine-tuning reduces performance on the duplicate detection task from 0.945 to 0.929.   In the coming month we will focus on collecting data for additional supervised and unsupervised or self-supervised tasks. The latter tasks will have sufficient data to be useful during pre-training. In addition, given that we support a variety of downstream tasks, we will focus on both single-ASIN tasks and pairwise-ASIN tasks. Some proposed single-ASIN tasks include attribute extraction (extract a given attribute from the ASIN text), product type classification, and ASIN corruption classification (identify if one or more of the ASIN attributes have been corrupted). Some proposed pairwise-ASIN tasks include near duplicate or close match classification, ASIN co-view prediction (ASINs that are viewed by customers in the same session), and ASIN co-purchase prediction (ASINs are purchased by the same search query).

## **Appendix F: Model Distillation**

The table below measures the inference speedup observed after distilling a 500MM parameter teacher model which was fine-tuned on the duplicate detection task to a 70MM parameter student model with and without int8 dynamic quantization. We set the input sequence length to 512, and the number of CPU threads to 30\. We observe a 42.6ms inference latency on C5 instances for a quantized student model, which is comparable to the latency we observe for the teacher model on P4 instances. This implies that while GPUs still dominate in terms of throughput, we are able to achieve satisfactory latencies to support offline applications on CPU instances.

| Instance Type | Model | Batch Size | Speedup vs Teacher | Latency (ms) |
| :---: | :---: | :---: | :---: | :---: |
| c5.24xlarge | Quantized Student | 1 | 10.63x | 42.6 |
| c6g.16xlarge | Quantized Student | 1 | 10.9x | 194.3 |
| r5.24xlarge | Quantized Student | 1 | 6.21x | 79.52 |
| m5.24xlarge | Quantized Student | 1 | 7.96x | 73.85 |
| g4dn.16xlarge | Student | 1 | 10.04x | 18.11 |
|  | Student | 32 | 9.33x | 19.48 |
| p2.8xlarge | Student | 1 | 10.70x | 38.10 |
|  | Student | 64 | 11.49x | 35.46 |
| p3dn.24xlarge | Student | 1 | 8.09x | 7.63 |
|  | Student | 128 | 10.96x | 5.64 |
| p4d.24xlarge | Student | 1 | 5.93x | 7.25 |
|  | Student | 256 | 29.44x | 1.46 |

The table below compares student, teacher, and quantized student models in terms of memory requirement. The addition of model quantization improves spatial overheads without introducing a meaningful difference in accuracy.

| Model | PR AUC | PR AUC Gap | ROC AUC | ROC AUC Gap | Model Size on Disk (MB) |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Teacher | 77.60% | \- | 89.60% | \- | 2,052.30 |
| Student | 76.70% | 0.90% | 88.40% | 1.20% | 272.43 |
| Quantized Student | **76.30%** | **1.30%** | **88.20%** | **1.40%** | **187.52** |

## **Appendix G: Goal Updates**

\[GREEN\] **S-Team [270900](https://kingpin.amazon.com/#/items/270900) \- Launch at least 3 ML models using M5 representations by 11/30**

As of 3/5/21 we are green because we are on track to meet our 3/31/21 goal to train a multi-lingual, multi-locale, multi-modal M5 model on text and structured data from at least 10 locales and at least 10 languages with 5 partner tasks (ASIN duplicate detection, semantic matching, CTR prediction, brand classification, ASIN attribute coverage) and are tracking ahead of plan for duplicate detection and semantic matching. We have built the infrastructure necessary to train a 1.5B parameter BERT-style transformer model at a one day cadence at a cost of less than $2K. These models can be trained on both text data (title, description, bullet points), and structured data (e.g. attribute/value pairs), and are used to generate ASIN representations for application partners 3—5 times per week. We have established regular experiments with all 5 of our partner teams. Offline evaluations indicate that using M5 representations from a fine-tuned 500MM parameter multi-modal model improves the existing production baseline on the catalog de-duplication task by 70—700 bps across hardlines, softlines, consumables, and media categories. We have also developed the ability to distill a 500MM parameter M5 model to 70MM parameters to produce a latency reduction of 10x with an accuracy loss of only 1.6% on the duplicate detection task. We are working with ASCS to determine requirements and establish pipelines to launch this in production ahead of our projected first partner launch on 9/30/21.   
We finished training a multi-lingual vocabulary for ten languages in fifteen locales: Dutch (NL), English (NL, US, UK, CA, IN, AE, SA), French (FR), German (DE), Italian (IT), Japanese (JP), Portuguese (BR), Spanish (ES, MX), Turkish (TR), and Arabic (AE, SA). We will use this vocabulary to train our first model on data from all ten languages in all fifteen locales by 3/8/21. We will use this multi-lingual, multi-modal model to generate ASIN representations which will power the first semantic matching weblab to use M5 technology in April. This will put us ahead of schedule for our 5/1/21 goal of dialing up a weblab with at least one partner team which does not require online inference.

\[GREEN\] LT \#273867 **Launch an ML model that incorporates M5 embeddings to map ASINs to brand entities in US, UK, DE, FR, IN marketplaces by 11/30.**

As of 3/5/2021 we are green because our M5 models have comparable accuracy (97.17 baseline vs 97.16 M5) on existing fine-tuned models for English. Our recall@95 is slightly lower (88.04 vs 85.91 M5). However, this recall is calculated over a very small dataset. We expect to observe similar recall over a larger test set. As next steps, we will evaluate our multi-lingual model for UK, DE, FR and IN. In parallel, we are starting our work on taking M5 models to production with the Catalog team.

\[GREEN\] LT \#270645 **Launch an ML model that incorporates M5 embeddings to identify duplicate ASINs in US, UK, DE, FR, IN marketplaces by 11/30.**

As of 3/5/2021 we are green because M5 embeddings are performing better than baseline ASIN embeddings showing between 112-984 bps improvement in the precision and recall metric (PR-AUC) versus production for English language duplicate detection. Our multi-modal model also outperforms the more complex ensemble baseline model on all categories except media. As immediate next steps, we are working with Catalog team to chart out a path for consuming M5 embeddings in their ensemble model. In parallel, we are also working out the process for replacing their ensemble model with our multi-modal M5 model. After our M5 multi-lingual model is trained completely, we will evaluate the performance in UK, DE, FR and IN. 

\[GREEN\] LT \#270649 **Launch ML models that improve search quality in UAE, and one of TR and MX using semantic search powered by M5 representations by 10/30.**

As of 3/5/2021 we are green because M5 models show a 760 bps increase in exact matches in the top 16 search results for English ASINs in UAE. We are training a multi-lingual model across 9 languages and 16 locales for supporting UAE, MX and TR weblabs. We expect to weblab the multi-lingual model in April.

\[GREEN\] LT \#270648 **Launch one Sponsored Products Click-through-rate Prediction (CTR) model which uses M5 (be multi-entity, multi-modal, multi-lingual, multi-locale, and multi-task ) ASIN embedding to drive improvement of shopper engagement.**

As of 3/5/2021 we are green because M5 models show an increase of 238 bps over the production baseline. After we have established better results, we will work with sponsored product team to take the model to weblab.

\[GREEN\] LT \#270652 **Increase ASIN coverage of Top 8 query attributes to at least 70% with at least 85% precision in DE, JP, IT, EN, and FR using M5 representations by 11/30.**

As of 3/5/2021 we are green because we have received the attribute prediction dataset from the KPEX team. The QU team has identified the key attributes that they wish to improve coverage for and we have started fine-tuning models for these attributes. We will begin round-trip evaluations with the DU team starting in March.

\[GREEN\] LT \#283674 **Vend access to ASIN representations generated by M5 models through the Catalog Team’s Universal Feature Catalog (UFC) to 5 partner teams. Provide an interface for partner teams to provide fine-tuning data and to select from a small set of pre-built fine-tuning strategies for customizing these representations to downstream tasks.**

As of 3/5/2021 we are green as we have identified winning models that can be vended and used. We are working with UIFC team to create an automated pipeline for model releases and the associated ASIN embeddings. We will have an initial pipeline working by 5/31/21 and a more robust system by 8/31/21.

\[GREEN\] LT \#270621 **Reduce the dollar cost required to train a 1.5B parameter model at a one day cadence to less than $2K using AWS P4 instances, advances in systems engineering, and improved algorithm design.**

As of 3/5/2021 we are green as our current models take about 1.25 days to train and cost around $2,100 for a single training run using 96 P3dn.24xlarge ($2800 using 16 P4s). We expect further improvements to both speed and cost through DeepSpeed optimizations (Zero-Offload), model improvements and PyTorch improvements.

\[NOT STARTED\] LT \#273858 **The M5 team will build a POC implementation of model training which (1) demonstrates a 4.2x (at 35% hardware efficiency) improvement in the dollar cost required to train a GPT-3-scale 100B parameter model at a one day cadence and (2) is presented at ReInvent 2021\.**

As of 3/5/2021 not yet begun.

\[NOT STARTED\] LT \#270662 **Deliver 3-5 submissions based on M5 technologies in top-tier peer-reviewed machine learning and retrieval conferences.**

As of 3/5/2021 not yet begun.

\[NOT STARTED\] LT \#283716 **Vend access to M5 query representations through QUZen to one partner team. These representations should be made accessible with a p99 latency of 25ms.**

As of 3/5/2021 not yet begun.

\[NOT STARTED\] LT \#270626 **Use M5Vend to provide distilled M5 models to the UIFC team for vending and fine-tuning. M5Vend is a Python-based toolkit being developed by AWS which supports “import M5.model-style" access to M5 models. M5Vend will provide a set of easy-to-use tools for performing inference, distillation, and fine-tuning in a platform agnostic fashion.**

As of 3/5/2021 not yet begun.