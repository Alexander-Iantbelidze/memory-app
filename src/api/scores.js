import db from '../firebase/firebase';

const handleScores = async (req, res) => {
  if (req.method === 'POST') {
    const { name, time } = req.body;
    if (typeof name === 'string' && typeof time === 'number') {
      try {
        await db.collection('scores').add({ name, time });

        const snapshot = await db.collection('scores').orderBy('time').limit(5).get();
        const topScores = snapshot.docs.map(doc => doc.data());

        res.status(201).json(topScores);
      } catch (error) {
        console.error('Error saving score:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      res.status(400).json({ error: 'Invalid input' });
    }
  } else if (req.method === 'GET') {
    try {
      const snapshot = await db.collection('scores').orderBy('time').limit(5).get();
      const topScores = snapshot.docs.map(doc => doc.data());

      res.status(200).json(topScores);
    } catch (error) {
      console.error('Error fetching scores:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
};

export default handleScores;