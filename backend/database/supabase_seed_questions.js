// database/supabase_seed_questions.js
// Seeds coding_problems + quiz_questions into Supabase
// Run: node database/supabase_seed_questions.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

const QUIZ_NAME = 'General Aptitude & Technical Quiz';

const PROBLEMS = [
    { title: 'Two Sum', difficulty: 'Easy', max_score: 100, description: 'Given an array of integers nums and integer target, return indices of the two numbers that add up to target.', examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0, 1]' }], constraints: ['2 <= nums.length <= 10000', '-1000000000 <= nums[i] <= 1000000000', 'Exactly one valid answer'], starter_python: 'def two_sum(nums, target):\n    # Write your solution here\n    pass', starter_java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write solution\n    }\n}' },
    { title: 'Reverse a Linked List', difficulty: 'Medium', max_score: 150, description: 'Reverse a singly linked list and return the head of the reversed list.', examples: [{ input: '1 -> 2 -> 3 -> 4 -> 5', output: '5 -> 4 -> 3 -> 2 -> 1' }], constraints: ['0 <= nodes <= 5000', '-5000 <= Node.val <= 5000'], starter_python: 'def reverse_list(head):\n    prev = None\n    # Write your solution\n    pass', starter_java: 'public ListNode reverseList(ListNode head) {\n    // Write here\n    return null;\n}' },
    { title: 'LRU Cache', difficulty: 'Hard', max_score: 200, description: 'Implement an LRU (Least Recently Used) cache with O(1) get and put operations.', examples: [{ input: 'capacity=2, put(1,1), put(2,2), get(1)', output: '1; then put(3,3) evicts key 2' }], constraints: ['1 <= capacity <= 3000', '0 <= key <= 10000', 'At most 200000 calls'], starter_python: 'from collections import OrderedDict\nclass LRUCache:\n    def __init__(self, capacity):\n        pass\n    def get(self, key):\n        pass\n    def put(self, key, value):\n        pass', starter_java: 'class LRUCache {\n    public LRUCache(int capacity) {}\n    public int get(int key) { return -1; }\n    public void put(int key, int value) {}\n}' },
    { title: 'Valid Parentheses', difficulty: 'Easy', max_score: 100, description: 'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid.', examples: [{ input: 's = "()[]{}"', output: 'true' }, { input: 's = "(]"', output: 'false' }], constraints: ['1 <= s.length <= 10000', 's consists of parentheses only'], starter_python: 'def is_valid(s):\n    # Stack-based approach\n    pass', starter_java: 'public boolean isValid(String s) {\n    // Stack\n    return false;\n}' },
    { title: 'Merge Intervals', difficulty: 'Medium', max_score: 150, description: 'Given an array of intervals, merge all overlapping intervals and return the result.', examples: [{ input: '[[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' }], constraints: ['1 <= intervals.length <= 10000', 'intervals[i].length == 2'], starter_python: 'def merge(intervals):\n    pass', starter_java: 'public int[][] merge(int[][] intervals) {\n    return new int[][]{};\n}' },
];

