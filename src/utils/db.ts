
import { QuickDB } from 'quick.db';

// Initialize the database
const db = new QuickDB();

// Define database operations
export const dbOperations = {
  // Poll operations
  polls: {
    getAll: async () => {
      return await db.get('polls') || [];
    },
    set: async (polls: any[]) => {
      return await db.set('polls', polls);
    },
    add: async (poll: any) => {
      const polls = await db.get('polls') || [];
      polls.unshift(poll);
      return await db.set('polls', polls);
    },
    vote: async (pollId: string, optionId: string) => {
      const polls = await db.get('polls') || [];
      const updatedPolls = polls.map(poll => {
        if (poll.id === pollId) {
          const updatedOptions = poll.options.map(option => {
            if (option.id === optionId) {
              return { ...option, votes: option.votes + 1 };
            }
            return option;
          });
          return {
            ...poll,
            options: updatedOptions,
            totalVotes: poll.totalVotes + 1
          };
        }
        return poll;
      });
      return await db.set('polls', updatedPolls);
    }
  },
  
  // Post operations
  posts: {
    getAll: async () => {
      return await db.get('posts') || [];
    },
    set: async (posts: any[]) => {
      return await db.set('posts', posts);
    },
    add: async (post: any) => {
      const posts = await db.get('posts') || [];
      posts.unshift(post);
      return await db.set('posts', posts);
    }
  },
  
  // Video operations
  videos: {
    getAll: async () => {
      return await db.get('videos') || [];
    },
    set: async (videos: any[]) => {
      return await db.set('videos', videos);
    },
    add: async (video: any) => {
      const videos = await db.get('videos') || [];
      videos.unshift(video);
      return await db.set('videos', videos);
    }
  },
  
  // Worry jar operations
  worries: {
    getAll: async () => {
      return await db.get('worries') || [];
    },
    set: async (worries: any[]) => {
      return await db.set('worries', worries);
    },
    add: async (worry: any) => {
      const worries = await db.get('worries') || [];
      worries.unshift(worry);
      return await db.set('worries', worries);
    },
    archive: async (worryId: string) => {
      const worries = await db.get('worries') || [];
      const updatedWorries = worries.map(worry => 
        worry.id === worryId ? { ...worry, archived: true } : worry
      );
      return await db.set('worries', updatedWorries);
    },
    delete: async (worryId: string) => {
      const worries = await db.get('worries') || [];
      const updatedWorries = worries.filter(worry => worry.id !== worryId);
      return await db.set('worries', updatedWorries);
    }
  }
};

// Initialize with sample data if needed
export const initializeDatabase = async () => {
  // Check if polls exist
  const polls = await db.get('polls');
  if (!polls) {
    // Sample polls data if none exists
    const samplePolls = [
      {
        id: "p1",
        question: "What's your favorite programming language?",
        options: [
          { id: "o1", text: "JavaScript", votes: 15 },
          { id: "o2", text: "Python", votes: 12 },
          { id: "o3", text: "TypeScript", votes: 8 },
          { id: "o4", text: "Java", votes: 5 }
        ],
        author: "Robert Fox",
        authorImage: "https://randomuser.me/api/portraits/men/2.jpg",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        totalVotes: 40,
        category: "Technology"
      },
      {
        id: "p2",
        question: "Which city would you most like to visit?",
        options: [
          { id: "o1", text: "Paris", votes: 22 },
          { id: "o2", text: "Tokyo", votes: 18 },
          { id: "o3", text: "New York", votes: 14 },
          { id: "o4", text: "London", votes: 12 }
        ],
        author: "Jane Cooper",
        authorImage: "https://randomuser.me/api/portraits/women/1.jpg",
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        totalVotes: 66,
        category: "Travel"
      }
    ];
    await db.set('polls', samplePolls);
  }
};

export default db;
