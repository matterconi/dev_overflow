import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const techMap: { [key: string]: string } = {
  // JavaScript variations
  javascript: "devicon-javascript-plain",
  js: "devicon-javascript-plain",

  // TypeScript variations
  typescript: "devicon-typescript-plain",
  ts: "devicon-typescript-plain",

  // React variations
  react: "devicon-react-original",
  reactjs: "devicon-react-original",

  // Next.js variations
  nextjs: "devicon-nextjs-plain",
  next: "devicon-nextjs-plain",

  // Node.js variations
  nodejs: "devicon-nodejs-plain",
  node: "devicon-nodejs-plain",

  // Bun.js variations
  bun: "devicon-bun-plain",
  bunjs: "devicon-bun-plain",

  // Deno.js variations
  deno: "devicon-denojs-original",
  denojs: "devicon-denojs-plain",

  // Python
  python: "devicon-python-plain",

  // Java
  java: "devicon-java-plain",

  // C++
  "c++": "devicon-cplusplus-plain",
  cpp: "devicon-cplusplus-plain",

  // C#
  "c#": "devicon-csharp-plain",
  csharp: "devicon-csharp-plain",

  // PHP
  php: "devicon-php-plain",

  // HTML
  html: "devicon-html5-plain",
  html5: "devicon-html5-plain",

  // CSS
  css: "devicon-css3-plain",
  css3: "devicon-css3-plain",

  // Git
  git: "devicon-git-plain",

  // Docker
  docker: "devicon-docker-plain",

  // MongoDB
  mongodb: "devicon-mongodb-plain",
  mongo: "devicon-mongodb-plain",

  // MySQL
  mysql: "devicon-mysql-plain",

  // PostgreSQL
  postgresql: "devicon-postgresql-plain",
  postgres: "devicon-postgresql-plain",

  // AWS variations
  aws: "devicon-amazonwebservices-original",
  "amazon web services": "devicon-amazonwebservices-original",

  // Firebase
  firebase: "devicon-firebase-plain",

  // GraphQL
  graphql: "devicon-graphql-plain",

  // Vue.js
  vue: "devicon-vuejs-plain",
  vuejs: "devicon-vuejs-plain",

  // Tailwind CSS
  tailwind: "devicon-tailwindcss-plain",
  tailwindcss: "devicon-tailwindcss-plain",

  // Angular
  angular: "devicon-angularjs-plain",

  // jQuery
  jquery: "devicon-jquery-plain",

  // SASS
  sass: "devicon-sass-plain",

  // Laravel
  laravel: "devicon-laravel-plain",

  // Ruby on Rails
  rails: "devicon-rails-plain",
  ruby: "devicon-rails-plain",

  // Redis
  redis: "devicon-redis-plain",

  // Linux
  linux: "devicon-linux-plain",

  // Jenkins
  jenkins: "devicon-jenkins-plain",

  // Kubernetes
  kubernetes: "devicon-kubernetes-plain",

  // Azure
  azure: "devicon-azure-plain",
  "azure devops": "devicon-azure-plain",

  // Google Cloud Platform
  gcp: "devicon-googlecloud-plain",
  "google cloud": "devicon-googlecloud-plain",

  // Bitbucket
  bitbucket: "devicon-bitbucket-plain",

  // NGINX
  nginx: "devicon-nginx-plain",

  // Blender
  blender: "devicon-blender-plain",

  // Unity
  unity: "devicon-unity-original",

  // Unreal Engine
  unreal: "devicon-unrealengine-original",

  // Swift
  swift: "devicon-swift-plain",

  // Kotlin
  kotlin: "devicon-kotlin-plain",

  // Go
  go: "devicon-go-plain",

  // Rust
  rust: "devicon-rust-plain",

  // Dart
  dart: "devicon-dart-plain",

  // Flask
  flask: "devicon-flask-original",

  // Django
  django: "devicon-django-plain",

  // Bootstrap
  bootstrap: "devicon-bootstrap-plain",

  // Material-UI
  materialui: "devicon-materialui-plain",
  "material ui": "devicon-materialui-plain",

  // Adobe tools
  photoshop: "devicon-photoshop-plain",
  illustrator: "devicon-illustrator-plain",
  xd: "devicon-xd-plain",
  premiere: "devicon-premiere-plain",

  // Figma
  figma: "devicon-figma-plain",

  // Inkscape
  inkscape: "devicon-inkscape-plain",

  // Trello
  trello: "devicon-trello-plain",

  // Jira
  jira: "devicon-jira-plain",

  // Heroku
  heroku: "devicon-heroku-plain",

  // Elasticsearch
  elasticsearch: "devicon-elasticsearch-plain",

  // Redux
  redux: "devicon-redux-original",

  // Three.js
  threejs: "devicon-threejs-original",
};

