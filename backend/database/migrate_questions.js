// database/migrate_questions.js — Seeds coding_problems + quiz_questions
require('dotenv').config({ path: '../.env' });
const pool = require('../config/db');

// ── 5 Coding Problems ────────────────────────────────────────
const PROBLEMS = [
  {
    title: 'Two Sum', difficulty: 'Easy', max_score: 100,
    description: 'Given an array of integers nums and integer target, return indices of the two numbers that add up to target.',
    examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0, 1]' }],
    constraints: ['2 <= nums.length <= 10000', '-1000000000 <= nums[i] <= 1000000000', 'Exactly one valid answer'],
    starter_python: 'def two_sum(nums, target):\n    # Write your solution here\n    pass',
    starter_java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write solution\n    }\n}',
  },
  {
    title: 'Reverse a Linked List', difficulty: 'Medium', max_score: 150,
    description: 'Reverse a singly linked list and return the head of the reversed list.',
    examples: [{ input: '1 -> 2 -> 3 -> 4 -> 5', output: '5 -> 4 -> 3 -> 2 -> 1' }],
    constraints: ['0 <= nodes <= 5000', '-5000 <= Node.val <= 5000'],
    starter_python: 'def reverse_list(head):\n    prev = None\n    # Write your solution\n    pass',
    starter_java: 'public ListNode reverseList(ListNode head) {\n    // Write here\n    return null;\n}',
  },
  {
    title: 'LRU Cache', difficulty: 'Hard', max_score: 200,
    description: 'Implement an LRU (Least Recently Used) cache with O(1) get and put operations.',
    examples: [{ input: 'capacity=2, put(1,1), put(2,2), get(1)', output: '1; then put(3,3) evicts key 2' }],
    constraints: ['1 <= capacity <= 3000', '0 <= key <= 10000', 'At most 200000 calls'],
    starter_python: 'from collections import OrderedDict\nclass LRUCache:\n    def __init__(self, capacity):\n        pass\n    def get(self, key):\n        pass\n    def put(self, key, value):\n        pass',
    starter_java: 'class LRUCache {\n    public LRUCache(int capacity) {}\n    public int get(int key) { return -1; }\n    public void put(int key, int value) {}\n}',
  },
  {
    title: 'Valid Parentheses', difficulty: 'Easy', max_score: 100,
    description: 'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid.',
    examples: [{ input: 's = "()[]{}"', output: 'true' }, { input: 's = "(]"', output: 'false' }],
    constraints: ['1 <= s.length <= 10000', 's consists of parentheses only'],
    starter_python: 'def is_valid(s):\n    # Stack-based approach\n    pass',
    starter_java: 'public boolean isValid(String s) {\n    // Stack\n    return false;\n}',
  },
  {
    title: 'Merge Intervals', difficulty: 'Medium', max_score: 150,
    description: 'Given an array of intervals, merge all overlapping intervals and return the result.',
    examples: [{ input: '[[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' }],
    constraints: ['1 <= intervals.length <= 10000', 'intervals[i].length == 2'],
    starter_python: 'def merge(intervals):\n    pass',
    starter_java: 'public int[][] merge(int[][] intervals) {\n    return new int[][]{};\n}',
  },
];

