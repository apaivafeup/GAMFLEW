#Software_testing #Software-testing_education #Software-engineering_education #Education_research #Systematic_literature_review #Systematic_literature_mapping
* Software systems are universal and only getting bigger and more complex, requiring cost-effectiveness and sophisticated quality;
* Software testing is crucial in assuring software quality;
    * Removing defects from software is usually around 50% of the development costs in a typical software project;
* There is a need for a highly-skilled software testing work-force in the industry, as there is a _shortage of software testers_;
    * Quality trumps quantity, here.
* Since it’s not possible for the individual educator to read and analyze all papers and synthesize its associated evidence, a systematic review is needed;
* Two sides to the same coin: universities need software-testing education, industry need software-testing training;
    * There are varying degrees of opportunity to learn software testing during university studies;
    * Many professionals self-learn software-testing;
* Other work…
    * Focuses on TDD in testing education, associated challenges and frameworks;
    * Synthesizes challenges of integrating software testing: how programming and testing should be connected, how to deal with students who do not appreciate software testing, how testing should be conducted in programming assignments, how to help students become better at testing, choosing appropriate tools;
    * Recently, gamification has been pointed out to make the software testing more interesting and less tedious for students;
* The main objective: provide a holistic view to the body of knowledge on software testing education;
    * Relevant stakeholders: new and also experienced testing educators, education researches in this area, whose needs include teaching a new course in testing - it’s relevant to know about challenges, insights on how to tackle them, information on tools, to make it easier to find information (with the systematic literature review), to have a clear view on the state of the art to properly plan their actions;
    * Method: snowballing, searching, etc;
        * Out of scope, lack of experience or a longer version of the paper already being considered in the pool of studies were exclusion criteria;
* **RQ1: Contribution types and their frequencies**
    * Most were pedagogical approaches (how to teach better), proposing a specific tool for teaching testing or course-ware/ new course proposal without tool - in 4th, there’s gamification;
    * Findings:
        * focus on testing helps students learning introductory Java courses;
        * testing methods are impossible to understand without programming experience;
        * depth of programming practice is also a factor;
        * Maybe hard for a student to see how testing is valuable when a project is of limited size - open-source projects are recommended by many, which also allow students to test code that they haven’t written themselves which could be more motivating;
        * Students must directly experience benefits from writing test suites - knowing tests will be graded is not enough;
        * There are specific tools, such as WebIDE, with pre-defined steps that force testing;
        * Gamification may increase motivation - reward points, badges, leaderboard, et cetera - there are games such as HALO (Highly Addictive SociaLly Optimized Software Engineering), Code Defenders, etc;
        * Empirical results show that improvement may come in code quality - code coverage is widely used, but not a good indicator of quality, so mutation analysis is also used often;
        * Many papers describe knowledge gaps in software testing: _More testing should be taught_, as there is a _general deficiency for all testing topics in practice activities_;
        * Many papers were easily grouped by the tools they boasted, but highlight: Test-Driven Development, multiple submission, automated feedback (code style, correctness, testing quality), _students may correct their code and resubmit without punishment_;
        * Code Defenders also gave positive results initially, at least;
* **RQ2: Classification of Studies by Research method Types**
    * Only three categories, in this order: Experience / Informal evaluation, Experiment / Empirical Study, Idea / Approach Proposals only;
* **RQ3: Data Sources**
    * Surveys, Student written software and tests, Interviews with students, Others;
* **RQ4: Research questions or hypothesis studied in the papers**
    * Most explicitly state RQs or hypothesis, and most go for RQs rather than hypothesis;
    * They were classified from anecdotes on practice to systematic reviews with recommendations for practice;
* **RQ5: Technical Aspects of Testing: Type of Test Activities Covered in The Course(s)**
    * In order, the most frequent are: test execution, test-case design (criteria based), generic software testing, test automation, other test activities, test evaluation, test-case design (human knowledge based), test process, planning and management;
* **RQ6: Scale of the Educational Setting Under Study**
    * Most papers seemed to use courses as a basis for the published papers - most papers only covered 1 course, about half covered 2, only 10 covered 3 and around 4 covered three or more each;
* **RQ7: Different Approaches to Testing Education**
    * In ⅓ of the papers, there was a dedicated course on software testing, but most cases showed testing was part of a regular programming course;
        * A dedicated course allows more time and resources to cover the complex subject of testing, while it might face challenges in motivating students;
        * What is learned on a single course may be easily forgotten if it’s not used nor required in any following course;
        * Many authors have states a single testing course is NOT ENOUGH;
        * Software testing should become a common task in a curriculum;
        * Using certain tools may also be challenging, or even make others accept and adopt approaches;
* **RQ8: Theories and Theory use in software-testing education**
    * _Ideally papers with no evidence and no argument should not be published;_
    * _Experience papers are the most common type of papers in CS education literature_;
    * One 8/204 used theories;