export const techDescriptionMap: { [key: string]: string } = {
  javascript:
    "JavaScript is a powerful language for building dynamic, interactive, and modern web applications.",
  js: "JavaScript is a powerful language for building dynamic, interactive, and modern web applications.",
  typescript:
    "TypeScript adds strong typing to JavaScript, making it great for scalable and maintainable applications.",
  ts: "TypeScript adds strong typing to JavaScript, making it great for scalable and maintainable applications.",
  react:
    "React is a popular library for building fast and modular user interfaces.",
  reactjs:
    "React is a popular library for building fast and modular user interfaces.",
  nextjs:
    "Next.js is a React framework for server-side rendering and building optimized web applications.",
  next:
    "Next.js is a React framework for server-side rendering and building optimized web applications.",
  nodejs:
    "Node.js enables server-side JavaScript, allowing you to create fast, scalable network applications.",
  node:
    "Node.js enables server-side JavaScript, allowing you to create fast, scalable network applications.",
  bun: "Bun is a fast JavaScript runtime and toolkit designed to streamline development workflows.",
  bunjs:
    "Bun is a fast JavaScript runtime and toolkit designed to streamline development workflows.",
  deno: "Deno is a modern runtime for JavaScript and TypeScript focused on security and developer experience.",
  denojs:
    "Deno is a modern runtime for JavaScript and TypeScript focused on security and developer experience.",
  python:
    "Python is a versatile language known for readability and a vast ecosystem, often used for data science and automation.",
  java: "Java is an object-oriented language commonly used for enterprise applications and Android development.",
  "c++":
    "C++ is a high-performance language suitable for system software, game engines, and complex applications.",
  cpp: "C++ is a high-performance language suitable for system software, game engines, and complex applications.",
  cplusplus:
    "C++ is a high-performance language suitable for system software, game engines, and complex applications.",
  "c#":
    "C# is a modern programming language from Microsoft, widely used for web apps, enterprise software, and game development.",
  csharp:
    "C# is a modern programming language from Microsoft, widely used for web apps, enterprise software, and game development.",
  php: "PHP is a server-side scripting language commonly used to build dynamic websites and web applications.",
  html: "HTML provides the core structure and semantic markup used to build web pages.",
  html5:
    "HTML5 is the modern standard for structuring web content with rich semantic and multimedia support.",
  css: "CSS is used to style and visually design websites, controlling layout, colors, and typography.",
  css3:
    "CSS3 expands web styling with modern layout systems, animations, and responsive design features.",
  git: "Git is a version control system that tracks changes in source code during software development.",
  docker:
    "Docker is a container platform that simplifies application deployment and environment management.",
  mongodb:
    "MongoDB is a NoSQL database for handling large volumes of flexible, document-based data.",
  mongo:
    "MongoDB is a NoSQL database for handling large volumes of flexible, document-based data.",
  mysql:
    "MySQL is a popular relational database, known for reliability and ease of use.",
  postgresql:
    "PostgreSQL is a robust open-source relational database with advanced features and strong SQL compliance.",
  postgres:
    "PostgreSQL is a robust open-source relational database with advanced features and strong SQL compliance.",
  aws: "AWS is a comprehensive cloud platform offering a wide range of services for deployment, storage, and more.",
  amazonwebservices:
    "AWS is a comprehensive cloud platform offering a wide range of services for deployment, storage, and more.",
  firebase:
    "Firebase is a backend platform by Google that helps build apps with authentication, databases, hosting, and analytics.",
  graphql:
    "GraphQL is a query language for APIs that lets clients request exactly the data they need.",
  vue: "Vue is a progressive JavaScript framework focused on building approachable and reactive user interfaces.",
  vuejs:
    "Vue is a progressive JavaScript framework focused on building approachable and reactive user interfaces.",
  tailwind:
    "Tailwind CSS is a utility-first CSS framework that helps build custom interfaces quickly.",
  tailwindcss:
    "Tailwind CSS is a utility-first CSS framework that helps build custom interfaces quickly.",
  angular:
    "Angular is a full-featured frontend framework for building large-scale, structured web applications.",
  jquery:
    "jQuery is a JavaScript library that simplifies DOM manipulation, events, and AJAX interactions.",
  sass: "Sass is a CSS preprocessor that adds variables, nesting, and reusable patterns to stylesheets.",
  laravel:
    "Laravel is a PHP framework known for elegant syntax, strong conventions, and built-in web development tools.",
  rails:
    "Ruby on Rails is a web framework that emphasizes convention over configuration for rapid application development.",
  ruby: "Ruby is a developer-friendly language known for elegant syntax and productivity, especially in web development.",
  redis:
    "Redis is an in-memory data store often used for caching, real-time features, and fast key-value access.",
  linux:
    "Linux is an open-source operating system widely used on servers, cloud platforms, and developer machines.",
  jenkins:
    "Jenkins is a popular automation server used to build, test, and deploy software in CI/CD pipelines.",
  kubernetes:
    "Kubernetes is a container orchestration platform used to deploy, scale, and manage distributed applications.",
  azure:
    "Microsoft Azure is a cloud platform offering infrastructure, AI, storage, and application services.",
  azuredevops:
    "Azure DevOps provides tools for planning, building, testing, and deploying software collaboratively.",
  gcp: "Google Cloud Platform provides cloud infrastructure and managed services for modern application development.",
  googlecloud:
    "Google Cloud Platform provides cloud infrastructure and managed services for modern application development.",
  bitbucket:
    "Bitbucket is a Git-based collaboration platform for hosting repositories and managing development workflows.",
  nginx:
    "NGINX is a high-performance web server and reverse proxy commonly used for serving apps and load balancing.",
  blender:
    "Blender is an open-source 3D creation suite used for modeling, animation, rendering, and visual effects.",
  unity:
    "Unity is a cross-platform game engine used to create 2D, 3D, AR, and VR experiences.",
  unreal:
    "Unreal Engine is a powerful real-time 3D engine widely used in games, simulation, and cinematic production.",
  swift:
    "Swift is Apple's modern programming language for building apps across iOS, macOS, watchOS, and tvOS.",
  kotlin:
    "Kotlin is a modern JVM language known for concise syntax and strong Android development support.",
  go: "Go is a fast, statically typed language designed for simplicity, concurrency, and scalable backend systems.",
  rust: "Rust is a systems programming language focused on performance, reliability, and memory safety.",
  dart: "Dart is a client-optimized language developed by Google, commonly used with Flutter for cross-platform apps.",
  flask:
    "Flask is a lightweight Python web framework that gives developers flexibility for building APIs and web apps.",
  django:
    "Django is a high-level Python web framework that promotes rapid development and clean, pragmatic design.",
  bootstrap:
    "Bootstrap is a frontend framework that provides ready-made components and responsive layout utilities.",
  materialui:
    "Material UI is a React component library that implements Google's Material Design system.",
  photoshop:
    "Adobe Photoshop is a professional image editing tool widely used for photo manipulation, design, and digital art.",
  illustrator:
    "Adobe Illustrator is a vector graphics tool used to create logos, illustrations, and scalable design assets.",
  xd: "Adobe XD is a UI and UX design tool used for wireframing, prototyping, and interface design.",
  premiere:
    "Adobe Premiere Pro is a professional video editing application used for editing and post-production workflows.",
  figma:
    "Figma is a collaborative design platform used for interface design, prototyping, and team workflows.",
  inkscape:
    "Inkscape is an open-source vector graphics editor used to create illustrations, icons, and scalable artwork.",
  trello:
    "Trello is a visual project management tool that organizes work through boards, lists, and cards.",
  jira: "Jira is a project tracking platform widely used by software teams to manage tasks, bugs, and agile workflows.",
  heroku:
    "Heroku is a cloud platform that makes it easy to deploy, run, and scale web applications.",
  elasticsearch:
    "Elasticsearch is a distributed search and analytics engine optimized for fast querying of large datasets.",
  redux:
    "Redux is a predictable state management library often used to manage complex application state in JavaScript apps.",
  threejs:
    "Three.js is a JavaScript library for building interactive 3D graphics and experiences in the browser.",
};

