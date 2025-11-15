// Add sample calendar events for testing
// Run this with: node add-sample-events.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAiieziFvCjPRF0XOvDuEEZU0wCU8Fw2XM",
  authDomain: "jstfnorthwebsite.firebaseapp.com",
  projectId: "jstfnorthwebsite",
  storageBucket: "jstfnorthwebsite.firebasestorage.app",
  messagingSenderId: "722655135910",
  appId: "1:722655135910:web:e9a754e9b06c888d754c67",
  measurementId: "G-NG4JDR0RC4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addSampleEvents() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  const sampleEvents = [
    {
      title: "Sunday Service Food Distribution",
      date: `${year}-${String(month + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
      year: year,
      month: month + 1,
      day: today.getDate(),
      category: "food",
      description: "Weekly food distribution after Sunday service",
      time: "12:00 PM",
      location: "Church Main Hall"
    },
    {
      title: "Transportation to Service",
      date: `${year}-${String(month + 1).padStart(2, '0')}-${String(today.getDate() + 1).padStart(2, '0')}`,
      year: year,
      month: month + 1,
      day: today.getDate() + 1,
      category: "transportation",
      description: "Van pickup for members",
      time: "9:00 AM",
      location: "Various Stops"
    },
    {
      title: "Youth Bible Study",
      date: `${year}-${String(month + 1).padStart(2, '0')}-${String(today.getDate() + 2).padStart(2, '0')}`,
      year: year,
      month: month + 1,
      day: today.getDate() + 2,
      category: "activities",
      description: "Youth group Bible study and fellowship",
      time: "6:00 PM",
      location: "Youth Room"
    },
    {
      title: "Volunteer Meeting",
      date: `${year}-${String(month + 1).padStart(2, '0')}-${String(today.getDate() + 3).padStart(2, '0')}`,
      year: year,
      month: month + 1,
      day: today.getDate() + 3,
      category: "volunteer",
      description: "Monthly volunteer coordination meeting",
      time: "7:00 PM",
      location: "Conference Room"
    },
    {
      title: "Building Maintenance",
      date: `${year}-${String(month + 1).padStart(2, '0')}-${String(today.getDate() + 4).padStart(2, '0')}`,
      year: year,
      month: month + 1,
      day: today.getDate() + 4,
      category: "maintenance",
      description: "Quarterly building maintenance check",
      time: "10:00 AM",
      location: "Church Building"
    }
  ];

  try {
    console.log('Adding sample events...\n');
    
    for (const event of sampleEvents) {
      const docRef = await addDoc(collection(db, 'calendarEvents'), event);
      console.log(`✅ Added: ${event.title} (${event.category}) - ${event.date}`);
    }
    
    console.log('\n🎉 All sample events added successfully!');
    console.log('Visit calendars.html to see them on the calendar');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding events:', error);
    process.exit(1);
  }
}

addSampleEvents();
