/**
 * Comprehensive Mock Data for the 15-Screen AI-Powered E-Learning Platform.
 * Powers student, instructor, course catalog, learning, quiz, assignment,
 * progress/analytics, certificate, and AI tutor screens.
 */

export const mockUser = {
  id: 'usr_student_01',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  role: 'STUDENT',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
  title: 'Aspiring Full-Stack Software Engineer',
  location: 'San Francisco, CA',
  joinedDate: 'January 2024',
  streakDays: 14,
  todayGoalMinutes: 50,
  todayCompletedMinutes: 40,
  enrolledCount: 4,
  completedCount: 2,
  hoursLearned: 48.5,
  certificatesCount: 2,
}

export const mockInstructor = {
  id: 'usr_inst_01',
  name: 'Dr. Sarah Connor',
  email: 'sarah.connor@example.com',
  role: 'INSTRUCTOR',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
  title: 'Principal Software Architect & AI Researcher',
  bio: 'Former Staff Engineer at Google and MIT lecturer with 12+ years of experience in distributed systems and deep learning.',
  coursesCreated: 6,
  totalStudents: 18450,
  totalRevenue: 52400,
  averageRating: 4.9,
  reviewsCount: 3820,
}

export const categories = [
  { id: 'all', name: 'All Categories', count: 48 },
  { id: 'programming', name: 'Programming', count: 18 },
  { id: 'ai-ml', name: 'AI & ML', count: 12 },
  { id: 'web-dev', name: 'Web Development', count: 15 },
  { id: 'data-science', name: 'Data Science', count: 9 },
  { id: 'database', name: 'Database', count: 8 },
  { id: 'cloud', name: 'Cloud & DevOps', count: 10 },
  { id: 'cybersecurity', name: 'Cyber Security', count: 6 },
]

