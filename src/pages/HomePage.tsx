
import React from "react";
import MasonryGrid from "../components/MasonryGrid";

const contentItems = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    title: "Breathtaking Views: The Most Beautiful Landscapes Around the World",
    author: "Jane Cooper",
    authorImage: "https://randomuser.me/api/portraits/women/1.jpg",
    category: "Travel",
    height: 26
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    title: "Healthy Eating: Colorful Meals That Boost Your Immune System",
    author: "Robert Fox",
    authorImage: "https://randomuser.me/api/portraits/men/2.jpg",
    category: "Food",
    height: 30
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7",
    title: "Fashion Forward: Spring Trends Everyone Will Be Wearing",
    author: "Esther Howard",
    authorImage: "https://randomuser.me/api/portraits/women/3.jpg",
    category: "Fashion",
    height: 28
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0",
    title: "Tech Talk: The Latest Gadgets You Need to Check Out",
    author: "Devon Lane",
    authorImage: "https://randomuser.me/api/portraits/men/4.jpg",
    category: "Technology",
    height: 24
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1520262389826-d559a9aca921",
    title: "Fitness Journey: How to Stay Motivated and Reach Your Goals",
    author: "Cameron Williamson",
    authorImage: "https://randomuser.me/api/portraits/women/5.jpg",
    category: "Fitness",
    height: 32
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8",
    title: "DIY Home Decor: Simple Projects to Transform Your Space",
    author: "Brooklyn Simmons",
    authorImage: "https://randomuser.me/api/portraits/men/6.jpg",
    category: "Home",
    height: 28
  },
  {
    id: "7",
    image: "https://images.unsplash.com/photo-1579546929662-711aa81148cf",
    title: "Artistic Expression: Contemporary Artists Pushing Boundaries",
    author: "Savannah Nguyen",
    authorImage: "https://randomuser.me/api/portraits/women/7.jpg",
    category: "Art",
    height: 26
  },
  {
    id: "8",
    image: "https://images.unsplash.com/photo-1534329539061-64caeb388c42",
    title: "Wanderlust: Hidden Gems Off the Beaten Path",
    author: "Wade Warren",
    authorImage: "https://randomuser.me/api/portraits/men/8.jpg",
    category: "Travel",
    height: 30
  },
  {
    id: "9",
    image: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0",
    title: "Plant-Based Living: Easy Recipes for Beginners",
    author: "Leslie Alexander",
    authorImage: "https://randomuser.me/api/portraits/women/9.jpg",
    category: "Food",
    height: 28
  },
  {
    id: "10",
    image: "https://images.unsplash.com/photo-1544652478-6653e09f18a2",
    title: "Mindfulness Practices for Better Mental Health",
    author: "Guy Hawkins",
    authorImage: "https://randomuser.me/api/portraits/men/10.jpg",
    category: "Wellness",
    height: 24
  }
];

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 pt-6 pb-20 md:pt-20 md:pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover</h1>
        <p className="text-gray-500">Explore the latest trends and stories</p>
      </div>
      
      <div className="flex overflow-x-auto pb-4 mb-6 -mx-4 px-4 space-x-2 no-scrollbar">
        {["All", "Travel", "Food", "Fashion", "Technology", "Fitness", "Art", "Wellness"].map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              category === "All" 
                ? "bg-vibe-red text-white" 
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      <MasonryGrid items={contentItems} />
    </div>
  );
};

export default HomePage;
