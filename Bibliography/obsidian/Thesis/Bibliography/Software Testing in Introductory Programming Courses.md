#Software-testing_education #Software_testing #Education_research 
* The paper starts by stating that we are *graduating students from computing programs who have deficiencies in software testing skills*;
* *[...] knowledge of testing can help students improve their programming skills*.*
* *The ACM/IEEE CS curricular guidelines point out some design aspects that vary in these courses, such as the institutional context (with different target audiences), the choice of programming paradigm and language, the platform (e.g. desktop/laptop, web, mobile devices), and the use of software development practices to support the programming activities (e.g. version control, refactoring, and design patterns).*
* The goal: *to investigate the integration of testing into this diverse context and provide an overview of the research performed in the area*.
* **Research Questions**
	* RQ1: Which topics have researchers investigated about software testing in introductory programming courses?
	* RQ2: What are the benefits and drawbacks about the integration of software testing into introductory programming courses?
* Methods: *automatic search in databases* and *a backward snowballing from this preliminary list to identify additional relevant papers*;
	* Due to *a high variability in the expressions authors use to refer to the teaching of programming and software testing in this context, we performed a frequency analysis of individual words from the titles, abstracts, and keywords of our reference list.*
	* The most frequent ones were arranged along three topics: programming, testing and educational context;
	* Exclusion criteria: duplicates or non-English papers; papers from before 2000;
* Classification Scheme
	* *We defined categories for two facets: investigated topic and evaluation method*.
	* *Investigated topics provides an overview of the area (RQ2)*. 
	* *Evaluation method* included categories used by Al Zubidy et al.: literature review, exploratory study, descriptive/persuasive study, survey, qualitative study, experimental, experience report, not applicable;
* Data extraction:
	* *year, publication venue, evaluation method, investigated topic, benefits and drawbacks of software testing in introductory programming courses*
* RQ1
	* Some topics: curriculum (integration of testing in the computing curriculum), teaching methods, course materials, programming assignments, programming process, tools, program/test quality, perceptions/behaviors, concept understanding;
		* Most were not applicable, experimental or experience reports.
	* Curriculum
		* *[...] the idea is to address testing earlier, beginning in introductory programming courses, by integrating testing practices into programming assignments*;
		* *design of a specific programming course with the integration of testing;
	* Teaching Methods
		* *Test-Driven Learning (TDL), which is a method to teach programming by introducing new concepts through unit tests.*
		* *the combination of TDD and the use of an automated assessment tool (Web-CAT) to leverage constant feedback as students submit their programs and test suites;
	* Course materials
		* *educational modules of software testing*;
		* *novice programmers should learn testing concepts*;
		* *how to adjust existing materials from a programming course to integrate software testing*;
	* Programming assignments
		* *guidelines to design, conduct, and assess programing assignments that include testing practices*;
		* *descriptions of particular assignments [...] and [...] information about the appropriate context to apply them*;
		* *there is the need to decide whether students should write test cases or work with instructor's tests;
		* *the problem specification should be clear enough so students are able to write tests*;
		* *testing is an inherent part of assessing students' programs*;
		* *It can ease the grading process, especially when using an automated assessment tool*;
		* *might be less feasible for summative assessment (test and exams)*;
	* Programming process
		* *aim to teach students a systematic approach to develop programs, which can be seen as a lightweight version of a software development process;
		* *The programming process can be easily overlooked in introductory courses, especially when students learn programming mostly by seeing examples of ready-made solutions.*
		* *[...] also learn how to stepwise create a solution for given problem and to reflect about their own development process*;
		* *the use of TDD [...] by novice programmers*
		* *TBC (Testing Before Coding), POPT (Problem-Oriented Programming and Testing) and STREAM (Stubs, Tests, Representations, Evaluation, Attributes and Methods)*;
		* *these processes addresses the testing activity from a high-level point of view, without giving details about how students should test their programs*
		* *two studies investigated the testing activity for novice programmers at a lower-level, focusing on test design and the use of testing criteria*
	* Tools (this is just keywords)
		* Supporting mechanisms to write and execute test cases;
		* Automated assessment systems
			* Submission and Testing systems;
			* Online judges;
			* Games;
			* Tutor systems;
		* Automated assessment utilities
			* Test automation;
			* Feedback;
	* Program/test quality
		* These accessed students' performance in programming assignments assessed by means of their submitted code;
		* Assessment is usually done in terms of *correctness* and *success rate of test suite(s)*;
			* Other metrics involved static analysis;
		* *When students are supposed to write tests in the assignments, the issue of assessing the quality of their test suites is raised. The most common metric is **code coverage**.*
			* *However, code coverage can overestimate test quality, since it is possible to achieve 100% coverage even when a test suite is not thorough, e.g. when the tests do not check for missing features in the program.*
			* *[...] other strategies like mutation analysis and all-pairs testing can provide more accurate metrics, though both are more computationally expensive.
	* Concept understanding
		* Not much here... The Canterbury QuestionBank has many multiple choice questions about programming fundamentals, 3% of which about testing;
		* A comprehensive review of concepts that should be assessed in introductory programming courses. *Testing appears under the category of programming process, along with other topics like debugging and design.*
	* Students' perceptions and behaviors
		* *Students' behaviors refer to what they actually do during programming assignments, in contrast with what they were instructed to do.*
		* *"happy-path" testing*
		* *[...] also studies analyzing multiple subsequent submissions for a given assignment, i.e. "snapshots" of students' programs and test suites. Process adherence (e.g. whether students are adopting test-first or not) and mechanisms to influence students' behavior can be investigated using this strategy*
