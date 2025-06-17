import React, { useEffect, useState } from 'react';
import styles from '../styles/AnimatedBackground.module.css';

const bgCount = 10;
const bgImages = Array.from({ length: bgCount }, (_, i) => `/images/bg${i + 1}.png`);

export default function AnimatedBackground() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % bgCount);
    }, 5000); // كل 5 ثواني تتغير الخلفية
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.animatedBg} style={{ backgroundImage: `url(${bgImages[index]})` }} />
  );
}
