interface Tag {
    _id: string;
    name: string;
  }
  
  interface Author {
    _id: string;
    name: string;
    imgUrl: string;
  }

interface Question {
    _id: string;
    title: string;
    description: string;
    tags: Tag[];
    author: Author;
    createdAt: Date;
    upvotes: number;
    answers: number;
    views: number;
}