#Software_testing #Software_industry #Challenges #Opinion_survey

* Software testing is an importante phase to ensure developing high-quality software;
* There is a high industry need for more improvements in effectiveness and efficiency of software testing;
* Industry and academia have been progressing in a disjoint manner;
* The article characterizes industry challenges, proceeds to classify them and analyse them, et cetera;
* **Background**
    * Growing number of tests as a software under test evolves;
    * Google returns 185M hits for _challenges software testing_;
    * _Cem Kaner_
        * Complete testing is impossible;
        * Testers misallocate resources because they fall for the company’s process myths;
        * Test groups operate under multiple missions, often conflicting, rarely articulated;
        * Test groups often lack enough skilled programmers, and a vision of appropriate projects that would keep programming testers challenged;
    * Effective testing is a quest, and, like any quest, includes intellectual challenge, passionate debate and the excitement of discovery;
    * _Systematic testing _is perceived as a luxury;
    * Testing impacts the whole life cycle - required preparation, modeling and documentation;
    * On automation: automated GUI testing tools aren’t stable, automation scope, need for better techniques/metrics for deciding what should be tested, complexity of maintaining and documenting test plans and results;
    * _Safe and fault-free behavior _assuring isn’t solved yet;
    * Motivating personnel:
        * Conformance in the sync deterministic case;
        * Conformance in presence of non-determinism;
        * Requirements tracing to the model;
        * Automated compilation of traceability data;
        * Test case selection according to criticality;
    * Maritime safety:
        * need to accept the integration of large systems;
        * Ability to reconfigure them at runtime;
    * Risk-based testing:
        * Risk ratings were subjective estimates and the interview participants felt not confident to express these estimates on a more fine-grained scale other than high, medium or low;
* **Goal: **explore and characterize industry’s challenges in software testing, so as to be able to identify areas which may need further work by researchers and to encourage more collaborations with the industry on real industrial needs in testing;
    * RQ1: Challenges in test activities;
    * RQ2: Classification and root-cause analysis;
    * RQ3: How do industrial challenges relate to the recent focus of academia?
* **Research method:**
    * Potential problems: lack of common understanding of questions among subjects, bias introduced by researches, insufficient questions to test consistency for constructs across multiple questions, ordering of the questions - all were addressed in some way;
    * The length of the survey was also very much considered;
    * Non-probability sampling method;
        * Convenience sampling;
        * No snowball sampling;
    * 72 data points;
