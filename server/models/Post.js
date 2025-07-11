const mongoose = require('mongoose');
const slugify = require('slugify');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: String,
  subtitle: {
    type: String,
    trim: true,
    maxlength: [200, 'Subtitle cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Please add content']
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot be more than 300 characters']
  },
  featuredImage: {
    type: String, // URL to the image
    default: 'no-photo.jpg' // A default image if none is provided
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: true
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    // required: true // Assuming posts must have an author (admin)
  },
  metaTitle: {
    type: String,
    maxlength: [70, 'Meta title cannot be more than 70 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot be more than 160 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create post slug from the title
PostSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Auto-generate metaTitle if not provided
PostSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.metaTitle) {
    this.metaTitle = this.title.substring(0, 70);
  }
  next();
});

// Auto-generate metaDescription if not provided
PostSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.metaDescription) {
    if (this.excerpt) {
        this.metaDescription = this.excerpt.substring(0, 160);
    } else {
        this.metaDescription = this.content.substring(0, 160);
    }
  }
  next();
});

// Update `updatedAt` field before saving
PostSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});


module.exports = mongoose.model('Post', PostSchema);
