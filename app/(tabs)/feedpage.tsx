// FeedPageScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BottomNavBar from '../components/BottomNavBar';
import { query, where, collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../constants/firebase';

export default function FeedPageScreen() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  // Fetch posts when the component mounts
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      // For now, let’s just get all posts with visibility = 'everyone'
      // In the future, you can expand logic to 'friendsOnly', etc.
      const postsData = await fetchPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  // Create a post in Firestore
  const createPost = async (userId, content, visibility = 'everyone') => {
    await addDoc(collection(db, 'posts'), {
      author: userId,
      content,
      dateCreated: new Date().toISOString(),
      likes: [],
      comments: [],
      visibility,
    });
  };

  // Basic fetch function for demonstration
  const fetchPosts = async () => {
    // If you want to only fetch certain visibility, you can do:
    const q = query(collection(db, 'posts'), where('visibility', '==', 'everyone'));
    const querySnapshot = await getDocs(q);

    // Convert docs to an array
    const postsArray = querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    // Sort by date descending
    return postsArray.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
  };

  // Handle posting
  const handlePost = async () => {
    if (newPost.trim().length === 0) return;

    const user = auth.currentUser; // current logged in user
    if (!user) {
      // handle if user is not logged in
      return;
    }

    try {
      // Create the post in Firestore
      await createPost(user.uid, newPost, 'everyone');
      setNewPost('');
      // Reload posts from Firestore
      loadPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  // For local "like" or "join" logic, you'd need to update Firestore as well
  const handleReaction = (postId) => {
    // local state update for demonstration
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, reactions: (post.reactions || 0) + 1 } : post
      )
    );
    // In production, you'd also update Firestore (e.g. increment the 'likes' array).
  };

  const renderPost = ({ item }) => (
    <View style={styles.post}>
      <Text style={styles.author}>{item.author}</Text>
      <Text style={styles.content}>{item.content}</Text>
      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.reactButton}
          onPress={() => handleReaction(item.id)}
        >
          <Text style={styles.reactButtonText}>Join</Text>
        </TouchableOpacity>
        <Text style={styles.reactionsCount}>
          {item.reactions || 0} {item.reactions === 1 ? 'reaction' : 'reactions'}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.newPostContainer}>
        <TextInput
          style={styles.newPostInput}
          placeholder="What are your plans tonight?"
          placeholderTextColor="#aaa"
          value={newPost}
          onChangeText={setNewPost}
        />
        <TouchableOpacity
          style={styles.postButton}
          onPress={handlePost}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#6a11cb', '#2575fc']}
            style={styles.postButtonGradient}
          >
            <Text style={styles.postButtonText}>Post</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />
      <BottomNavBar />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2f',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  newPostContainer: {
    backgroundColor: '#2a2a3c',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  newPostInput: {
    height: 50,
    backgroundColor: '#3a3a4f',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#555',
  },
  postButton: {
    height: 50,
    borderRadius: 12,
    overflow: 'hidden',
  },
  postButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  post: {
    backgroundColor: '#2a2a3c',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  author: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#d1d1d6',
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reactButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#6a11cb',
    borderRadius: 8,
  },
  reactButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  reactionsCount: {
    fontSize: 14,
    color: '#aaa',
  },
});