export const courses = [
  {
    id: 'course-1',
    title: 'Mastering Java & Object-Oriented Architecture',
    slug: 'mastering-java-oop',
    category: 'Programming',
    categoryId: 'programming',
    level: 'Beginner to Advanced',
    duration: '24 Hours',
    totalLessons: 42,
    rating: 4.9,
    reviewsCount: 2340,
    studentsCount: 14800,
    price: 84.99,
    originalPrice: 129.99,
    isPopular: true,
    isBestseller: true,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    instructor: {
      name: 'Dr. Sarah Connor',
      title: 'Principal Software Architect',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    },
    shortDescription: 'Master modern Java 21, clean design patterns, concurrency, and real-world enterprise backend systems with Spring Boot.',
    description: `Java remains the foundational backbone of enterprise software. This comprehensive masterclass takes you from foundational syntax through advanced Object-Oriented Programming (OOP), memory management, multithreading, and scalable architecture. You'll build production-grade applications with clean code principles and Spring Boot.`,
    whatYouWillLearn: [
      'Core Java 21 syntax, memory layout, JVM garbage collection, and primitives vs references',
      'The 4 pillars of OOP: Encapsulation, Abstraction, Inheritance, and Polymorphism in depth',
      'Design patterns: Factory, Singleton, Observer, Strategy, and Builder',
      'Modern Java concurrency: Virtual Threads, CompletableFuture, and reactive pipelines',
      'Test-Driven Development (TDD) using JUnit 5, Mockito, and AssertJ',
      'Enterprise persistence with Hibernate, JPA, and PostgreSQL',
    ],
    requirements: [
      'Basic understanding of programming concepts (variables, loops, conditionals)',
      'A computer running Windows, macOS, or Linux with at least 8GB RAM',
      'No prior Java knowledge required — we start from the fundamentals',
    ],
    curriculum: [
      {
        id: 'mod-1',
        title: 'Module 1: Java Fundamentals & Environment Setup',
        duration: '3h 15m',
        lessons: [
          { id: 'les-1-1', title: '1. Introduction to the JVM, JRE, and JDK', duration: '18 min', isCompleted: true, isFree: true },
          { id: 'les-1-2', title: '2. Variables, Primitive Types, and Memory Stack', duration: '24 min', isCompleted: true, isFree: true },
          { id: 'les-1-3', title: '3. Control Flow: Conditionals, Loops, and Switch Expressions', duration: '32 min', isCompleted: true, isFree: false },
          { id: 'les-1-4', title: '4. Methods, Signatures, and Variable Scope', duration: '28 min', isCompleted: true, isFree: false },
        ],
      },
      {
        id: 'mod-2',
        title: 'Module 2: Object-Oriented Programming (OOP) Deep Dive',
        duration: '5h 45m',
        lessons: [
          { id: 'les-2-1', title: '1. Classes, Objects, and Constructors', duration: '35 min', isCompleted: true, isFree: false },
          { id: 'les-2-2', title: '2. Encapsulation & Access Modifiers (public, protected, private)', duration: '40 min', isCompleted: true, isFree: false },
          { id: 'les-2-3', title: '3. Inheritance & The Super Keyword', duration: '45 min', isCompleted: true, isFree: false },
          { id: 'les-2-4', title: '4. Polymorphism: Method Overriding vs Overloading', duration: '50 min', isCompleted: false, isCurrent: true, isFree: false },
          { id: 'les-2-5', title: '5. Abstract Classes vs Interfaces in Java 21', duration: '42 min', isCompleted: false, isFree: false },
        ],
      },
      {
        id: 'mod-3',
        title: 'Module 3: Collections, Generics & Functional Streams',
        duration: '4h 30m',
        lessons: [
          { id: 'les-3-1', title: '1. Java Collections Framework: List, Set, Map', duration: '45 min', isCompleted: false, isFree: false },
          { id: 'les-3-2', title: '2. Generics & Type Erasure Demystified', duration: '38 min', isCompleted: false, isFree: false },
          { id: 'les-3-3', title: '3. Lambdas & Stream API in Action', duration: '52 min', isCompleted: false, isFree: false },
        ],
      },
      {
        id: 'mod-4',
        title: 'Module 4: Enterprise Spring Boot & Persistence',
        duration: '6h 15m',
        lessons: [
          { id: 'les-4-1', title: '1. Spring Boot 3 Architecture & Dependency Injection', duration: '55 min', isCompleted: false, isFree: false },
          { id: 'les-4-2', title: '2. Building RESTful APIs with Spring MVC', duration: '60 min', isCompleted: false, isFree: false },
          { id: 'les-4-3', title: '3. Database Integration with Spring Data JPA & PostgreSQL', duration: '65 min', isCompleted: false, isFree: false },
        ],
      },
    ],
  },
  {
    id: 'course-2',
    title: 'Full-Stack Web Development with React & FastAPI',
    slug: 'full-stack-react-fastapi',
    category: 'Web Development',
    categoryId: 'web-dev',
    level: 'Intermediate',
    duration: '28 Hours',
    totalLessons: 56,
    rating: 4.8,
    reviewsCount: 1820,
    studentsCount: 11200,
    price: 79.99,
    originalPrice: 119.99,
    isPopular: true,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    instructor: {
      name: 'Michael Chen',
      title: 'Senior Full-Stack Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    },
    shortDescription: 'Build high-performance web applications using modern React, Tailwind CSS, asynchronous FastAPI, and PostgreSQL.',
    description: `Learn how to connect a blazing-fast Python FastAPI backend with a responsive React single-page application. Topics cover JWT authentication, WebSocket real-time updates, Tailwind UI systems, and full CI/CD deployment.`,
    whatYouWillLearn: [
      'Modern React 19 architecture with hooks, context, and state machines',
      'Async Python with FastAPI, Pydantic v2, and SQLAlchemy 2.0',
      'Token-based authentication with JWT and refresh token rotation',
      'Dockerizing multi-container applications for cloud deployment',
    ],
    requirements: ['Solid understanding of JavaScript & basic Python'],
    curriculum: [],
  },
  {
    id: 'course-3',
    title: 'Applied Generative AI & LLM Application Engineering',
    slug: 'applied-genai-llm',
    category: 'AI & ML',
    categoryId: 'ai-ml',
    level: 'Advanced',
    duration: '20 Hours',
    totalLessons: 36,
    rating: 4.95,
    reviewsCount: 940,
    studentsCount: 6800,
    price: 99.99,
    originalPrice: 149.99,
    isPopular: true,
    isBestseller: true,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
    instructor: {
      name: 'Dr. Elena Rostova',
      title: 'AI Research Scientist',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80',
    },
    shortDescription: 'Build RAG pipelines, fine-tune open-source models, and architect autonomous AI agents with LangChain and vector databases.',
    description: `Dive deep into production-grade LLM engineering. Learn Retrieval Augmented Generation (RAG), vector similarity search, function calling, semantic caching, and multi-agent coordination.`,
    whatYouWillLearn: [
      'Advanced prompt engineering and chain-of-thought orchestration',
      'Building hybrid vector RAG pipelines with Pinecone and pgvector',
      'Deploying LLM apps with streaming responses and guardrails',
    ],
    requirements: ['Proficiency in Python and basic machine learning concepts'],
    curriculum: [],
  },
  {
    id: 'course-4',
    title: 'Database Architecture & High-Performance SQL',
    slug: 'database-architecture-sql',
    category: 'Database',
    categoryId: 'database',
    level: 'Intermediate',
    duration: '18 Hours',
    totalLessons: 32,
    rating: 4.85,
    reviewsCount: 1120,
    studentsCount: 8900,
    price: 69.99,
    originalPrice: 99.99,
    isPopular: false,
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    instructor: {
      name: 'Marcus Vance',
      title: 'Database Infrastructure Lead',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    },
    shortDescription: 'Master relational schema design, B-Tree indexing, query plan optimization, and replication in PostgreSQL.',
    description: `Stop writing slow SQL queries. Learn how query optimizers execute your SQL, how to read EXPLAIN ANALYZE, tune indexes, design high-scale partitions, and scale PostgreSQL in cloud environments.`,
    whatYouWillLearn: [
      'PostgreSQL execution engine and index internals',
      'Optimizing complex joins, window functions, and CTEs',
      'Transaction isolation levels (ACID) and locking strategies',
    ],
    requirements: ['Basic familiarity with SQL syntax'],
    curriculum: [],
  },
  {
    id: 'course-5',
    title: 'Cloud Architecture & Kubernetes on AWS & GCP',
    slug: 'cloud-architecture-kubernetes',
    category: 'Cloud & DevOps',
    categoryId: 'cloud',
    level: 'Advanced',
    duration: '32 Hours',
    totalLessons: 64,
    rating: 4.88,
    reviewsCount: 1650,
    studentsCount: 9400,
    price: 89.99,
    originalPrice: 139.99,
    isPopular: false,
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    instructor: {
      name: 'Dr. Sarah Connor',
      title: 'Principal Software Architect',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    },
    shortDescription: 'Architect resilient multi-region infrastructure with Terraform, Docker, Kubernetes clusters, and GitOps CI/CD.',
    description: `Comprehensive cloud engineering handbook. Build production microservice topologies on EKS & GKE with zero-downtime rolling updates, service meshes, observability stacks, and infrastructure-as-code.`,
    whatYouWillLearn: [
      'Terraform infrastructure as code for cloud orchestration',
      'Kubernetes manifests, deployments, ingress controllers, and Helm',
      'Monitoring and tracing with Prometheus, Grafana, and OpenTelemetry',
    ],
    requirements: ['Linux command line comfort and basic container awareness'],
    curriculum: [],
  },
  {
    id: 'course-6',
    title: 'Practical Ethical Hacking & Defensive Security',
    slug: 'ethical-hacking-cybersecurity',
    category: 'Cyber Security',
    categoryId: 'cybersecurity',
    level: 'Beginner to Intermediate',
    duration: '22 Hours',
    totalLessons: 44,
    rating: 4.79,
    reviewsCount: 880,
    studentsCount: 7100,
    price: 74.99,
    originalPrice: 109.99,
    isPopular: false,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    instructor: {
      name: 'Devon Lee',
      title: 'Certified Information Systems Security Professional',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&auto=format&fit=crop&q=80',
    },
    shortDescription: 'Learn network penetration testing, web application vulnerabilities (OWASP Top 10), and practical defense hardening.',
    description: `Hands-on ethical hacking in safe sandboxed labs. Master Wireshark, Burp Suite, SQL injection, XSS exploitation, authentication bypasses, and secure coding practices.`,
    whatYouWillLearn: [
      'OWASP Top 10 vulnerabilities with interactive exploit labs',
      'Network scanning, reconnaissance, and protocol analysis',
      'Implementing secure defense architectures and zero-trust models',
    ],
    requirements: ['Basic computer networking knowledge (TCP/IP, HTTP)'],
    curriculum: [],
  },
]

export const enrolledCourses = [
  {
    id: 'course-1',
    title: 'Mastering Java & Object-Oriented Architecture',
    category: 'Programming',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    instructor: 'Dr. Sarah Connor',
    progress: 78,
    lastLesson: 'Polymorphism: Method Overriding vs Overloading',
    nextLessonId: 'les-2-4',
    completedLessons: 18,
    totalLessons: 24,
    totalHours: '24 Hours',
    lastAccessed: '2 hours ago',
    status: 'In Progress',
  },
  {
    id: 'course-2',
    title: 'Full-Stack Web Development with React & FastAPI',
    category: 'Web Development',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    instructor: 'Michael Chen',
    progress: 45,
    lastLesson: 'State Management with React Context & Hooks',
    nextLessonId: 'les-1-8',
    completedLessons: 12,
    totalLessons: 28,
    totalHours: '28 Hours',
    lastAccessed: 'Yesterday',
    status: 'In Progress',
  },
  {
    id: 'course-3',
    title: 'Applied Generative AI & LLM Application Engineering',
    category: 'AI & ML',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
    instructor: 'Dr. Elena Rostova',
    progress: 20,
    lastLesson: 'Vector Embeddings and Semantic Search with pgvector',
    nextLessonId: 'les-1-3',
    completedLessons: 4,
    totalLessons: 20,
    totalHours: '20 Hours',
    lastAccessed: '3 days ago',
    status: 'In Progress',
  },
  {
    id: 'course-4',
    title: 'Database Architecture & High-Performance SQL',
    category: 'Database',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    instructor: 'Marcus Vance',
    progress: 100,
    lastLesson: 'Course Conclusion & Distributed Sharding',
    nextLessonId: 'complete',
    completedLessons: 18,
    totalLessons: 18,
    totalHours: '18 Hours',
    lastAccessed: 'Completed Sep 22',
    status: 'Completed',
  },
]

export const activeLessonData = {
  courseId: 'course-1',
  courseTitle: 'Mastering Java & Object-Oriented Architecture',
  lessonId: 'les-2-4',
  lessonTitle: '4. Polymorphism: Method Overriding vs Overloading',
  moduleTitle: 'Module 2: Object-Oriented Programming (OOP) Deep Dive',
  duration: '50 min',
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  videoPoster: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
  description: `In this lesson, we explore Polymorphism—one of the foundational pillars of Object-Oriented Programming. We examine runtime polymorphism (method overriding with dynamic method dispatch) versus compile-time polymorphism (method overloading). You will learn how the JVM uses vtables to invoke the correct overridden implementation at runtime.`,
  notes: `### Key Takeaways:
1. **Method Overloading**: Multiple methods in the same class with the same name but different parameter signatures. Resolved at compile-time.
2. **Method Overriding**: Subclass redefines a method from the parent class with identical signature and return type (or covariant return type). Resolved at runtime.
3. **The @Override annotation**: Always use \`@Override\` to let the compiler verify you are correctly overriding a parent method.
4. **Dynamic Method Dispatch**: The JVM uses virtual tables (vtables) to locate the actual implementation of an overridden method at runtime based on the underlying object type.`,
  codeSnippet: `// Example: Dynamic Method Dispatch in Java
public abstract class PaymentProcessor {
    public abstract void processPayment(double amount);
}

public class StripePaymentProcessor extends PaymentProcessor {
    @Override
    public void processPayment(double amount) {
        System.out.println("Processing $" + amount + " through Stripe API");
    }
}

public class PayPalPaymentProcessor extends PaymentProcessor {
    @Override
    public void processPayment(double amount) {
        System.out.println("Processing $" + amount + " via PayPal Gateway");
    }
}`,
  resources: [
    { title: 'Lecture Slides (PDF)', size: '2.4 MB', type: 'pdf' },
    { title: 'Polymorphism Sample Project (.zip)', size: '14.2 MB', type: 'zip' },
    { title: 'Java 21 JVM Specification Cheat Sheet', size: '1.1 MB', type: 'pdf' },
  ],
  discussions: [
    {
      id: 'd1',
      author: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      time: '2 hours ago',
      comment: 'Can someone clarify if private methods in Java can be overridden? What does the compiler say?',
      replies: 2,
    },
    {
      id: 'd2',
      author: 'Dr. Sarah Connor (Instructor)',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100',
      time: '1 hour ago',
      comment: 'Great question David! No, private methods cannot be overridden because they are not visible outside their class. They are bound at compile time via invokevirtual/invokespecial.',
      replies: 0,
    },
  ],
}

export const mockQuiz = {
  id: 'quiz-java-oop',
  title: 'Java Basics & OOP Architecture Quiz',
  courseTitle: 'Mastering Java & Object-Oriented Architecture',
  durationMinutes: 15,
  totalQuestions: 10,
  passingScore: 70,
  questions: [
    {
      id: 1,
      text: 'Which principle of OOP describes bundling data and methods that operate on that data within a single unit and restricting direct access to internal details?',
      options: [
        'Inheritance',
        'Encapsulation',
        'Polymorphism',
        'Abstraction',
      ],
      correctAnswer: 1,
      explanation: 'Encapsulation is the mechanism that wraps data (attributes) and code (methods) together as a single unit, safeguarding it against direct manipulation.',
    },
    {
      id: 2,
      text: 'What is the main difference between method overloading and method overriding in Java?',
      options: [
        'Overloading happens at runtime; overriding happens at compile-time',
        'Overloading requires different method signatures; overriding requires identical signatures',
        'Overloading only occurs in different packages; overriding happens in the same file',
        'Overloading requires the @Override annotation, while overriding does not',
      ],
      correctAnswer: 1,
      explanation: 'Method overloading requires the same method name but different argument lists (compile-time polymorphism). Overriding requires identical method signatures in a subclass (runtime polymorphism).',
    },
    {
      id: 3,
      text: 'In Java, can an interface have concrete methods with implementations?',
      options: [
        'No, interfaces can only have abstract methods',
        'Yes, starting with Java 8 using the default or static keywords',
        'Yes, but only if the interface extends an abstract class',
        'No, concrete methods are strictly reserved for abstract classes',
      ],
      correctAnswer: 1,
      explanation: 'Java 8 introduced default and static methods in interfaces, allowing developer to add concrete implementations without breaking backwards compatibility.',
    },
    {
      id: 4,
      text: 'What keyword prevents a class from being inherited or subclassed in Java?',
      options: [
        'static',
        'abstract',
        'final',
        'immutable',
      ],
      correctAnswer: 2,
      explanation: 'Declaring a class as final prevents other classes from extending it (e.g., java.lang.String is a final class).',
    },
    {
      id: 5,
      text: 'Where are objects and their instance variables stored in the Java memory model?',
      options: [
        'Heap Memory',
        'Stack Memory',
        'Register Memory',
        'Program Counter Cache',
      ],
      correctAnswer: 0,
      explanation: 'All objects and their instance variables are allocated on the Heap memory, managed by the Garbage Collector.',
    },
    {
      id: 6,
      text: 'Which collection interface should you use when you require key-value pairs with unique keys and fast O(1) lookups?',
      options: [
        'ArrayList',
        'HashSet',
        'HashMap',
        'LinkedList',
      ],
      correctAnswer: 2,
      explanation: 'HashMap provides amortized O(1) time complexity for get() and put() operations based on hash codes.',
    },
    {
      id: 7,
      text: 'What is the default initial capacity of an ArrayList in Java when instantiated with new ArrayList<>()?',
      options: [
        '0 (until the first element is added, then 10)',
        '16',
        '32',
        '8',
      ],
      correctAnswer: 0,
      explanation: 'In modern Java, an empty ArrayList initializes with an empty element data array and expands to capacity 10 upon adding its first element.',
    },
    {
      id: 8,
      text: 'Which exception is thrown when an application attempts to use null where an object reference is required?',
      options: [
        'IllegalArgumentException',
        'NullPointerException',
        'IllegalStateException',
        'ClassCastException',
      ],
      correctAnswer: 1,
      explanation: 'NullPointerException (NPE) is thrown when attempting to dereference a null pointer in Java.',
    },
    {
      id: 9,
      text: 'What is the purpose of the super keyword when used inside a subclass constructor?',
      options: [
        'It terminates the constructor execution',
        'It invokes the constructor of the direct parent (superclass)',
        'It creates a new thread in the JVM',
        'It checks whether the subclass has implemented all interfaces',
      ],
      correctAnswer: 1,
      explanation: 'super(...) calls the constructor of the parent class and must be the first statement in the subclass constructor.',
    },
    {
      id: 10,
      text: 'What is the outcome of compiling and running code where an unhandled checked exception is thrown?',
      options: [
        'The program compiles cleanly and ignores the exception',
        'The compiler will issue a compilation error unless handled with try-catch or declared with throws',
        'The JVM reboots automatically',
        'It converts the checked exception into an unchecked AssertionError',
      ],
      correctAnswer: 1,
      explanation: 'Checked exceptions in Java are verified at compile-time. They must be caught or declared in the method signature with throws.',
    },
  ],
}

export const mockAssignments = [
  {
    id: 'asg-01',
    courseId: 'course-1',
    courseTitle: 'Mastering Java & Object-Oriented Architecture',
    title: 'Assignment 2: Build a Polymorphic E-Commerce Checkout Engine',
    dueDate: 'October 10, 2026 • 11:59 PM',
    status: 'Submitted',
    points: 100,
    grade: 96,
    submittedDate: 'Oct 8, 2026 at 4:32 PM',
    submittedFile: 'ecommerce-checkout-engine-v1.zip',
    fileSize: '4.8 MB',
    instructions: `### Objective
Design and implement a clean, extensible checkout pipeline for an online store using Java 21 OOP principles.

### Key Requirements:
1. Create a base \`PaymentMethod\` abstraction with concrete implementations: \`CreditCardPayment\`, \`CryptoPayment\`, and \`PayPalPayment\`.
2. Implement custom business validation rules (e.g. valid expiry dates, minimum charge amounts).
3. Ensure transactions implement clean error handling and structured logging.
4. Include comprehensive JUnit 5 unit tests with at least 85% branch coverage.

### Rubric:
- **OOP Architecture & Clean Code**: 40 pts
- **Exception Handling & Validation**: 30 pts
- **Unit Test Coverage & Quality**: 30 pts`,
    feedback: {
      instructor: 'Dr. Sarah Connor',
      date: 'Oct 9, 2026',
      comments: 'Exceptional work, Alex! Your use of the Strategy pattern for the discount calculator was elegant, and the test coverage exceeded requirements. Minor note: remember to sanitize logged credit card payloads.',
    },
  },
  {
    id: 'asg-02',
    courseId: 'course-2',
    courseTitle: 'Full-Stack Web Development with React & FastAPI',
    title: 'Assignment 3: Implement Async JWT Refresh Flow with FastAPI & React',
    dueDate: 'October 16, 2026 • 11:59 PM',
    status: 'In Progress',
    points: 100,
    grade: null,
    submittedDate: null,
    instructions: `### Objective
Build a secure authentication system that handles silent access token refresh using HTTP-only cookies and Axios response interceptors.`,
  },
  {
    id: 'asg-03',
    courseId: 'course-3',
    courseTitle: 'Applied Generative AI & LLM Application Engineering',
    title: 'Assignment 1: Build a Hybrid Search RAG Pipeline with pgvector',
    dueDate: 'October 24, 2026 • 11:59 PM',
    status: 'Not Started',
    points: 100,
    grade: null,
    submittedDate: null,
    instructions: `### Objective
Implement text chunking, reciprocal rank fusion (RRF), and vector similarity retrieval over PostgreSQL using the pgvector extension.`,
  },
]

export const analyticsData = {
  overallProgress: 72,
  totalHoursLearned: 48.5,
  coursesCompleted: 2,
  averageQuizScore: 88,
  assignmentsCompleted: 9,
  currentStreak: 14,
  weeklyActivity: [
    { day: 'Mon', hours: 3.5, active: true },
    { day: 'Tue', hours: 4.0, active: true },
    { day: 'Wed', hours: 2.5, active: true },
    { day: 'Thu', hours: 5.0, active: true },
    { day: 'Fri', hours: 3.0, active: true },
    { day: 'Sat', hours: 6.5, active: true },
    { day: 'Sun', hours: 4.5, active: true },
  ],
  quizPerformance: [
    { name: 'Java Basics', score: 92, date: 'Sep 10' },
    { name: 'OOP Pillars', score: 85, date: 'Sep 18' },
    { name: 'Collections & Streams', score: 90, date: 'Sep 24' },
    { name: 'SQL Indexing', score: 95, date: 'Sep 28' },
    { name: 'FastAPI Routing', score: 80, date: 'Oct 02' },
  ],
  achievements: [
    { id: 'ach-1', title: '14-Day Streak', icon: '🔥', description: 'Learned continuously for 14 consecutive days', earnedDate: 'Earned Yesterday' },
    { id: 'ach-2', title: 'Quiz Master', icon: '🏆', description: 'Scored 90%+ on 3 consecutive quizzes', earnedDate: 'Earned 3 days ago' },
    { id: 'ach-3', title: 'Code Architect', icon: '⚡', description: 'Completed all OOP design pattern challenges', earnedDate: 'Earned last week' },
    { id: 'ach-4', title: 'Lifelong Scholar', icon: '🎓', description: 'Completed 2 certified specialization tracks', earnedDate: 'Earned Sep 22' },
  ],
  recentActivity: [
    { type: 'quiz', title: 'Completed Java OOP Pillars Quiz', score: '85%', time: '2 hours ago' },
    { type: 'lesson', title: 'Finished Lesson: Inheritance & Super Keyword', time: 'Yesterday' },
    { type: 'assignment', title: 'Submitted Assignment: E-Commerce Engine', time: '2 days ago' },
    { type: 'certificate', title: 'Earned Certificate in Database Architecture', time: '1 week ago' },
  ],
}

export const mockCertificates = [
  {
    id: 'CERT-JAVA-2026-9812',
    courseId: 'course-1',
    courseTitle: 'Mastering Java & Object-Oriented Architecture',
    studentName: 'Alex Johnson',
    issueDate: 'October 1, 2026',
    credentialId: 'EDU-8921-X99J',
    grade: '94% (High Honors)',
    instructor: 'Dr. Sarah Connor',
    instructorTitle: 'Principal Software Architect & Lead Instructor',
    verificationUrl: 'https://elearn.platform/verify/EDU-8921-X99J',
    skills: ['Java 21', 'Object-Oriented Design', 'Design Patterns', 'JUnit 5', 'JVM Architecture'],
  },
  {
    id: 'CERT-SQL-2026-4412',
    courseId: 'course-4',
    courseTitle: 'Database Architecture & High-Performance SQL',
    studentName: 'Alex Johnson',
    issueDate: 'September 22, 2026',
    credentialId: 'EDU-7734-SQLP',
    grade: '98% (Honors)',
    instructor: 'Marcus Vance',
    instructorTitle: 'Database Infrastructure Lead',
    verificationUrl: 'https://elearn.platform/verify/EDU-7734-SQLP',
    skills: ['PostgreSQL', 'Query Plan Optimization', 'B-Tree Indexing', 'Transaction Isolation', 'Partitioning'],
  },
]

export const aiTutorInitialMessages = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: `Hello Alex! 👋 I'm your AI Learning Assistant for **Mastering Java & OOP**. 

I can explain complex concepts, generate custom practice quizzes, review your code, or draft a personalized study plan. What would you like to explore today?`,
    timestamp: '10:00 AM',
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: 'Can you explain Polymorphism in simple terms with a real-world Java example?',
    timestamp: '10:02 AM',
  },
  {
    id: 'msg-3',
    sender: 'ai',
    text: `**Polymorphism** (from Greek: "many forms") allows objects of different classes to be treated as objects of a common superclass.

In simple terms: **One interface, multiple implementations.**

### Real-World Analogy:
Think of an universal **Remote Control**. It has a button called \`powerOn()\`. Whether you point it at a **Television**, an **Air Conditioner**, or a **Soundbar**, each device turns on, but *how* each executes the power-on routine is unique to that device!

### In Java:
\`\`\`java
public interface NotificationService {
    void sendNotification(String message);
}

// Implementation 1: Email
public class EmailService implements NotificationService {
    @Override
    public void sendNotification(String message) {
        System.out.println("Sending Email: " + message);
    }
}

// Implementation 2: SMS
public class SMSService implements NotificationService {
    @Override
    public void sendNotification(String message) {
        System.out.println("Sending SMS text: " + message);
    }
}
\`\`\`

When your application triggers notifications, it doesn't need to know whether it's dealing with Email or SMS—it simply calls \`service.sendNotification(msg)\`!

Would you like me to test your understanding with a quick 3-question mini quiz?`,
    timestamp: '10:03 AM',
  },
]