* RQ2
	* Improvement in students' programming performance
		* *mainly in terms of program quality*;
		* *There are also findings indicating improvements in the resulting program design*;
		* *The papers argue the reason behind these improvements is that testing practices help developing students' comprehension and analysis skills*;
	* Feedback:
		* *test results can provide students useful information about their programming and testing performance before the assignment deadline*;
		* *This issue of providing feedback to students is recurrent in the motivation for using automated assessment tools.*
		* *Automated feedback may decrease the amount of help students need from the instructor. Moreover, since testing drives students to self-validate their work, it can help them make progress when they are stuck or recognize when they need help from the instructor.*
	* Objective assessment
		* *testing results provide an objective and consistent way to assign grades to the assignments*
		* *This benefit of testing is also frequently discussed in the selected papers about supporting tools. Besides helping in the grading process, the assessment through testing also helps students to better understand the correctness requirements of assignments.*
	* Better understanding of the programming process
		* *when software testing is introduced, students learn a simplified version of the development process*;
		* *students have an opportunity to learn the mechanics of the activities of programming and testing together*
	* **Drawbacks
		* Additional workload of course staff;
		* Students' testing performance: *studies report the lack of proper testing by students*; *most check common program behavior, leaving out courner cases that would be crucial to reveal the presence of defects*;
			* *many testing ideas require previous knowledge and skill in programming, which students are also still acquiring in programming courses*;
			* *the main difficulty may be related to students writing their own test cases*;
		* Students' reluctance to conduct testing (*negative attitude towards software testing*);
		* Programming courses are already packed.
* Discussion (paraphrased)
	* Most papers are about tools, very few about course materials and concept understanding;
		* More course materials, less staff work;
		* More research in programming process and concept understanding could be beneficial;
	* Most papers are not applicable or experience reports;
		* Experience reports are not planned, so the conclusions are biased towards the researcher's perceptions;
		* Not applicable papers lack evaluation of their proposals;
	* TDD testing is very covered;
		* It's argued it should be used in all programming assignments;
		* Even mechanisms to motivate students to apply TDD were studied.
* Conclusions
	* Benefits and drawbacks should spawn more investigation.
	* A significant amount of studies lack a planned evaluation. This is concerning.
	* Threats to validity: only 1 person did all the steps of the study, measures were taken against bias. 
	* Future work: investigate, in detail, the variables involved in the integration of testing into programming courses; a systematic review of a subgroup of the selected papers (empirical studies);
	