* **Results**
    * **Demographics**
        * Most were from Turkey, Germany, Denmark and Canada;
        * 8 total countries; 
        * Good mix of both junior and senior software testers (around 5-15 years);
    * **Challenges**
        * For the majority, the respondents reported low levels on challenges in testing activities;
        * Histograms in all activities tended to be left skewed - this was attributed to high maturity of respondents, simplicity of testing tasks or unawareness of difficulty;
        * The highest activities are: test management, automation and other test activities have been generally rated higher by practitioners;
        * Test execution is seen as less of a challenge - when automation is present, it shifts into test scripting;
        * Most practitioners know names of test-case design techniques but cannot or do not apply them rigorously - general lack of knowledge, lack of awareness regarding systematic test-case design techniques, or lack of resources;
        * Mutation-testing have limited usage in industry;
        * Test automation may be perceived as particularly challenging;
        * Challenges slowly decrease with increasing work experience as supported by a weak negative correlation;
        * _Classification_
            * Categories were: concrete/real software testing research challenges; non-technical challenges or challenges outside testing; unclear responses, too generic, or not really challenges;
            * Non-technical challenges has subcategories: due to lack of knowledge, training, low maturity or awareness  about testing; due to resource constraints; technical challenges outside testing and other challenges;
            * Communication between developers and clients can be a problem is an example of “non-technical challenges outside testing”;
            * 61.9% of challenges were concrete/real software testing research challenges out of the 9 test activities studies and 26.2% were challenges outside testing;
            * 29 challenges out of 44 challenges outside testing were attributed to lack of knowledge, 5 to resource constraints, 8 to technical challenges outside testing and 2 to non-techincal challenges outside testing;
            * The community sees the need for better software testing education and training as many practitioners still admit to not have reach high test maturity in their teams (mostly due to lack of training);
            * Top 3 challenging areas are test automation, challenges in the group of other testing areas and test management and test design;
        * _Academia and Industry_
            * There is a slight shortage of research on test automation both in web application testing and testing embedded software (used as a snapshot for the level of activity of academia surrounding testing);
            * Academia works on long-term research problems, while industry faces challenges to increase efficiency and effectiveness of testing via approaches such as test automation;
            * Low industry-academia collaboration in SE in general and in software testing in particular;
                * The lack of this…:
                    * hurts researchers since their research topics tend to have low practical relevance, their research output doesn’t get the cane to have industrial impacts and most papers are only read and cited by a few other researches only;
                    * It also hears the software industry as they do not get the opportunity to use novel SE techniques developed in academia for improvements and innovation in industry;
            * Academic work on automated approaches is mostly concerned with test-case generation and test oracles;
            * Management issues and testing in the context of agile development are hot topics, along with mobile testing, cloud testing and performance testing;
            * The topic of testing in context of continuous integration and delivery is a popular topic in industry;
            * Researchers in academia feel excited by theoretically challenging issues such as combinatorial testing and search-based test-case design, while practitioners just seek ways to improve effectiveness and efficiency of testing, not to use fancy methods and techniques that would be too complicated and time-consuming to implements and deploy;
            * Model-based testing is popular in academia and is only relevant in specific industry sectors, such as automotive software;
            * Mutation testing attracts low attention in industry;
    * **Discussion**
        * Test management, test automation are the top 2 most challenging;
        * Test-case design, test execution, evaluation and test-result reporting have been seen as less challenging;
        * Practitioners need guidance to select appropriate testing approaches for a given context when considering ROI;
        * General shortage of studies of ROI in relation to testing approaches;
        * Meta-studies on the effectiveness and efficiency of testing approaches based on primary studies, to help with decisions;
        * Efficacy vs. effectiveness (controlled vs. real-world environment);
        * Key challenges for test automation: maintenance of test automation scripts, devising proper strategies for test automation across the entire test process, decision-support for choosing test frameworks;
        * Key challenges especially arise at the interface of test automation and management;
        * Challenges, in practice, often arise in thee context of continuous co-evolution of software systems and their test suites, which is also related to test automation maintenance, and also when deploying testing new software systems in the presence of existing legacy software systems;
        * _State of software-testing practice_
            * Is industry doing the right things?
            * is industry doing things well-enough?
            * The answer is: it depends;
            * Varying spectrum of test maturity among companities;
                * Low maturity -> more challenges;
            * It is generally true that systems have high quality - the authors oppose the CHAOS reports;
            * They agree with Robert Glass: we entered the golden age of computing in 1994;
            * The software industry is doing reasonably right things in testing;
    * _Implications_
        * _Researchers _may get insights to the level of challenges of different test activities;
        * Practitioners may review the level of challenges, and be motivated to study more papers on academic literature and start new collaborations with researchers;
        * Then the authors decide to shade other researchers:
            * perceive industry problems as is;
            * research in industry is expensive - they need to be aware of that;
            * timespan for industry is usually always reduced;
            * make it readable for laymen;
            * make sure tools are available to practitioners;
            * pay more attention to deployment and dissemination of results;
            * be more open to the actual problem being solved;
        * All limitations are named and addressed;
    * _Conclusions:_
        * Despite its importance and the vast amount of resources invested, few research results are adopted by industry; 
        * At the same time, the software industry is in dire need of better support for testing its software withing the limited time available;
        * Characterizing industry’s challenges in SE applied research enable more applieed research in SE;
        * Industry adn academic focus areas in software testing are disjoint;
            * Researchers want to stroke their ego by going for theoretically challenging issues, while practitioners want to improve effectiveness and efficiency of testing;