export const instructorDashboardData = {
  stats: {
    totalStudents: 18450,
    studentsGrowth: '+12% this month',
    activeCourses: 6,
    totalRevenue: 52400,
    revenueGrowth: '+18% vs last month',
    averageRating: 4.9,
    reviewsCount: 3820,
  },
  revenueTrend: [
    { month: 'May', revenue: 6400 },
    { month: 'Jun', revenue: 7800 },
    { month: 'Jul', revenue: 9200 },
    { month: 'Aug', revenue: 11400 },
    { month: 'Sep', revenue: 13800 },
    { month: 'Oct', revenue: 15200 },
  ],
  coursePerformance: [
    {
      id: 'course-1',
      title: 'Mastering Java & Object-Oriented Architecture',
      students: 14800,
      completionRate: 74,
      revenue: '$28,450',
      rating: 4.9,
      status: 'Published',
    },
    {
      id: 'course-5',
      title: 'Cloud Architecture & Kubernetes on AWS & GCP',
      students: 9400,
      completionRate: 68,
      revenue: '$14,200',
      rating: 4.88,
      status: 'Published',
    },
    {
      id: 'course-new',
      title: 'Distributed Systems with Apache Kafka & Golang',
      students: 120,
      completionRate: 91,
      revenue: '$9,750',
      rating: 4.96,
      status: 'Draft',
    },
  ],
  recentSubmissions: [
    {
      id: 'sub-1',
      student: 'Alex Johnson',
      course: 'Mastering Java & OOP',
      assignment: 'E-Commerce Engine',
      submittedAt: '2 hours ago',
      grade: '96/100',
      status: 'Graded',
    },
    {
      id: 'sub-2',
      student: 'Maria Garcia',
      course: 'Cloud Architecture & K8s',
      assignment: 'Terraform Cluster Blueprint',
      submittedAt: '3 hours ago',
      grade: null,
      status: 'Needs Grading',
    },
    {
      id: 'sub-3',
      student: 'Liam Vance',
      course: 'Mastering Java & OOP',
      assignment: 'Concurrency Pipeline',
      submittedAt: '5 hours ago',
      grade: null,
      status: 'Needs Grading',
    },
  ],
}