const QUESTIONS = [
    // Data Structures
    { question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'], correct_index: 1, explanation: 'Binary search halves the search space each step giving O(log n).' },
    { question: 'Which data structure uses LIFO order?', options: ['Queue', 'Stack', 'Heap', 'Tree'], correct_index: 1, explanation: 'Stack follows Last-In-First-Out.' },
    { question: 'Which data structure uses FIFO order?', options: ['Stack', 'Queue', 'Graph', 'Tree'], correct_index: 1, explanation: 'Queue follows First-In-First-Out.' },
    { question: 'What is the worst-case time complexity of Quick Sort?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correct_index: 2, explanation: 'When pivot is always the smallest or largest element, Quick Sort degrades to O(n^2).' },
    { question: 'Which sorting algorithm is stable and has O(n log n) in all cases?', options: ['Quick Sort', 'Heap Sort', 'Merge Sort', 'Bubble Sort'], correct_index: 2, explanation: 'Merge Sort is stable and always O(n log n).' },
    { question: 'What is the time complexity of accessing an element in an array by index?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n^2)'], correct_index: 2, explanation: 'Array index access is O(1) — direct memory address calculation.' },
    { question: 'In a min-heap, the root contains:', options: ['Maximum element', 'Minimum element', 'Median element', 'Random element'], correct_index: 1, explanation: 'Min-heap property: parent is always smaller than children, so root is minimum.' },
    { question: 'What is the height of a balanced binary tree with n nodes?', options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'], correct_index: 1, explanation: 'A balanced binary tree has height O(log n).' },
    { question: 'Which traversal of a BST gives sorted output?', options: ['Pre-order', 'Post-order', 'In-order', 'Level-order'], correct_index: 2, explanation: 'In-order traversal (left, root, right) of a BST gives sorted ascending order.' },
    { question: 'What is the time complexity of inserting into a hash table (average case)?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n^2)'], correct_index: 2, explanation: 'Hash table insertion is O(1) average case with a good hash function.' },
    { question: 'Which data structure is used for BFS traversal?', options: ['Stack', 'Queue', 'Heap', 'Array'], correct_index: 1, explanation: 'BFS uses a Queue to process nodes level by level.' },
    { question: 'Which data structure is used for DFS traversal?', options: ['Queue', 'Stack', 'Heap', 'Linked List'], correct_index: 1, explanation: 'DFS uses a Stack (or recursion which uses the call stack).' },
    { question: 'What is the space complexity of Merge Sort?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], correct_index: 2, explanation: 'Merge Sort requires O(n) extra space for the temporary arrays.' },
    { question: 'A deque allows insertion and deletion from:', options: ['Front only', 'Rear only', 'Both front and rear', 'Middle only'], correct_index: 2, explanation: 'Deque supports insert/delete at both ends.' },
    { question: 'What is the time complexity of searching in a balanced BST?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'], correct_index: 2, explanation: 'Balanced BST search is O(log n) as height is log n.' },
    // Algorithms
    { question: 'Which algorithm finds the shortest path in an unweighted graph?', options: ['DFS', 'BFS', 'Dijkstra', 'Bellman-Ford'], correct_index: 1, explanation: 'BFS finds shortest path in unweighted graphs by exploring level by level.' },
    { question: 'Dijkstra algorithm fails when graph has:', options: ['Positive weights', 'Negative weights', 'Zero weights', 'Large weights'], correct_index: 1, explanation: 'Dijkstra does not work correctly with negative edge weights.' },
    { question: 'Which algorithm is used to detect a cycle in a directed graph?', options: ['BFS', 'DFS with coloring', 'Dijkstra', 'Prim'], correct_index: 1, explanation: 'DFS with 3-color marking detects back edges indicating cycles.' },
    { question: 'What does dynamic programming primarily avoid?', options: ['Recursion', 'Recomputing subproblems', 'Loops', 'Memory usage'], correct_index: 1, explanation: 'DP stores results of subproblems to avoid recomputation.' },
    { question: 'The time complexity of the Fibonacci sequence using DP is:', options: ['O(2^n)', 'O(n^2)', 'O(n)', 'O(log n)'], correct_index: 2, explanation: 'DP Fibonacci computes each value once, giving O(n).' },
    { question: 'Which technique does binary search use?', options: ['Dynamic Programming', 'Greedy', 'Divide and Conquer', 'Backtracking'], correct_index: 2, explanation: 'Binary search divides the problem in half each step.' },
    { question: 'Kruskal algorithm is used to find:', options: ['Shortest path', 'Minimum Spanning Tree', 'Maximum flow', 'Topological sort'], correct_index: 1, explanation: 'Kruskal builds MST by adding edges in increasing weight order.' },
    { question: 'What is the time complexity of Bubble Sort?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correct_index: 2, explanation: 'Bubble Sort compares adjacent elements repeatedly giving O(n^2).' },
    { question: "Which algorithm uses a greedy approach to build MST?", options: ['Dijkstra', "Prim's", 'Floyd-Warshall', 'Bellman-Ford'], correct_index: 1, explanation: "Prim's algorithm greedily picks the minimum weight edge at each step." },
    { question: 'What is memoization?', options: ['Storing results of expensive function calls', 'Sorting data in memory', 'Allocating memory dynamically', 'Freeing unused memory'], correct_index: 0, explanation: 'Memoization caches results of function calls to avoid redundant computation.' },
    // DBMS
    { question: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'Sequential Query Layer'], correct_index: 0, explanation: 'SQL = Structured Query Language.' },
    { question: 'What is a foreign key?', options: ['Primary identifier of a table', 'Reference to primary key of another table', 'Index on a column', 'Duplicate key'], correct_index: 1, explanation: 'A foreign key references the primary key of another table.' },
    { question: 'Which SQL command removes all rows without logging?', options: ['DELETE', 'DROP', 'TRUNCATE', 'REMOVE'], correct_index: 2, explanation: 'TRUNCATE removes all rows quickly without logging individual deletions.' },
    { question: 'What is normalization in databases?', options: ['Speeding up queries', 'Organizing data to reduce redundancy', 'Encrypting data', 'Backing up data'], correct_index: 1, explanation: 'Normalization organizes tables to minimize redundancy.' },
    { question: 'Which normal form eliminates partial dependencies?', options: ['1NF', '2NF', '3NF', 'BCNF'], correct_index: 1, explanation: '2NF removes partial dependencies on composite primary keys.' },
    { question: 'What does ACID stand for in databases?', options: ['Atomicity Consistency Isolation Durability', 'Access Control Integrity Data', 'Automated Commit Index Delete', 'None of the above'], correct_index: 0, explanation: 'ACID = Atomicity, Consistency, Isolation, Durability.' },
    { question: 'Which JOIN returns all rows from both tables including unmatched?', options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'], correct_index: 3, explanation: 'FULL OUTER JOIN returns all rows from both tables.' },
    { question: 'What is an index in a database?', options: ['A backup copy', 'A data structure to speed up queries', 'A foreign key constraint', 'A stored procedure'], correct_index: 1, explanation: 'An index speeds up data retrieval.' },
    { question: 'Which SQL clause is used to filter groups?', options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'], correct_index: 1, explanation: 'HAVING filters groups after GROUP BY.' },
    { question: 'What is a deadlock in a database?', options: ['A slow query', 'Two transactions waiting for each other indefinitely', 'A corrupted table', 'A missing index'], correct_index: 1, explanation: 'Deadlock: two transactions each hold a lock the other needs.' },
    // OOP
    { question: 'What is encapsulation in OOP?', options: ['Hiding implementation details', 'Multi-level inheritance', 'Method overloading', 'Static binding'], correct_index: 0, explanation: 'Encapsulation bundles data and methods, hiding internal implementation.' },
    { question: 'What does polymorphism mean in OOP?', options: ['Same interface, many forms', 'Single inheritance only', 'Compile-time errors only', 'None of the above'], correct_index: 0, explanation: 'Polymorphism allows one interface to be used for different data types.' },
    { question: 'What is inheritance in OOP?', options: ['Creating objects', 'A class acquiring properties of another class', 'Hiding data', 'Overloading methods'], correct_index: 1, explanation: 'Inheritance allows a child class to acquire properties of a parent class.' },
    { question: 'What is abstraction in OOP?', options: ['Showing all details', 'Hiding complexity and showing only essentials', 'Copying objects', 'Deleting objects'], correct_index: 1, explanation: 'Abstraction hides complex implementation.' },
    { question: 'Which OOP concept allows a method to have multiple forms?', options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction'], correct_index: 2, explanation: 'Polymorphism allows methods to have multiple forms.' },
    { question: 'What is method overriding?', options: ['Same method name, different parameters', 'Redefining a parent class method in child class', 'Creating a new method', 'Deleting a method'], correct_index: 1, explanation: 'Method overriding redefines a parent class method in the subclass.' },
    { question: 'What is method overloading?', options: ['Same method name, different parameters', 'Redefining parent method', 'Creating abstract method', 'None'], correct_index: 0, explanation: 'Method overloading defines multiple methods with same name but different parameters.' },
    { question: 'Which keyword prevents a class from being inherited in Java?', options: ['static', 'abstract', 'final', 'private'], correct_index: 2, explanation: 'The final keyword prevents a class from being subclassed.' },
    { question: 'What is an abstract class?', options: ['A class with no methods', 'A class that cannot be instantiated directly', 'A class with only static methods', 'A class with private constructor'], correct_index: 1, explanation: 'Abstract class cannot be instantiated; it must be subclassed.' },
    { question: 'What is an interface in OOP?', options: ['A class with implementation', 'A contract defining method signatures without implementation', 'A private class', 'A static class'], correct_index: 1, explanation: 'An interface defines a contract of method signatures.' },
    // Networking
    { question: 'Which layer of the OSI model handles routing?', options: ['Data Link', 'Transport', 'Network', 'Session'], correct_index: 2, explanation: 'Layer 3 (Network) handles logical addressing and routing.' },
    { question: 'What is the default port of HTTP?', options: ['443', '21', '80', '22'], correct_index: 2, explanation: 'HTTP uses port 80 by default.' },
    { question: 'What is the default port of HTTPS?', options: ['80', '443', '8080', '22'], correct_index: 1, explanation: 'HTTPS uses port 443.' },
    { question: 'Which protocol is used for sending emails?', options: ['FTP', 'SMTP', 'HTTP', 'DNS'], correct_index: 1, explanation: 'SMTP is used for sending emails.' },
    { question: 'What does DNS stand for?', options: ['Dynamic Network Service', 'Domain Name System', 'Data Network Standard', 'Distributed Name Server'], correct_index: 1, explanation: 'DNS translates domain names to IP addresses.' },
    { question: 'Which protocol provides reliable, ordered delivery?', options: ['UDP', 'IP', 'TCP', 'ICMP'], correct_index: 2, explanation: 'TCP provides reliable, ordered, error-checked delivery.' },
    { question: 'What is the purpose of ARP?', options: ['Resolve IP to MAC address', 'Resolve domain to IP', 'Encrypt data', 'Route packets'], correct_index: 0, explanation: 'ARP maps IP addresses to MAC addresses.' },
    { question: 'How many layers does the OSI model have?', options: ['4', '5', '6', '7'], correct_index: 3, explanation: 'The OSI model has 7 layers.' },
    // Web & HTTP
    { question: 'Which HTTP method is used to retrieve data?', options: ['POST', 'PUT', 'GET', 'DELETE'], correct_index: 2, explanation: 'GET retrieves data from a server.' },
    { question: 'Which HTTP method is used for partial update?', options: ['PUT', 'DELETE', 'PATCH', 'POST'], correct_index: 2, explanation: 'PATCH is for partial updates.' },
    { question: 'What HTTP status code means "Not Found"?', options: ['200', '301', '404', '500'], correct_index: 2, explanation: '404 means the requested resource was not found.' },
    { question: 'What HTTP status code means "Internal Server Error"?', options: ['400', '401', '403', '500'], correct_index: 3, explanation: '500 indicates an unexpected server-side error.' },
    { question: 'What does REST stand for?', options: ['Remote Execution State Transfer', 'Representational State Transfer', 'Resource Endpoint Standard Transfer', 'None'], correct_index: 1, explanation: 'REST = Representational State Transfer.' },
    { question: 'What is JWT used for?', options: ['Database queries', 'Stateless authentication tokens', 'File compression', 'Image encoding'], correct_index: 1, explanation: 'JWT is used for stateless authentication.' },
    { question: 'What does CORS stand for?', options: ['Cross-Origin Resource Sharing', 'Client Origin Request Standard', 'Cross-Object Resource System', 'None'], correct_index: 0, explanation: 'CORS controls cross-domain HTTP requests.' },
    // OS
    { question: 'What is a process in an operating system?', options: ['A program stored on disk', 'A program in execution', 'A file in memory', 'A hardware component'], correct_index: 1, explanation: 'A process is a program currently being executed.' },
    { question: 'What is a thread?', options: ['A separate process', 'Lightweight unit of execution within a process', 'A file descriptor', 'A memory block'], correct_index: 1, explanation: 'A thread is the smallest unit of execution within a process.' },
    { question: 'Which scheduling algorithm gives the shortest average waiting time?', options: ['FCFS', 'Round Robin', 'SJF', 'Priority'], correct_index: 2, explanation: 'SJF minimizes average waiting time.' },
    { question: 'What is virtual memory?', options: ['RAM', 'Cache memory', 'Disk space used as RAM extension', 'GPU memory'], correct_index: 2, explanation: 'Virtual memory uses disk space to extend available RAM.' },
    { question: 'What is a semaphore used for?', options: ['Memory allocation', 'Process synchronization', 'File management', 'CPU scheduling'], correct_index: 1, explanation: 'Semaphores control access to shared resources.' },
    // Python
    { question: 'What is the output of type(3.14) in Python?', options: ["<class 'int'>", "<class 'float'>", "<class 'double'>", "<class 'decimal'>"], correct_index: 1, explanation: '3.14 is a float in Python.' },
    { question: 'Which keyword is used to define a function in Python?', options: ['function', 'def', 'func', 'define'], correct_index: 1, explanation: 'Python uses the def keyword.' },
    { question: 'Which Python data structure is immutable?', options: ['List', 'Dictionary', 'Tuple', 'Set'], correct_index: 2, explanation: 'Tuples are immutable.' },
    { question: 'What is a lambda function in Python?', options: ['A named function', 'An anonymous single-expression function', 'A recursive function', 'A class method'], correct_index: 1, explanation: 'Lambda creates anonymous functions.' },
    { question: 'What does the "self" parameter represent in Python?', options: ['The class itself', 'The current instance of the class', 'A static variable', 'The parent class'], correct_index: 1, explanation: 'self refers to the current instance.' },
    { question: 'Which method is called when an object is created in Python?', options: ['__start__', '__init__', '__create__', '__new__'], correct_index: 1, explanation: '__init__ is the constructor method.' },
    { question: 'What is list comprehension in Python?', options: ['A way to sort lists', 'A concise way to create lists', 'A method to delete list items', 'A loop construct'], correct_index: 1, explanation: 'List comprehension creates lists concisely.' },
    { question: 'Which Python keyword is used for exception handling?', options: ['catch', 'except', 'error', 'handle'], correct_index: 1, explanation: 'Python uses try/except blocks.' },
    // Java & Software Engineering
    { question: 'Which Java keyword prevents method overriding?', options: ['static', 'abstract', 'final', 'private'], correct_index: 2, explanation: 'final methods cannot be overridden.' },
    { question: 'What is the JVM?', options: ['Java Variable Manager', 'Java Virtual Machine that runs bytecode', 'Java Version Manager', 'Java Visual Module'], correct_index: 1, explanation: 'JVM executes Java bytecode.' },
    { question: 'Which collection in Java does not allow duplicates?', options: ['ArrayList', 'LinkedList', 'HashSet', 'Vector'], correct_index: 2, explanation: 'HashSet does not allow duplicate elements.' },
    { question: 'What is the purpose of version control?', options: ['Speed up compilation', 'Track and manage code changes over time', 'Encrypt source code', 'Deploy applications'], correct_index: 1, explanation: 'Version control tracks changes and enables collaboration.' },
    { question: 'What is the Singleton design pattern?', options: ['Creates multiple instances', 'Ensures only one instance of a class exists', 'Defines an interface', 'Separates object creation'], correct_index: 1, explanation: 'Singleton restricts instantiation to one object.' },
    { question: 'What is unit testing?', options: ['Testing the entire application', 'Testing individual components in isolation', 'Testing the database', 'Testing the UI'], correct_index: 1, explanation: 'Unit testing tests individual functions in isolation.' },
    { question: 'What is Agile methodology?', options: ['A waterfall approach', 'Iterative development with continuous feedback', 'A testing framework', 'A deployment strategy'], correct_index: 1, explanation: 'Agile is iterative with short sprints and continuous feedback.' },
    { question: 'What is CI/CD?', options: ['Code Integration / Code Deployment', 'Continuous Integration / Continuous Deployment', 'Client Interface / Client Design', 'None'], correct_index: 1, explanation: 'CI/CD automates building, testing, and deploying code.' },
    { question: 'What is Docker used for?', options: ['Database management', 'Containerizing applications', 'Version control', 'Load balancing'], correct_index: 1, explanation: 'Docker packages applications into containers.' },
    { question: 'What is Kubernetes?', options: ['A programming language', 'Container orchestration platform', 'A database', 'A web framework'], correct_index: 1, explanation: 'Kubernetes automates deployment and management of containers.' },
    { question: 'What is load balancing?', options: ['Distributing network traffic across multiple servers', 'Compressing data', 'Encrypting traffic', 'Caching responses'], correct_index: 0, explanation: 'Load balancing distributes requests across multiple servers.' },
];

async function seedQuestions() {
    console.log('\n🌱 Seeding coding problems + quiz questions into Supabase...\n');

    // ── Coding Problems ──────────────────────────────────────
    const { count: existingProblems } = await supabase
        .from('coding_problems')
        .select('*', { count: 'exact', head: true });

    if (existingProblems === 0) {
        console.log(`📥 Inserting ${PROBLEMS.length} coding problems...`);
        for (const p of PROBLEMS) {
            const { error } = await supabase.from('coding_problems').insert([{
                title:          p.title,
                difficulty:     p.difficulty,
                max_score:      p.max_score,
                description:    p.description,
                examples:       p.examples,
                constraints:    p.constraints,
                starter_python: p.starter_python,
                starter_java:   p.starter_java,
            }]);
            if (error) console.error(`   ❌ ${p.title}: ${error.message}`);
            else console.log(`   ✅ ${p.title} (${p.difficulty})`);
        }
    } else {
        console.log(`⏭  coding_problems already has ${existingProblems} rows — skipping`);
    }

    // ── Quiz Questions ───────────────────────────────────────
    const { count: existingQuestions } = await supabase
        .from('quiz_questions')
        .select('*', { count: 'exact', head: true });

    if (existingQuestions === 0) {
        console.log(`\n📥 Inserting ${QUESTIONS.length} quiz questions...`);
        // Insert in batches of 20
        const BATCH = 20;
        for (let i = 0; i < QUESTIONS.length; i += BATCH) {
            const batch = QUESTIONS.slice(i, i + BATCH).map(q => ({
                quiz_name:     QUIZ_NAME,
                question:      q.question,
                options:       q.options,
                correct_index: q.correct_index,
                explanation:   q.explanation,
            }));
            const { error } = await supabase.from('quiz_questions').insert(batch);
            if (error) console.error(`   ❌ Batch ${i}-${i + BATCH}: ${error.message}`);
            else console.log(`   ✅ Questions ${i + 1}–${Math.min(i + BATCH, QUESTIONS.length)} inserted`);
        }
    } else {
        console.log(`⏭  quiz_questions already has ${existingQuestions} rows — skipping`);
    }

    // Final counts
    const { count: cp } = await supabase.from('coding_problems').select('*', { count: 'exact', head: true });
    const { count: qq } = await supabase.from('quiz_questions').select('*', { count: 'exact', head: true });
    console.log(`\n📊 Final counts:`);
    console.log(`   coding_problems : ${cp} rows`);
    console.log(`   quiz_questions  : ${qq} rows`);
    console.log('\n🎉 Done!\n');
}

seedQuestions().catch(err => {
    console.error('Seeding failed:', err.message);
    process.exit(1);
});
