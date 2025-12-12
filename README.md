# 🔍 Lost & Found Web Application

A beginner-friendly Lost & Found web application built for college hackathons using vanilla HTML, CSS, and JavaScript.

## 📁 Project Structure

\`\`\`
lost-and-found/
│
├── index.html          # Home page displaying all lost items
├── upload.html         # Form to upload new lost items
├── item.html          # Detailed view of a single item
├── style.css          # All styles for the application
├── script.js          # Shared JavaScript functions
└── README.md          # Project documentation
\`\`\`

## ✨ Features

### Core Features
- **Home Page**: Browse all lost items in a responsive grid layout
- **Search & Filter**: Search by name, filter by category and location
- **Upload Item**: Report lost items with image, description, location, etc.
- **Item Details**: View full details of any item
- **Mark as Claimed**: Remove items when they're claimed

### Bonus Features
- **Dark Mode**: Toggle between light and dark themes
- **Categories**: Organize items (Electronics, Books, ID Cards, etc.)
- **LocalStorage**: No backend required - all data saved in browser
- **Responsive Design**: Works perfectly on mobile and desktop
- **Image Preview**: See uploaded images before submitting

## 🚀 How to Run

1. **Download all files** to a folder on your computer
2. **Open `index.html`** in any modern web browser
3. **Start uploading items** using the Upload Item page

No installation or server required! Everything runs in your browser.

## 💾 Data Storage

This application uses **localStorage** to save all data directly in your browser:
- Items persist even after closing the browser
- No database or backend server needed
- Perfect for learning and hackathon projects

**Note**: LocalStorage data is specific to each browser. If you clear browser data, items will be deleted.

## 🎨 Customization

### Change Colors
Edit the `:root` variables in `style.css`:
\`\`\`css
:root {
    --primary-color: #3b82f6;  /* Change main color */
    --danger-color: #ef4444;   /* Change delete button color */
}
\`\`\`

### Add New Categories
Edit the category dropdown in `upload.html` and `index.html`:
\`\`\`html
<option value="YourCategory">Your Category</option>
\`\`\`

## 📚 Code Structure Explained

### HTML Files
- **index.html**: Displays items in a grid, includes search/filter
- **upload.html**: Form with validation for submitting new items
- **item.html**: Shows full item details with claim button

### JavaScript (`script.js`)
- **getAllItems()**: Retrieves all items from localStorage
- **saveItem()**: Saves new item to localStorage
- **getItemById()**: Gets specific item by ID
- **deleteItem()**: Removes claimed items
- **generateId()**: Creates unique IDs
- **formatDate()**: Makes dates readable
- **setupDarkMode()**: Handles theme switching

### CSS (`style.css`)
- CSS variables for easy theming
- Flexbox and Grid for layouts
- Responsive design with media queries
- Smooth transitions and hover effects

## 🎯 Future Enhancements

Ideas to improve the project:
- Add user authentication
- Implement a real backend database
- Email notifications when items are claimed
- Advanced image compression
- Multiple image uploads
- Admin panel for moderation

## 🛠️ Technologies Used

- **HTML5**: Structure and content
- **CSS3**: Styling with modern features (Grid, Flexbox, CSS Variables)
- **JavaScript**: Interactivity and data management
- **LocalStorage API**: Client-side data persistence

## 📝 License

Free to use for educational and hackathon purposes!

## 🤝 Contributing

Feel free to fork, modify, and improve this project for your hackathon!

---

**Built with ❤️ for hackathon participants and beginners learning web development**