export const getTechDescription = (techName: string) => {
  const normalizedTechName = techName.replace(/[ .]/g, "").toLowerCase();
  return techDescriptionMap[normalizedTechName]
    ? techDescriptionMap[normalizedTechName]
    : "We do not have a description for this tag at the moment.";
};

export const getDeviconClassNames = (iconName: string) => {
  const normalizedIconName = iconName.replace(/[ .]/g, "").toLowerCase();
  return techMap[normalizedIconName]
    ? `${techMap[normalizedIconName]} colored`
    : "devicon-devicon-plain";
};

export const getTimeStamp = (date: Date) => {
  const currentDate = new Date();
  const createdAt = new Date(date);
  const diff = currentDate.getTime() - createdAt.getTime();
  const diffInSeconds = Math.floor(diff / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInMonths / 12);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays} days ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} months ago`;
  } else {
    return `${diffInYears} years ago`;
  }
};

export const formatNumber = (value: number) => {
  if (!Number.isFinite(value)) return "0";

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

import { BADGE_CRITERIA } from "@/constants";
import type { BadgeCount } from "@/types/global";

export function assignBadges(params: {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }[];
}): BadgeCount {
  const badgeCounts: BadgeCount = { GOLD: 0, SILVER: 0, BRONZE: 0 };

  for (const { type, count } of params.criteria) {
    const badgeLevels = BADGE_CRITERIA[type];

    for (const level of Object.keys(badgeLevels) as (keyof typeof badgeLevels)[]) {
      if (count >= badgeLevels[level]) {
        badgeCounts[level as keyof BadgeCount] += 1;
      }
    }
  }

  return badgeCounts;
}
