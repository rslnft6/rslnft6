import React, { useEffect, useState } from 'react';
import styles from '../styles/AnimatedBackground.module.css';

// قائمة الصور المتوفرة مع الامتدادات المختلفة
const bgImages = [
  '/images/bg1.png',
  '/images/bg2.png',
  '/images/bg5.png',
  '/images/bg10.jpg',
];

export default function AnimatedBackground() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % bgImages.length);
    }, 5000); // كل 5 ثواني تتغير الخلفية
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.animatedBg} style={{ backgroundImage: `url(${bgImages[index]})` }} />
  );
}
