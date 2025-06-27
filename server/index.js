const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
// At the top of index.js, modify the Firebase initialization:

// Initialize Firebase Admin
let db;
try {
  const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: "googleapis.com"
  };
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
  
  db = admin.firestore();
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  process.exit(1);
}
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  admin.auth().verifyIdToken(token)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(() => res.sendStatus(403));
};

// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Initialize Firestore and add sample data
async function initializeFirestore() {
  console.log('Starting Firestore initialization...');
  const collections = ['users', 'cats', 'swipes', 'matches'];
  
  try {
    console.log('Checking Firestore connection...');
    // Test the connection
    await db.listCollections();
    console.log('Successfully connected to Firestore');
    
    for (const collection of collections) {
      console.log(`Checking collection: ${collection}`);
      const collectionRef = db.collection(collection);
      const snapshot = await collectionRef.limit(1).get();
      
      if (snapshot.empty) {
        console.log(`Creating collection: ${collection}`);
        try {
          await collectionRef.doc('init').set({ 
            _createdAt: admin.firestore.FieldValue.serverTimestamp(),
            _purpose: 'Initial collection creation'
          });
          console.log(`Successfully created collection: ${collection}`);
        } catch (error) {
          console.error(`Error creating collection ${collection}:`, error);
          throw error;
        }
      } else {
        const count = (await collectionRef.count().get()).data().count;
        console.log(`Collection ${collection} exists with ${count} documents`);
      }
    }

    console.log('Starting to add sample data...');
    await addSampleData();
    console.log('Firestore initialization completed successfully');
  } catch (error) {
    console.error('Error in initializeFirestore:', error);
    throw error;
  }
}