// ── 110 Quiz Questions ───────────────────────────────────────
const QUESTIONS = [
  // ── Data Structures ──────────────────────────────────────
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
  { question: 'A deque (double-ended queue) allows insertion and deletion from:', options: ['Front only', 'Rear only', 'Both front and rear', 'Middle only'], correct_index: 2, explanation: 'Deque supports insert/delete at both ends.' },
  { question: 'What is the time complexity of searching in a balanced BST?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'], correct_index: 2, explanation: 'Balanced BST search is O(log n) as height is log n.' },

  // ── Algorithms ───────────────────────────────────────────
  { question: 'Which algorithm finds the shortest path in an unweighted graph?', options: ['DFS', 'BFS', 'Dijkstra', 'Bellman-Ford'], correct_index: 1, explanation: 'BFS finds shortest path in unweighted graphs by exploring level by level.' },
  { question: 'Dijkstra algorithm fails when graph has:', options: ['Positive weights', 'Negative weights', 'Zero weights', 'Large weights'], correct_index: 1, explanation: 'Dijkstra does not work correctly with negative edge weights.' },
  { question: 'Which algorithm is used to detect a cycle in a directed graph?', options: ['BFS', 'DFS with coloring', 'Dijkstra', 'Prim'], correct_index: 1, explanation: 'DFS with 3-color marking (white/gray/black) detects back edges indicating cycles.' },
  { question: 'What does dynamic programming primarily avoid?', options: ['Recursion', 'Recomputing subproblems', 'Loops', 'Memory usage'], correct_index: 1, explanation: 'DP stores results of subproblems (memoization/tabulation) to avoid recomputation.' },
  { question: 'The time complexity of the Fibonacci sequence using DP is:', options: ['O(2^n)', 'O(n^2)', 'O(n)', 'O(log n)'], correct_index: 2, explanation: 'DP Fibonacci computes each value once, giving O(n).' },
  { question: 'Which technique does binary search use?', options: ['Dynamic Programming', 'Greedy', 'Divide and Conquer', 'Backtracking'], correct_index: 2, explanation: 'Binary search divides the problem in half each step — Divide and Conquer.' },
  { question: 'Kruskal algorithm is used to find:', options: ['Shortest path', 'Minimum Spanning Tree', 'Maximum flow', 'Topological sort'], correct_index: 1, explanation: 'Kruskal builds MST by adding edges in increasing weight order.' },
  { question: 'What is the time complexity of Bubble Sort?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correct_index: 2, explanation: 'Bubble Sort compares adjacent elements repeatedly giving O(n^2).' },
  { question: 'Which algorithm uses a greedy approach to build MST?', options: ['Dijkstra', "Prim's", 'Floyd-Warshall', 'Bellman-Ford'], correct_index: 1, explanation: "Prim's algorithm greedily picks the minimum weight edge at each step." },
  { question: 'What is memoization?', options: ['Storing results of expensive function calls', 'Sorting data in memory', 'Allocating memory dynamically', 'Freeing unused memory'], correct_index: 0, explanation: 'Memoization caches results of function calls to avoid redundant computation.' },

  // ── DBMS ─────────────────────────────────────────────────
  { question: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'Sequential Query Layer'], correct_index: 0, explanation: 'SQL = Structured Query Language, used to manage relational databases.' },
  { question: 'What is a foreign key?', options: ['Primary identifier of a table', 'Reference to primary key of another table', 'Index on a column', 'Duplicate key'], correct_index: 1, explanation: 'A foreign key references the primary key of another table to enforce referential integrity.' },
  { question: 'Which SQL command is used to remove all rows from a table without logging?', options: ['DELETE', 'DROP', 'TRUNCATE', 'REMOVE'], correct_index: 2, explanation: 'TRUNCATE removes all rows quickly without logging individual row deletions.' },
  { question: 'What is normalization in databases?', options: ['Speeding up queries', 'Organizing data to reduce redundancy', 'Encrypting data', 'Backing up data'], correct_index: 1, explanation: 'Normalization organizes tables to minimize redundancy and dependency.' },
  { question: 'Which normal form eliminates partial dependencies?', options: ['1NF', '2NF', '3NF', 'BCNF'], correct_index: 1, explanation: '2NF removes partial dependencies on composite primary keys.' },
  { question: 'What does ACID stand for in databases?', options: ['Atomicity Consistency Isolation Durability', 'Access Control Integrity Data', 'Automated Commit Index Delete', 'None of the above'], correct_index: 0, explanation: 'ACID = Atomicity, Consistency, Isolation, Durability — properties of DB transactions.' },
  { question: 'Which JOIN returns all rows from both tables including unmatched rows?', options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'], correct_index: 3, explanation: 'FULL OUTER JOIN returns all rows from both tables, with NULLs for non-matching rows.' },
  { question: 'What is an index in a database?', options: ['A backup copy', 'A data structure to speed up queries', 'A foreign key constraint', 'A stored procedure'], correct_index: 1, explanation: 'An index is a data structure (like B-tree) that speeds up data retrieval.' },
  { question: 'Which SQL clause is used to filter groups?', options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'], correct_index: 1, explanation: 'HAVING filters groups after GROUP BY, while WHERE filters individual rows.' },
  { question: 'What is a deadlock in a database?', options: ['A slow query', 'Two transactions waiting for each other indefinitely', 'A corrupted table', 'A missing index'], correct_index: 1, explanation: 'Deadlock occurs when two transactions each hold a lock the other needs.' },
  { question: 'Which command saves a transaction permanently?', options: ['ROLLBACK', 'SAVEPOINT', 'COMMIT', 'BEGIN'], correct_index: 2, explanation: 'COMMIT permanently saves all changes made in the current transaction.' },

  // ── OOP ──────────────────────────────────────────────────
  { question: 'What is encapsulation in OOP?', options: ['Hiding implementation details', 'Multi-level inheritance', 'Method overloading', 'Static binding'], correct_index: 0, explanation: 'Encapsulation bundles data and methods, hiding internal implementation.' },
  { question: 'What does polymorphism mean in OOP?', options: ['Same interface, many forms', 'Single inheritance only', 'Compile-time errors only', 'None of the above'], correct_index: 0, explanation: 'Polymorphism allows one interface to be used for different data types.' },
  { question: 'What is inheritance in OOP?', options: ['Creating objects', 'A class acquiring properties of another class', 'Hiding data', 'Overloading methods'], correct_index: 1, explanation: 'Inheritance allows a child class to acquire properties and methods of a parent class.' },
  { question: 'What is abstraction in OOP?', options: ['Showing all details', 'Hiding complexity and showing only essentials', 'Copying objects', 'Deleting objects'], correct_index: 1, explanation: 'Abstraction hides complex implementation and exposes only necessary features.' },
  { question: 'Which OOP concept allows a method to have multiple forms?', options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction'], correct_index: 2, explanation: 'Polymorphism (method overloading/overriding) allows methods to have multiple forms.' },
  { question: 'What is method overriding?', options: ['Same method name, different parameters', 'Redefining a parent class method in child class', 'Creating a new method', 'Deleting a method'], correct_index: 1, explanation: 'Method overriding redefines a parent class method in the subclass with same signature.' },
  { question: 'What is method overloading?', options: ['Same method name, different parameters', 'Redefining parent method', 'Creating abstract method', 'None'], correct_index: 0, explanation: 'Method overloading defines multiple methods with same name but different parameters.' },
  { question: 'Which keyword is used to prevent a class from being inherited in Java?', options: ['static', 'abstract', 'final', 'private'], correct_index: 2, explanation: 'The final keyword prevents a class from being subclassed in Java.' },
  { question: 'What is an abstract class?', options: ['A class with no methods', 'A class that cannot be instantiated directly', 'A class with only static methods', 'A class with private constructor'], correct_index: 1, explanation: 'Abstract class cannot be instantiated; it must be subclassed.' },
  { question: 'What is an interface in OOP?', options: ['A class with implementation', 'A contract defining method signatures without implementation', 'A private class', 'A static class'], correct_index: 1, explanation: 'An interface defines a contract — method signatures that implementing classes must provide.' },

  // ── Networking ───────────────────────────────────────────
  { question: 'Which layer of the OSI model handles routing?', options: ['Data Link', 'Transport', 'Network', 'Session'], correct_index: 2, explanation: 'Layer 3 (Network) handles logical addressing and routing via IP.' },
  { question: 'What is the default port of HTTP?', options: ['443', '21', '80', '22'], correct_index: 2, explanation: 'HTTP uses port 80 by default.' },
  { question: 'What is the default port of HTTPS?', options: ['80', '443', '8080', '22'], correct_index: 1, explanation: 'HTTPS uses port 443 for secure communication.' },
  { question: 'Which protocol is used for sending emails?', options: ['FTP', 'SMTP', 'HTTP', 'DNS'], correct_index: 1, explanation: 'SMTP (Simple Mail Transfer Protocol) is used for sending emails.' },
  { question: 'What does DNS stand for?', options: ['Dynamic Network Service', 'Domain Name System', 'Data Network Standard', 'Distributed Name Server'], correct_index: 1, explanation: 'DNS = Domain Name System, translates domain names to IP addresses.' },
  { question: 'Which protocol provides reliable, ordered delivery?', options: ['UDP', 'IP', 'TCP', 'ICMP'], correct_index: 2, explanation: 'TCP (Transmission Control Protocol) provides reliable, ordered, error-checked delivery.' },
  { question: 'What is the purpose of ARP?', options: ['Resolve IP to MAC address', 'Resolve domain to IP', 'Encrypt data', 'Route packets'], correct_index: 0, explanation: 'ARP (Address Resolution Protocol) maps IP addresses to MAC addresses.' },
  { question: 'How many layers does the OSI model have?', options: ['4', '5', '6', '7'], correct_index: 3, explanation: 'The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.' },
  { question: 'Which layer of OSI handles end-to-end communication?', options: ['Network', 'Transport', 'Session', 'Application'], correct_index: 1, explanation: 'Transport layer (Layer 4) handles end-to-end communication and error recovery.' },
  { question: 'What is a subnet mask used for?', options: ['Encrypting data', 'Dividing IP address into network and host parts', 'Routing packets', 'Assigning MAC addresses'], correct_index: 1, explanation: 'Subnet mask separates the network portion from the host portion of an IP address.' },

  // ── Web & HTTP ───────────────────────────────────────────
  { question: 'Which HTTP method is used to retrieve data?', options: ['POST', 'PUT', 'GET', 'DELETE'], correct_index: 2, explanation: 'GET is used to retrieve/read data from a server.' },
  { question: 'Which HTTP method is used for partial update?', options: ['PUT', 'DELETE', 'PATCH', 'POST'], correct_index: 2, explanation: 'PATCH is for partial updates; PUT replaces the entire resource.' },
  { question: 'What HTTP status code means "Not Found"?', options: ['200', '301', '404', '500'], correct_index: 2, explanation: '404 means the requested resource was not found on the server.' },
  { question: 'What HTTP status code means "Internal Server Error"?', options: ['400', '401', '403', '500'], correct_index: 3, explanation: '500 Internal Server Error indicates an unexpected server-side error.' },
  { question: 'What does REST stand for?', options: ['Remote Execution State Transfer', 'Representational State Transfer', 'Resource Endpoint Standard Transfer', 'None'], correct_index: 1, explanation: 'REST = Representational State Transfer, an architectural style for APIs.' },
  { question: 'What is a cookie in web development?', options: ['A type of database', 'Small data stored on client browser', 'A server-side session', 'An HTTP header'], correct_index: 1, explanation: 'Cookies are small pieces of data stored in the browser to maintain state.' },
  { question: 'What does CORS stand for?', options: ['Cross-Origin Resource Sharing', 'Client Origin Request Standard', 'Cross-Object Resource System', 'None'], correct_index: 0, explanation: 'CORS = Cross-Origin Resource Sharing, controls cross-domain HTTP requests.' },
  { question: 'What is JWT used for?', options: ['Database queries', 'Stateless authentication tokens', 'File compression', 'Image encoding'], correct_index: 1, explanation: 'JWT (JSON Web Token) is used for stateless authentication between client and server.' },
  { question: 'Which HTTP status code means "Unauthorized"?', options: ['400', '401', '403', '404'], correct_index: 1, explanation: '401 Unauthorized means authentication is required and has failed or not been provided.' },
  { question: 'What is the purpose of an API?', options: ['Store data', 'Allow communication between software applications', 'Design UI', 'Compile code'], correct_index: 1, explanation: 'API (Application Programming Interface) enables communication between different software systems.' },

  // ── Operating Systems ────────────────────────────────────
  { question: 'What is a process in an operating system?', options: ['A program stored on disk', 'A program in execution', 'A file in memory', 'A hardware component'], correct_index: 1, explanation: 'A process is a program that is currently being executed by the OS.' },
  { question: 'What is a thread?', options: ['A separate process', 'Lightweight unit of execution within a process', 'A file descriptor', 'A memory block'], correct_index: 1, explanation: 'A thread is the smallest unit of execution within a process, sharing its memory.' },
  { question: 'What is a deadlock?', options: ['A slow process', 'Two or more processes waiting for each other indefinitely', 'A memory leak', 'A CPU overload'], correct_index: 1, explanation: 'Deadlock occurs when processes are stuck waiting for resources held by each other.' },
  { question: 'Which scheduling algorithm gives the shortest average waiting time?', options: ['FCFS', 'Round Robin', 'SJF', 'Priority'], correct_index: 2, explanation: 'SJF (Shortest Job First) minimizes average waiting time.' },
  { question: 'What is virtual memory?', options: ['RAM', 'Cache memory', 'Disk space used as RAM extension', 'GPU memory'], correct_index: 2, explanation: 'Virtual memory uses disk space to extend available RAM for processes.' },
  { question: 'What is a semaphore used for?', options: ['Memory allocation', 'Process synchronization', 'File management', 'CPU scheduling'], correct_index: 1, explanation: 'Semaphores are used to control access to shared resources in concurrent systems.' },
  { question: 'What is thrashing in OS?', options: ['High CPU usage', 'Excessive paging causing low CPU utilization', 'Memory overflow', 'Disk failure'], correct_index: 1, explanation: 'Thrashing occurs when the OS spends more time swapping pages than executing processes.' },
  { question: 'Which memory allocation strategy avoids external fragmentation?', options: ['First Fit', 'Best Fit', 'Paging', 'Worst Fit'], correct_index: 2, explanation: 'Paging divides memory into fixed-size frames, eliminating external fragmentation.' },
  { question: 'What is the role of the OS kernel?', options: ['Manage user interface', 'Core component managing hardware and system resources', 'Run applications', 'Store files'], correct_index: 1, explanation: 'The kernel is the core of the OS, managing CPU, memory, and device I/O.' },
  { question: 'What is context switching?', options: ['Changing user accounts', 'Saving and restoring process state when switching CPU', 'Switching between files', 'Changing network connections'], correct_index: 1, explanation: 'Context switching saves the state of the current process and loads the state of the next.' },

  // ── Python ───────────────────────────────────────────────
  { question: 'What is the output of type(3.14) in Python?', options: ["<class 'int'>", "<class 'float'>", "<class 'double'>", "<class 'decimal'>"], correct_index: 1, explanation: '3.14 is a float in Python.' },
  { question: 'Which keyword is used to define a function in Python?', options: ['function', 'def', 'func', 'define'], correct_index: 1, explanation: 'Python uses the def keyword to define functions.' },
  { question: 'What does len() do in Python?', options: ['Returns last element', 'Returns length of an object', 'Deletes an element', 'Sorts a list'], correct_index: 1, explanation: 'len() returns the number of items in an object.' },
  { question: 'Which Python data structure is immutable?', options: ['List', 'Dictionary', 'Tuple', 'Set'], correct_index: 2, explanation: 'Tuples are immutable — their elements cannot be changed after creation.' },
  { question: 'What is a lambda function in Python?', options: ['A named function', 'An anonymous single-expression function', 'A recursive function', 'A class method'], correct_index: 1, explanation: 'Lambda creates anonymous functions: lambda x: x*2.' },
  { question: 'What does the "self" parameter represent in Python class methods?', options: ['The class itself', 'The current instance of the class', 'A static variable', 'The parent class'], correct_index: 1, explanation: 'self refers to the current instance of the class.' },
  { question: 'Which method is called when an object is created in Python?', options: ['__start__', '__init__', '__create__', '__new__'], correct_index: 1, explanation: '__init__ is the constructor method called when a new object is instantiated.' },
  { question: 'What is list comprehension in Python?', options: ['A way to sort lists', 'A concise way to create lists', 'A method to delete list items', 'A loop construct'], correct_index: 1, explanation: 'List comprehension: [x*2 for x in range(5)] creates a list concisely.' },
  { question: 'What does the "pass" statement do in Python?', options: ['Exits the program', 'Does nothing, acts as placeholder', 'Skips to next iteration', 'Returns None'], correct_index: 1, explanation: 'pass is a null statement used as a placeholder where code is syntactically required.' },
  { question: 'Which Python keyword is used for exception handling?', options: ['catch', 'except', 'error', 'handle'], correct_index: 1, explanation: 'Python uses try/except blocks for exception handling.' },

  // ── Java ─────────────────────────────────────────────────
  { question: 'What is the default port of MySQL?', options: ['5432', '27017', '3306', '1521'], correct_index: 2, explanation: 'MySQL runs on port 3306 by default.' },
  { question: 'Which Java keyword prevents method overriding?', options: ['static', 'abstract', 'final', 'private'], correct_index: 2, explanation: 'final methods cannot be overridden in subclasses.' },
  { question: 'What is the JVM?', options: ['Java Variable Manager', 'Java Virtual Machine that runs bytecode', 'Java Version Manager', 'Java Visual Module'], correct_index: 1, explanation: 'JVM executes Java bytecode, enabling platform independence.' },
  { question: 'Which collection in Java does not allow duplicates?', options: ['ArrayList', 'LinkedList', 'HashSet', 'Vector'], correct_index: 2, explanation: 'HashSet does not allow duplicate elements.' },
  { question: 'What is autoboxing in Java?', options: ['Automatic memory management', 'Automatic conversion between primitive and wrapper types', 'Auto-importing packages', 'Auto-generating constructors'], correct_index: 1, explanation: 'Autoboxing automatically converts int to Integer, double to Double, etc.' },

  // ── Software Engineering ─────────────────────────────────
  { question: 'What does SOLID stand for in software design?', options: ['5 principles of OOP design', 'A programming language', 'A testing framework', 'A database model'], correct_index: 0, explanation: 'SOLID: Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion.' },
  { question: 'What is the purpose of version control?', options: ['Speed up compilation', 'Track and manage code changes over time', 'Encrypt source code', 'Deploy applications'], correct_index: 1, explanation: 'Version control (like Git) tracks changes, enables collaboration and rollback.' },
  { question: 'What is a design pattern?', options: ['A UI template', 'A reusable solution to a common software problem', 'A database schema', 'A testing strategy'], correct_index: 1, explanation: 'Design patterns are proven, reusable solutions to recurring software design problems.' },
  { question: 'What is the Singleton design pattern?', options: ['Creates multiple instances', 'Ensures only one instance of a class exists', 'Defines an interface', 'Separates object creation'], correct_index: 1, explanation: 'Singleton restricts instantiation to one object and provides global access to it.' },
  { question: 'What is unit testing?', options: ['Testing the entire application', 'Testing individual components in isolation', 'Testing the database', 'Testing the UI'], correct_index: 1, explanation: 'Unit testing tests individual functions or methods in isolation.' },
  { question: 'What is Agile methodology?', options: ['A waterfall approach', 'Iterative development with continuous feedback', 'A testing framework', 'A deployment strategy'], correct_index: 1, explanation: 'Agile is an iterative approach to software development with short sprints and continuous feedback.' },
  { question: 'What is CI/CD?', options: ['Code Integration / Code Deployment', 'Continuous Integration / Continuous Deployment', 'Client Interface / Client Design', 'None'], correct_index: 1, explanation: 'CI/CD automates building, testing, and deploying code changes continuously.' },
  { question: 'What is a microservice architecture?', options: ['A monolithic application', 'Application built as small independent services', 'A database design pattern', 'A UI framework'], correct_index: 1, explanation: 'Microservices break an application into small, independently deployable services.' },
  { question: 'What is technical debt?', options: ['Money owed for software licenses', 'Cost of rework from shortcuts taken during development', 'Server infrastructure cost', 'Testing overhead'], correct_index: 1, explanation: 'Technical debt is the implied cost of future rework caused by choosing quick solutions now.' },
  { question: 'What is refactoring?', options: ['Rewriting the entire codebase', 'Improving code structure without changing behavior', 'Adding new features', 'Fixing bugs'], correct_index: 1, explanation: 'Refactoring improves code readability and structure without altering external behavior.' },

  // ── Cloud & DevOps ───────────────────────────────────────
  { question: 'What does IaaS stand for?', options: ['Internet as a Service', 'Infrastructure as a Service', 'Integration as a Service', 'Interface as a Service'], correct_index: 1, explanation: 'IaaS provides virtualized computing infrastructure over the internet.' },
  { question: 'What is Docker used for?', options: ['Database management', 'Containerizing applications', 'Version control', 'Load balancing'], correct_index: 1, explanation: 'Docker packages applications and dependencies into containers for consistent deployment.' },
  { question: 'What is Kubernetes?', options: ['A programming language', 'Container orchestration platform', 'A database', 'A web framework'], correct_index: 1, explanation: 'Kubernetes automates deployment, scaling, and management of containerized applications.' },
  { question: 'What is a CDN?', options: ['Central Data Node', 'Content Delivery Network', 'Cloud Data Network', 'Centralized DNS'], correct_index: 1, explanation: 'CDN distributes content across geographically distributed servers to reduce latency.' },
  { question: 'What is load balancing?', options: ['Distributing network traffic across multiple servers', 'Compressing data', 'Encrypting traffic', 'Caching responses'], correct_index: 0, explanation: 'Load balancing distributes incoming requests across multiple servers to prevent overload.' },
];

// ── Main migration function ──────────────────────────────────
async function run() {
    const conn = await pool.getConnection();
    try {
        // Create tables
        console.log('🔧 Creating coding_problems table...');
        await conn.query(`
            CREATE TABLE IF NOT EXISTS coding_problems (
                problem_id     INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                title          VARCHAR(200) NOT NULL,
                difficulty     ENUM('Easy','Medium','Hard') NOT NULL DEFAULT 'Easy',
                max_score      SMALLINT UNSIGNED NOT NULL DEFAULT 100,
                description    TEXT NOT NULL,
                examples       JSON NOT NULL,
                constraints    JSON NOT NULL,
                starter_python TEXT,
                starter_java   TEXT,
                is_active      BOOLEAN NOT NULL DEFAULT TRUE,
                created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_difficulty (difficulty),
                INDEX idx_active (is_active)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ coding_problems ready');

        console.log('🔧 Creating quiz_questions table...');
        await conn.query(`
            CREATE TABLE IF NOT EXISTS quiz_questions (
                question_id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                quiz_name     VARCHAR(120) NOT NULL DEFAULT 'General Aptitude & Technical Quiz',
                question      TEXT NOT NULL,
                options       JSON NOT NULL,
                correct_index TINYINT UNSIGNED NOT NULL,
                explanation   TEXT,
                is_active     BOOLEAN NOT NULL DEFAULT TRUE,
                created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_quiz_name (quiz_name),
                INDEX idx_active (is_active)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ quiz_questions ready');

        // Insert coding problems
        const [ep] = await conn.query('SELECT COUNT(*) AS cnt FROM coding_problems');
        if (ep[0].cnt === 0) {
            console.log('📥 Inserting 5 coding problems...');
            for (const p of PROBLEMS) {
                await conn.query(
                    `INSERT INTO coding_problems
                        (title, difficulty, max_score, description, examples, constraints, starter_python, starter_java)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        p.title, p.difficulty, p.max_score, p.description,
                        JSON.stringify(p.examples), JSON.stringify(p.constraints),
                        p.starter_python, p.starter_java,
                    ]
                );
            }
            console.log(`✅ ${PROBLEMS.length} coding problems inserted`);
        } else {
            console.log(`⏭  coding_problems already has ${ep[0].cnt} rows — skipping`);
        }

        // Insert quiz questions
        const [eq] = await conn.query('SELECT COUNT(*) AS cnt FROM quiz_questions');
        if (eq[0].cnt === 0) {
            console.log(`📥 Inserting ${QUESTIONS.length} quiz questions...`);
            const QUIZ_NAME = 'General Aptitude & Technical Quiz';
            for (const q of QUESTIONS) {
                await conn.query(
                    `INSERT INTO quiz_questions (quiz_name, question, options, correct_index, explanation)
                     VALUES (?, ?, ?, ?, ?)`,
                    [QUIZ_NAME, q.question, JSON.stringify(q.options), q.correct_index, q.explanation]
                );
            }
            console.log(`✅ ${QUESTIONS.length} quiz questions inserted`);
        } else {
            console.log(`⏭  quiz_questions already has ${eq[0].cnt} rows — skipping`);
        }

        // Verify
        const [cp] = await conn.query('SELECT COUNT(*) AS cnt FROM coding_problems');
        const [qq] = await conn.query('SELECT COUNT(*) AS cnt FROM quiz_questions');
        console.log(`\n📊 Final counts:`);
        console.log(`   coding_problems : ${cp[0].cnt} rows`);
        console.log(`   quiz_questions  : ${qq[0].cnt} rows`);
        console.log('\n🎉 Migration complete!');
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    } finally {
        conn.release();
        process.exit(0);
    }
}

run();