* **RQ9: Empirical Evidence / Findings**
    * Challenges:
        * ensuring students overcome negative bias to discover benefits of functional testing, testing often not well accepted among students + low motivation (they don’t like learning it, it’s often called tedious and boring, exposing flaws in their own programs isn’t satisfying for them, testing seen as tangential to what really matters);
        * instilling a desire in students to learn about testing and practice it;
        * tool-related challenges (for automated testing, for example - may result in students being overwhelmed, testing methods are impossible to understand without programming experience, both instructors and students may be frustrated with the lack of support provided when selecting appropriate testing tools;
        * Increased cognitive load for learning testing - aka, needing to shift perspectives to understand testing and adopt a more positive approach to testing methods (like for TDD);
            * Especially challenging to learn software testing skills in the first year of CS courses considering they also need to learn to program;
        * Alignment with industrial skill-set needs (theory vs. practice): hard to keep a testing course up-to-date with the novelties of the field as well as making realistic exercises, university courses seem lacking in practical knowledge or experience - software-testing education is entirely too theoretical with a lack of practical scenarios to show students how to apply concepts and how software testing would have an impact in the medium and long term; disconnection between theory and practice leads to reduced interest by students (using real software projects would help, or implementing the right projects to use in software-testing education is not trivial);
        * Issue of _scale/complexity_: sometimes testing isn’t done because the project is so small, making it very costly to be rigorously implemented; _learners need constant and concrete feedback on how to improve their performance on testing_;
            * Stronger students prefer freedom, tho;
        * Time and resource constraints: not enough time to teach testing in courses, as it is challenging to evaluate thousands of assignments within limited time;
        * Challenges related to assessing students’ work: the negative side of gamification might be students “gaming” the assessment system - _care must be taken to avoid an observed tendency to approach assignments in a tick list fashion_; _dire need to evaluate the quality of test cases automatically_;
        * Challenges to integrate software testing in other courses: when there isn’t a compulsory testing course, it’s hard to integrate it into existing courses, as it is challenging to determine the optimal progressing through a SE course structure in regard to testing;
        * Other challenges: _textbooks do not cover test automation very well, difficult to interest student programmers in thoroughly testing their own programs since every fault found represents a psychological blow to their programming ego_;
    * Insights:
        * Many students expressed particular strong reticence to follow TDD when they were confident in their programming skills (testing is for fixing process, not avoid them in their mind);
        * Students placed a strong emphasis on extrinsic motivation such as grades;
        * Reuse of test cases during introductory programming courses may help to increase the quality of the programs generated by students; those who write good defensive programs are also good at writing effective attack programs;
        * Gamification is a promising initiative to improve the experiences of learning about testing - making it fun!
        * _Easier to convince a programmer to test someone else’s code rather than try to convince them that their code requires testing;_
        * _Peer review, peer testing _is an activity in which students try to break code written by peers, making testing competitive - guess lectures can be good too!
        * _Students need to directly experience benefits from writing test suites. Requiring students to write test cases simply because test suite quality will be graded does not help students learn the value of testing_;
        * Testing tends to move students towards a reflective approach to programming and away from a trial and error approach;
        * _Stellar perforamnce on examinations doesn’t mean that students can transfer the knowledge beyond the classroom_;
        * _It’s imperative to limit the scope and depth of the course. Software testing is too wide a field to be covered in one single course, much less for people who do not have a computer science background;_
        * _Testing tools are indispensable;_
        * _Use popular, widely used testing tools rather than tools designed for education in order to teach students the correct use and configuration of real environments_;
        * Integrating the teaching of software testing into other courses, particularly programming courses: _an incremental, just-in-time introduction of testing practices would work better than a separate course_;
        * _A need to integrate software-testing with other disciplines along the CS undergraduate courses_;
        * _Purely testing-oriented projects that let students focus on thai part of software development… Educators might need to consider providing additional courses solely focused on testing_;
        * _The majority of students do not have the level of understanding required by industry to test their systems_; _Their understanding of the tests used by industry is not in line with those of industry_;
            * _Students need the opportunity to put what they learn into practice using testing techniques and tools at all levels from the individual unit to the system as a whole;_
        * _TDD is useful in education as it provides the students with timely feedback during development adn helps them complete assignments using small focused steps; students particularly struggle with TDD because its approach is almost like working backwards - it requires a change in thinking_;
        * _TDD _is not cost free and requires knowledge of testing frameworks and skills in their use, an understanding of refactoring, and an unlearning of old habits;
        * Pre-class readings from an appropriate textbook facilitate the learning process;
        * Project-based learning within small groups dramatically improved their team-work and communication capabilities;
        * Our students need more math background;
        * Increasing the realism of testing can lead to more complexity and scale, which can increase the cognitive load on students, require more resources of instructors and therefore reduce available resources;
* **Discussion**
	* Fewer courses are teaching exploratory test-case design, yet it’s quite popular in industry_;_
    * A testing framework is needed;
    * Seek ways to motivate students to learn about software testing and to change students’ attitudes towards and their expectations of the reasons for, and value of, software testing;