// Add sample cat data
async function addSampleData() {
  console.log('Starting to add sample data...');
  try {
    const catsRef = db.collection('cats');
    
    // First, delete any existing test data (documents with _purpose field)
    console.log('Clearing existing test data...');
    const testDataSnapshot = await catsRef.where('_purpose', '==', 'Initial collection creation').get();
    const batch = db.batch();
    
    testDataSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Also delete the init document if it exists
    const initDoc = catsRef.doc('init');
    const initDocSnapshot = await initDoc.get();
    if (initDocSnapshot.exists) {
      batch.delete(initDoc);
    }
    
    await batch.commit();
    console.log('Cleared existing test data');
    
    console.log('Adding sample cats...');
    const sampleCats = [
      {
        name: 'Whiskers',
        age: 2,
        breed: 'Tabby',
        bio: 'Professional biscuit maker and sunbeam connoisseur',
        userId: 'sample-user-1',
        ownerName: 'Cat Lover 1',
        photos: [
          'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzV4aW81bW1tcXJpdThhM2Fjcm56b2Ntb2oxd2R3cXdhcW5kZWVqNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/MDJ9IbxxvDUQM/giphy.gif',
          'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzV4aW81bW1tcXJpdThhM2Fjcm56b2Ntb2oxd2R3cXdhcW5kZWVqNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/GeimqsH0TLDt4tScGw/giphy.gif',
          'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzV4aW81bW1tcXJpdThhM2Fjcm56b2Ntb2oxd2R3cXdhcW5kZWVqNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/6C4y1oxC6182MsyjvK/giphy.gif'
        ],
        image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzV4aW81bW1tcXJpdThhM2Fjcm56b2Ntb2oxd2R3cXdhcW5kZWVqNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/MDJ9IbxxvDUQM/giphy.gif',
        video: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzV4aW81bW1tcXJpdThhM2Fjcm56b2Ntb2oxd2R3cXdhcW5kZWVqNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/lJNoBCvQYp7nq/giphy.gif',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        name: 'Mittens',
        age: 3,
        breed: 'Siamese',
        bio: 'Drama queen with a heart of gold and a voice to match',
        userId: 'sample-user-2',
        ownerName: 'Cat Lover 2',
        photos: [
          'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzV4aW81bW1tcXJpdThhM2Fjcm56b2Ntb2oxd2R3cXdhcW5kZWVqNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/mlvseq9yvZhba/giphy.gif',
          'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzV4aW81bW1tcXJpdThhM2Fjcm56b2Ntb2oxd2R3cXdhcW5kZWVqNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ToMjGppLes0ENI5osCc/giphy.gif',
          'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzV4aW81bW1tcXJpdThhM2Fjcm56b2Ntb2oxd2R3cXdhcW5kZWVqNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/vFKqnCdLPNOKc/giphy.gif'
        ],
        image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzV4aW81bW1tcXJpdThhM2Fjcm56b2Ntb2oxd2R3cXdhcW5kZWVqNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/5i7umUqAOYYEw/giphy.gif',
        video: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzV4aW81bW1tcXJpdThhM2Fjcm56b2Ntb2oxd2R3cXdhcW5kZWVqNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/HMSLfCl5BsXoQ/giphy.gif',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        name: 'Luna',
        age: 1,
        breed: 'Ragdoll',
        bio: 'Professional keyboard tester and paperweight',
        userId: 'sample-user-3',
        ownerName: 'Cat Lover 3',
        photos: [
          'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzV4aW81bW1tcXJpdThhM2Fjcm56b2Ntb2oxd2R3cXdhcW5kZWVqNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/GyJ8p0Um850ic/giphy.gif',
          'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzV4aW81bW1tcXJpdThhM2Fjcm56b2Ntb2oxd2R3cXdhcW5kZWVqNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/5HSYaZTcRpYnS/giphy.gif',
          'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzV4aW81bW1tcXJpdThhM2Fjcm56b2Ntb2oxd2R3cXdhcW5kZWVqNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/C23cMUqoZdqMg/giphy.gif'
        ],
        image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzV4aW81bW1tcXJpdThhM2Fjcm56b2Ntb2oxd2R3cXdhcW5kZWVqNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/yFQ0ywscgobJK/giphy.gif',
        video: 'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3NjFmcnQ2MGVydTVjanIzbjM3MjViOWMzc2Njcmp6aHVzMzg3eHAzdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/nUQm3AirLKdRBq1yhv/giphy.gif',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        name: 'Oliver',
        age: 4,
        breed: 'Maine Coon',
        bio: 'Gentle giant who loves cuddles and playing fetch',
        userId: 'sample-user-4',
        ownerName: 'Cat Lover 4',
        photos: [
          'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YjYyczU2Ymw4azlqemFvaXFncWg0NHp2c2FucnNkejAwM2ZtcjVrdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/WWyT3VgEgIK8U/giphy.gif',
          'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YjYyczU2Ymw4azlqemFvaXFncWg0NHp2c2FucnNkejAwM2ZtcjVrdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/JwW4oYd3Wjv6E/giphy.gif',
          'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzV4aW81bW1tcXJpdThhM2Fjcm56b2Ntb2oxd2R3cXdhcW5kZWVqNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/VOPK1BqsMEJRS/giphy.gif'
        ],
        image: 'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YjYyczU2Ymw4azlqemFvaXFncWg0NHp2c2FucnNkejAwM2ZtcjVrdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/CqVNwrLt9KEDK/giphy.gif',
        video: 'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YjYyczU2Ymw4azlqemFvaXFncWg0NHp2c2FucnNkejAwM2ZtcjVrdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/6C4y1oxC6182MsyjvK/giphy.gif',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    ];

    console.log(`Preparing to add ${sampleCats.length} sample cats...`);
    const addBatch = db.batch();
    
    sampleCats.forEach((cat, index) => {
      console.log(`Adding cat ${index + 1}: ${cat.name}`);
      const docRef = catsRef.doc(); // Let Firestore auto-generate the ID
      addBatch.set(docRef, cat);
    });

    console.log('Committing batch write...');
    await addBatch.commit();
    console.log('Successfully added sample cats to Firestore');
    
    // Verify the data was added
    const verifySnapshot = await catsRef.get();
    console.log(`Verification: Found ${verifySnapshot.size} cats in the collection`);
    
  } catch (error) {
    console.error('Error in addSampleData:', error);
    throw error;
  }
}

app.get('/api/cats', authenticateToken, async (req, res) => {
  try {
    console.log('[API] Fetching cats for user:', req.user.uid);
    const currentUserId = req.user.uid;

    try {
      // First, get all cats
      console.log('[API] Fetching all cats from Firestore...');
      const catsSnapshot = await db.collection('cats').get();
      console.log(`[API] Found ${catsSnapshot.size} total cats in collection`);
      
      // Get all cat IDs the user has already swiped on
      console.log('[API] Fetching user swipes...');
      let userSwipes;
      try {
        userSwipes = await db.collection('swipes')
          .where('userId', '==', currentUserId)
          .get();
        console.log(`[API] Found ${userSwipes.size} swipes for user`);
      } catch (swipeError) {
        console.error('[API] Error fetching user swipes:', swipeError);
        throw new Error(`Failed to fetch user swipes: ${swipeError.message}`);
      }
      
      const swipedCatIds = userSwipes.docs.map(doc => {
        const data = doc.data();
        if (!data.catId) {
          console.warn(`[API] Warning: Swipe doc ${doc.id} is missing catId`, data);
        }
        return data.catId;
      }).filter(Boolean); // Filter out any undefined values
      
      console.log(`[API] User has swiped on ${swipedCatIds.length} unique cats`);
      
      // Filter cats that don't belong to the current user and haven't been swiped
      const availableCats = [];
      let filteredOutCount = 0;
      
      catsSnapshot.forEach(doc => {
        const catData = doc.data();
        if (!catData.userId) {
          console.warn(`[API] Warning: Cat ${doc.id} is missing userId`, catData);
          return; // Skip cats without userId
        }
        
        if (catData.userId === currentUserId) {
          filteredOutCount++;
          return; // Skip user's own cats
        }
        
        if (swipedCatIds.includes(doc.id)) {
          filteredOutCount++;
          return; // Skip already swiped cats
        }
        
        availableCats.push({
          id: doc.id,
          ...catData
        });
      });
      
      console.log(`[API] Filtered out ${filteredOutCount} cats, ${availableCats.length} available for swiping`);
      
      // If no cats are available, return a friendly message
      if (availableCats.length === 0) {
        console.log('[API] No cats available for swiping');
        return res.status(200).json({
          success: true,
          message: "No more cats to swipe! Try again later or wait for new users to join.",
          cats: []
        });
      }
      
      // Shuffle the cats array to get random order
      const shuffledCats = [...availableCats].sort(() => Math.random() - 0.5);
      
      console.log(`[API] Returning ${shuffledCats.length} cats for swiping`);
      return res.json({
        success: true,
        cats: shuffledCats
      });
      
    } catch (error) {
      console.error('[API] Error in /api/cats handler:', error);
      throw error; // This will be caught by the outer try-catch
    }
    
  } catch (error) {
    console.error('[API] /api/cats endpoint error:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.uid
    });
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch cats',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


app.get('/api/cats/:catId', authenticateToken, async (req, res) => {
  try {
    const { catId } = req.params;
    
    console.log(`[API] Fetching cat with ID: ${catId}`);
    console.log(`[API] Request from user: ${req.user.uid}`);
    
    if (!catId) {
      console.error('[API] Error: No cat ID provided');
      return res.status(400).json({
        success: false,
        error: 'Cat ID is required'
      });
    }

    console.log(`[API] Querying Firestore for cat: ${catId}`);
    const catDoc = await db.collection('cats').doc(catId).get();
    
    if (!catDoc.exists) {
      console.error(`[API] Error: Cat not found with ID: ${catId}`);
      return res.status(404).json({
        success: false,
        error: 'Cat not found'
      });
    }

    const catData = catDoc.data();
    console.log(`[API] Found cat: ${catData.name} (${catId})`);
    
    // Get owner information
    let ownerInfo = {};
    const ownerId = catData.userId;
    
    if (ownerId) {
      console.log(`[API] Fetching owner info for user: ${ownerId}`);
      try {
        const ownerDoc = await db.collection('users').doc(ownerId).get();
        if (ownerDoc.exists) {
          const ownerData = ownerDoc.data();
          ownerInfo = {
            id: ownerDoc.id,
            name: ownerData.displayName || 'Unknown',
            email: ownerData.email || '',
            photoURL: ownerData.photoURL || ''
          };
          console.log(`[API] Found owner: ${ownerInfo.name}`);
        } else {
          console.warn(`[API] Owner document not found for user: ${ownerId}`);
        }
      } catch (ownerError) {
        console.error(`[API] Error fetching owner info:`, ownerError);
        // Continue without owner info if there's an error
      }
    } else {
      console.warn(`[API] No owner ID found for cat: ${catId}`);
    }

    const response = {
      success: true,
      ...catData,
      id: catDoc.id,
      owner: ownerInfo
    };

    console.log(`[API] Sending response for cat: ${catId}`);
    res.json(response);
    
  } catch (error) {
    console.error(`[API] Error in /api/cats/:catId:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cat',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.post('/api/swipe', authenticateToken, async (req, res) => {
  try {
    const { catId, liked } = req.body;
    const currentUserId = req.user.uid;

    // Check if cat exists
    const catDoc = await db.collection('cats').doc(catId).get();
    if (!catDoc.exists) {
      return res.status(404).json({ error: 'Cat not found' });
    }

    const catData = catDoc.data();
    const catOwnerId = catData.userId;

    // Check if user already swiped on this cat
    const existingSwipe = await db.collection('swipes')
      .where('userId', '==', currentUserId)
      .where('catId', '==', catId)
      .limit(1)
      .get();

    // Update or create swipe
    let swipeRef;
    if (!existingSwipe.empty) {
      swipeRef = existingSwipe.docs[0].ref;
      await swipeRef.update({
        liked,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    } else {
      swipeRef = await db.collection('swipes').add({
        userId: currentUserId,
        catId,
        liked,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // Handle matching logic only if user liked the profile
    if (liked) {
      // Check if the cat owner has already liked the current user's profile
      const mutualCheck = await db.collection('swipes')
        .where('userId', '==', catOwnerId)
        .where('catId', '==', currentUserId)
        .where('liked', '==', true)
        .limit(1)
        .get();

      // Check if this is a sample user (always match with sample users)
      const isSampleUser = catData.isSample || false;
      const isMatch = isSampleUser || !mutualCheck.empty;

      // Create or update match document
      const matchData = {
        users: [currentUserId, catOwnerId],
        catId,
        isMatch,
        usersInfo: {
          [currentUserId]: (await db.collection('users').doc(currentUserId).get()).data(),
          [catOwnerId]: catData
        },
        lastActivity: admin.firestore.FieldValue.serverTimestamp(),
        status: isMatch ? 'matched' : 'pending'
      };

      // Check if match already exists
      const existingMatch = await db.collection('matches')
        .where('users', 'array-contains-any', [currentUserId, catOwnerId])
        .where('catId', '==', catId)
        .limit(1)
        .get();

      if (!existingMatch.empty) {
        // Update existing match
        const matchRef = existingMatch.docs[0].ref;
        await matchRef.update({
          ...matchData,
          isMatch: isMatch || existingMatch.docs[0].data().isMatch
        });
      } else {
        // Create new match
        await db.collection('matches').add({
          ...matchData,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      return res.json({
        success: true,
        isMatch,
        isSampleUser
      });
    }

    res.json({
      success: true,
      isMatch: false
    });

  } catch (error) {
    console.error('Swipe error:', error);
    res.status(500).json({ 
      error: 'Failed to process swipe',
      details: error.message 
    });
  }
});



app.post('/api/swipes', authenticateToken, async (req, res) => {
  try {
    const { catId, liked } = req.body;
    const userId = req.user.uid;

    console.log(`Updating swipe for user ${userId} and cat ${catId}`);
    
    // Check if swipe already exists
    const existingSwipe = await db.collection('swipes')
      .where('userId', '==', userId)
      .where('catId', '==', catId)
      .limit(1)
      .get();
    
    let swipeRef;
    if (!existingSwipe.empty) {
      // Update existing swipe
      swipeRef = existingSwipe.docs[0].ref;
      await swipeRef.update({ liked, timestamp: admin.firestore.FieldValue.serverTimestamp() });
    } else {
      // Create new swipe
      swipeRef = await db.collection('swipes').add({ userId, catId, liked, timestamp: admin.firestore.FieldValue.serverTimestamp() });
    }

    const newSwipe = (await swipeRef.get()).data();
    
    // Check for a match (if this is a like)
    if (liked) {
      const otherUserSwipe = await db.collection('swipes')
        .where('userId', '==', catId) // Assuming catId is the ID of the cat's owner
        .where('catId', '==', userId) // And they've swiped on the current user's cat
        .where('liked', '==', true)
        .limit(1)
        .get();
      
      if (!otherUserSwipe.empty) {
        // It's a match!
        const matchData = {
          users: [userId, catId],
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          user1: userId,
          user2: catId,
          status: 'matched'
        };
        
        await db.collection('matches').add(matchData);
        console.log(`Match created between ${userId} and ${catId}`);
      }
    }
    
    res.status(201).json({ id: swipeRef.id, ...newSwipe });
  } catch (error) {
    console.error('Error saving swipe:', error);
    res.status(500).json({ error: 'Failed to save swipe', details: error.message });
  }
});
app.get('/api/matches', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.uid;
    console.log(`[API] Fetching matches for user: ${currentUserId}`);

    // Get all matches where the current user is involved
    const matchesSnapshot = await db.collection('matches')
      .where('users', 'array-contains', currentUserId)
      .get();

    console.log(`[API] Found ${matchesSnapshot.size} match documents for user`);
    
    if (matchesSnapshot.empty) {
      console.log('[API] No matches found for user');
      return res.json({
        success: true,
        matches: []
      });
    }

    const matches = matchesSnapshot.docs.map(doc => {
      const matchData = doc.data();
      console.log(`[API] Processing match document ${doc.id}:`, JSON.stringify(matchData, null, 2));

      // Find the other user in the match (not the current user)
      const otherUserId = matchData.users.find(id => id !== currentUserId);
      const otherUserInfo = matchData.usersInfo?.[otherUserId] || {};

      console.log(`[API] Other user ID: ${otherUserId}`);
      console.log(`[API] Other user info:`, JSON.stringify(otherUserInfo, null, 2));

      // Determine if this is a mutual match
      const isMutualMatch = matchData.status === 'matched' || 
                          (matchData.users?.length >= 2 && 
                           matchData.users.every(userId => 
                             matchData.usersInfo?.[userId]));

      console.log(`[API] Is mutual match:`, isMutualMatch);

      // Format the match data using userInfo which already contains cat data
      const formattedMatch = {
        matchId: doc.id,
        cat: {
          id: otherUserId,
          ...otherUserInfo,
          userId: otherUserId,
          name: otherUserInfo.name || 'Unknown Cat',
          age: otherUserInfo.age || 1,
          breed: otherUserInfo.breed || 'Mixed',
          image: otherUserInfo.image || otherUserInfo.photoURL || 'https://placekitten.com/300/300',
          bio: otherUserInfo.bio || 'A lovely cat looking for a friend'
        },
        user: {
          id: otherUserId,
          name: otherUserInfo.name || otherUserInfo.displayName || 'Unknown User',
          photoURL: otherUserInfo.photoURL || otherUserInfo.image || null,
          email: otherUserInfo.email || null
        },
        status: matchData.status || 'pending',
        isMatch: isMutualMatch,
        lastActivity: matchData.lastActivity?.toDate() || 
                     matchData.timestamp?.toDate() || 
                     new Date(),
        createdAt: matchData.createdAt?.toDate() || 
                  matchData.timestamp?.toDate() || 
                  new Date()
      };

      console.log(`[API] Formatted match ${doc.id}:`, JSON.stringify(formattedMatch, null, 2));
      return formattedMatch;
    });

    // Sort matches by last activity (most recent first)
    matches.sort((a, b) => {
      const timeA = a.lastActivity || a.createdAt || new Date(0);
      const timeB = b.lastActivity || b.createdAt || new Date(0);
      return timeB - timeA;
    });

    console.log(`[API] Returning ${matches.length} formatted matches`);
    res.json({
      success: true,
      matches
    });

  } catch (error) {
    console.error('[API] Error in /api/matches:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.uid,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch matches',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.post('/api/update-user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const userData = req.body;
    
    await db.collection('users').doc(userId).set(userData, { merge: true });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.post('/api/cats/update', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const catData = req.body;
    
    // Validate required fields
    if (!catData.name || !catData.age || !catData.breed) {
      return res.status(400).json({ error: 'Name, age, and breed are required' });
    }

    // Get user data for the owner info
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data() || {};

    const catProfile = {
      name: catData.name,
      age: catData.age,
      breed: catData.breed,
      bio: catData.bio || '',
      userId,
      ownerName: userData.displayName || 'Anonymous',
      ownerPhoto: userData.photoURL || '',
      photos: Array.isArray(catData.photos) ? catData.photos : [],
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      // Set the first photo as the main image for backward compatibility
      image: Array.isArray(catData.photos) && catData.photos.length > 0 
        ? catData.photos[0] 
        : 'https://placekitten.com/400/400' // Default image if none provided
    };

    // Check if cat profile already exists for this user
    const existingCat = await db.collection('cats')
      .where('userId', '==', userId)
      .limit(1)
      .get();

    let catRef;
    if (!existingCat.empty) {
      // Update existing cat
      catRef = existingCat.docs[0].ref;
      const existingData = existingCat.docs[0].data();
      
      // Preserve creation timestamp
      await catRef.update({
        ...catProfile,
        createdAt: existingData.createdAt || admin.firestore.FieldValue.serverTimestamp()
      });
    } else {
      // Create new cat
      catRef = db.collection('cats').doc();
      await catRef.set({
        ...catProfile,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // Get the updated cat data
    const updatedCat = (await catRef.get()).data();
    
    res.json({
      id: catRef.id,
      ...updatedCat
    });
  } catch (error) {
    console.error('Update cat error:', error);
    res.status(500).json({ 
      error: 'Failed to update cat profile',
      details: error.message 
    });
  }
});

// Get messages for a match
app.get('/api/messages/:matchId', authenticateToken, async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user.uid;

    // Verify the user is part of this match
    const matchDoc = await db.collection('matches').doc(matchId).get();
    if (!matchDoc.exists || !matchDoc.data().users.includes(userId)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Get messages ordered by timestamp
    const messagesSnapshot = await db.collection('messages')
      .where('matchId', '==', matchId)
      .orderBy('timestamp', 'asc')
      .get();

    const messages = [];
    messagesSnapshot.forEach(doc => {
      messages.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().toISOString()
      });
    });

    res.json({ messages });
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Send a new message
app.post('/api/messages', authenticateToken, async (req, res) => {
  try {
    const { matchId, content } = req.body;
    const userId = req.user.uid;

    if (!matchId || !content) {
      return res.status(400).json({ error: 'Match ID and content are required' });
    }

    // Verify the user is part of this match
    const matchDoc = await db.collection('matches').doc(matchId).get();
    if (!matchDoc.exists || !matchDoc.data().users.includes(userId)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Create message
    const messageData = {
      matchId,
      senderId: userId,
      content: content.trim(),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      read: false
    };

    const messageRef = await db.collection('messages').add(messageData);
    const messageDoc = await messageRef.get();

    // Update match last activity
    await db.collection('matches').doc(matchId).update({
      lastActivity: admin.firestore.FieldValue.serverTimestamp(),
      lastMessage: content.trim().substring(0, 100)
    });

    // If the other user is a bot, generate a response
    const otherUserId = matchDoc.data().users.find(id => id !== userId);
    if (otherUserId && otherUserId.startsWith('bot_')) {
      const botResponses = [
        "Meow! 😺",
        "Meow meow! 🐱",
        "Purrrrr... 😻",
        "Meow meow meow! 🐾",
        "Mrow! 😸",
        "Prrrr... meow! 🐈"
      ];
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      // Add a small delay for bot response
      setTimeout(async () => {
        await db.collection('messages').add({
          matchId,
          senderId: otherUserId,
          content: randomResponse,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          read: false
        });
      }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
    }

    const responseMessage = {
      id: messageRef.id,
      ...messageData,
      timestamp: messageData.timestamp.toDate().toISOString()
    };

    res.json({ message: responseMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Mark messages as read
app.post('/api/messages/:matchId/read', authenticateToken, async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user.uid;

    // Verify the user is part of this match
    const matchDoc = await db.collection('matches').doc(matchId).get();
    if (!matchDoc.exists || !matchDoc.data().users.includes(userId)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Mark all unread messages from other users as read
    const messagesSnapshot = await db.collection('messages')
      .where('matchId', '==', matchId)
      .where('senderId', '!=', userId)
      .where('read', '==', false)
      .get();

    const batch = db.batch();
    messagesSnapshot.docs.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });

    await batch.commit();
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
async function startServer() {
  try {
    console.log('Starting server initialization...');
    
    // Initialize Firestore and add sample data
    await initializeFirestore();
    
    // Start listening for requests
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Sample data initialized');
    });
    
    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please free the port or use a different one.`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });
    
    // Handle process termination
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Export the Express app for testing or programmatic use
module.exports = app;

// Only start the server if this file is run directly
if (require.main === module) {
  startServer().catch(error => {
    console.error('Unhandled error in server startup:', error);
    process.exit(1);
  });
}