export interface Game {
  id: string;
  title: string;
  platform: string[];
  reviews?: string[]; // מערך של מזהי ביקורות
}

export interface Review {
  id: string;
  rating: number;
  content: string;
  gameId: string; // מזהה המשחק שאליו שייכת הביקורת
  authorId: string; // מזהה המחבר שכתב את הביקורת
}

export interface Author {
  id: string;
  name: string;
  verified: boolean;
  reviews?: string[]; // מערך של מזהי ביקורות שכתב המחבר
}

export const db: {
  games: Game[];
  reviews: Review[];
  authors: Author[];
} = {
  games: [
    {
      id: "1",
      title: "The Legend of Zelda: Breath of the Wild",
      platform: ["Nintendo Switch", "Wii U"],
      reviews: ["1", "2"],
    },
    {
      id: "2",
      title: "Red Dead Redemption 2",
      platform: ["PlayStation 4", "Xbox One", "PC"],
      reviews: ["3"],
    },
    {
      id: "3",
      title: "God of War",
      platform: ["PlayStation 4", "PC"],
      reviews: ["4", "5"],
    },
  ],
  reviews: [
    {
      id: "1",
      rating: 5,
      content: "משחק מדהים! עולם פתוח מרהיב ומלא בתוכן",
      gameId: "1",
      authorId: "1",
    },
    {
      id: "2",
      rating: 4,
      content: "מצוין, אבל לפעמים קצת מתסכל",
      gameId: "1",
      authorId: "2",
    },
    {
      id: "3",
      rating: 5,
      content: "יצירת מופת. הסיפור והדמויות מרגשים",
      gameId: "2",
      authorId: "1",
    },
    {
      id: "4",
      rating: 5,
      content: "אחד המשחקים הטובים ביותר שיצא לי לשחק",
      gameId: "3",
      authorId: "3",
    },
    {
      id: "5",
      rating: 4,
      content: "מערכת הקרב מצוינת, אבל הסיפור קצת צפוי",
      gameId: "3",
      authorId: "2",
    },
  ],
  authors: [
    {
      id: "1",
      name: "דן ישראלי",
      verified: true,
      reviews: ["1", "3"],
    },
    {
      id: "2",
      name: "רונית כהן",
      verified: true,
      reviews: ["2", "5"],
    },
    {
      id: "3",
      name: "יוסי לוי",
      verified: false,
      reviews: ["4"],
    },
  ],
};
